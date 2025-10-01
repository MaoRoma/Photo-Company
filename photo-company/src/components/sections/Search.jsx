import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '../../contexts/LanguageContext';
import './Search.css';
import { supabase } from '../../lib/supabase';
// Client-side canvas watermark generator (no edge function)
const generateWatermarkedDataUrl = async (imageUrl) => {
  // Add cache-busting to avoid stale CORS responses
  const urlObj = new URL(imageUrl);
  urlObj.searchParams.set('cb', String(Date.now()));
  const bustedUrl = urlObj.toString();

  try {
    const res = await fetch(bustedUrl, { mode: 'cors', cache: 'no-store' });
    if (!res.ok) return imageUrl;
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);

    const bitmap = await createImageBitmap(blob).catch(() => null);
    const img = new Image();
    img.crossOrigin = 'anonymous';

    const loadPromise = new Promise((resolve) => {
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
    });
    img.src = objectUrl;
    const loaded = await loadPromise;
    if (!loaded && !bitmap) {
      URL.revokeObjectURL(objectUrl);
      return imageUrl;
    }

    const sourceW = bitmap ? bitmap.width : img.naturalWidth || img.width;
    const sourceH = bitmap ? bitmap.height : img.naturalHeight || img.height;
    const maxDim = 1400;
    const scale = Math.min(1, maxDim / Math.max(sourceW, sourceH));
    const targetW = Math.max(1, Math.round(sourceW * scale));
    const targetH = Math.max(1, Math.round(sourceH * scale));

    const canvas = document.createElement('canvas');
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      URL.revokeObjectURL(objectUrl);
      return imageUrl;
    }

    if (bitmap) {
      ctx.drawImage(bitmap, 0, 0, targetW, targetH);
    } else {
      ctx.drawImage(img, 0, 0, targetW, targetH);
    }

    // Watermark tiling
    const text = 'hiraizumi';
    const diagonal = Math.sqrt(targetW * targetW + targetH * targetH);
    const fontSize = Math.max(20, Math.floor(diagonal * 0.05));
    const step = Math.floor(fontSize * 3.5);

    ctx.save();
    ctx.globalAlpha = 0.28;
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `${fontSize}px sans-serif`;
    ctx.translate(targetW / 2, targetH / 2);
    ctx.rotate((-30 * Math.PI) / 180);
    ctx.translate(-targetW / 2, -targetH / 2);
    for (let y = -step; y < targetH + step; y += step) {
      for (let x = -step; x < targetW + step; x += step) {
        ctx.fillText(text, x, y);
      }
    }
    ctx.restore();

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    URL.revokeObjectURL(objectUrl);
    return dataUrl;
  } catch (err) {
    console.warn('Watermark generation failed:', err);
    return imageUrl;
  }
};

const Search = () => {
  const [searchType, setSearchType] = useState('session');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [pendingOrder, setPendingOrder] = useState(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const { t } = useLanguage();

  // Check for payment return and auto-verify
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentSuccess = urlParams.get('payment');
    const orderId = urlParams.get('order_id');
    
    if (paymentSuccess === 'success' && orderId) {
      // Automatically verify payment when user returns
      handlePaymentReturn(orderId);
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
    } else {
      // Check for pending order in localStorage
      const storedOrder = localStorage.getItem('pendingOrder');
      if (storedOrder) {
        try {
          const orderData = JSON.parse(storedOrder);
          setPendingOrder(orderData);
        } catch (error) {
          console.error('Error parsing stored order:', error);
          localStorage.removeItem('pendingOrder');
        }
      }
    }
  }, []);

  // Handle payment return from Square
  const handlePaymentReturn = async (orderId) => {
    try {
      setIsVerifyingPayment(true);
      
      // Find the pending order
      const { data: order, error } = await supabase
        .from('pending_orders')
        .select('*')
        .eq('order_id', orderId)
        .single();
      
      if (error || !order) {
        alert('Order not found. Please contact support.');
        return;
      }
      
      // Set pending order state to show verification UI
      setPendingOrder({
        orderId: order.order_id,
        customerEmail: order.customer_email,
        photoName: order.photo_name,
        photoIndex: 0
      });
      
      // Automatically verify payment
      await verifyPayment();
      
      // Clear localStorage after successful verification
      localStorage.removeItem('pendingOrder');
      
    } catch (error) {
      console.error('Error handling payment return:', error);
      alert('Error processing payment return. Please try verifying manually.');
    } finally {
      setIsVerifyingPayment(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      alert('Please enter a Session ID');
      return;
    }

    setIsSearching(true);
    try {
      // Search for session in database
      const { data, error } = await supabase
        .from('photo_sessions')
        .select('id, photos_count, photo_paths, status, created_at, expires_at')
        .eq('id', searchTerm.trim())
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows found
          setSearchResults([]);
          alert('No photos found for this Session ID. Please check your Session ID and try again.');
          return;
        }
        throw error;
      }

      if (data) {
        // Hide expired sessions for customers
        try {
          if (data.expires_at && new Date(data.expires_at).getTime() <= Date.now()) {
            setSearchResults([]);
            alert('This session has expired. Please contact support to recover your photos.');
            return;
          }
        } catch (_) {
          // ignore parse issues
        }
        // photo_paths should be an array (JSONB format)
        const photoPaths = Array.isArray(data.photo_paths) 
          ? data.photo_paths 
          : [];

        // Build watermarked public URLs from wm/<path> in the same 'photos' bucket
        const originalPaths = photoPaths.filter(path => path && !String(path).startsWith('database:'));
        const wmPublicUrls = originalPaths.map(path => {
          const wmPath = `wm/${String(path)}`;
          const { data } = supabase.storage.from('photos').getPublicUrl(wmPath);
          const buster = `v=${Date.now()}`;
          return data.publicUrl ? `${data.publicUrl}${data.publicUrl.includes('?') ? '&' : '?'}${buster}` : '';
        });

        // Prefer server-stored watermarked copies (wm/). As a fallback, apply client canvas watermark
        const watermarkedPreviewUrls = await Promise.all(wmPublicUrls.map(async (url) => {
          if (!url) return '';
          return await generateWatermarkedDataUrl(url);
        }));

        // Keep original paths for post‑purchase signed URL
        const originalPhotoPaths = originalPaths;

        setSearchResults([{
          type: 'session_info',
          sessionId: data.id,
          photosCount: data.photos_count,
          photoUrls: watermarkedPreviewUrls,
          originalPhotoPaths: originalPhotoPaths,
          photoNames: photoPaths,
          status: data.status,
          createdAt: data.created_at
        }]);
      }
    } catch (err) {
      console.error('Search error:', err);
      setSearchResults([]);
      alert('Error searching for photos: ' + err.message);
    } finally {
      setIsSearching(false);
    }
  };

  const handleRefresh = () => {
    if (searchTerm) {
      handleSearch({ preventDefault: () => {} });
    }
  };

  const handleView = (photoUrl, photoIndex, photoName) => {
    setSelectedPhoto({
      url: photoUrl,
      index: photoIndex,
      name: photoName
    });
    setIsPreviewModalOpen(true);
    // Reset any previous order states when opening a new photo
    setPendingOrder(null);
    setCompletedOrder(null);
  };

  // When the preview modal opens for a photo, check if there's a completed purchase already
  useEffect(() => {
    const checkIfAlreadyPurchased = async () => {
      try {
        if (!isPreviewModalOpen || !selectedPhoto || searchResults.length === 0) return;
        // Use photo index rather than matching preview URL (which may change due to cache-busting)
        const currentResult = searchResults[0];
        if (!currentResult || !currentResult.originalPhotoPaths || typeof selectedPhoto.index !== 'number') return;
        const originalPhotoPath = currentResult.originalPhotoPaths[selectedPhoto.index];

        // Look for the most recent order for this photo (completed or pending)
        const { data, error } = await supabase
          .from('pending_orders')
          .select('order_id, customer_email, status, download_url, completed_at, created_at, photo_name')
          .eq('photo_path', originalPhotoPath)
          .in('status', ['completed', 'pending'])
          .order('completed_at', { ascending: false, nullsFirst: false })
          .order('created_at', { ascending: false })
          .limit(1);

        if (!error && data && data.length > 0) {
          const latest = data[0];
          if (latest.status === 'completed') {
            setCompletedOrder({ orderId: latest.order_id, customerEmail: latest.customer_email });
          } else if (latest.status === 'pending') {
            // Do not show Verify button for unpaid orders; keep Buy Now visible
            setPendingOrder(null);
          }
        }
      } catch (e) {
        console.warn('Completed purchase check failed:', e);
      }
    };
    checkIfAlreadyPurchased();
  }, [isPreviewModalOpen, selectedPhoto, searchResults]);

  const handleSquarePurchase = async (photoUrl, photoIndex) => {
    if (isCreatingOrder) return;
    try {
      setIsCreatingOrder(true);
      // Find the current search result to get original photo path
      // Use the first (and only) search result and the provided index to locate the original photo
      const currentResult = searchResults[0];
      
      if (!currentResult || !currentResult.originalPhotoPaths) {
        alert('Error: Unable to find original photo for download');
        return;
      }

      const originalPhotoPath = currentResult.originalPhotoPaths[photoIndex];
      const photoName = `Professional Portrait ${photoIndex + 1}`;
      
      // Use placeholder values for customer info (will be collected from Square payment)
      const customerEmail = 'pending@payment.com';
      const customerName = 'Customer';

      // Reuse existing pending order if one exists for this photo/email
      const { data: existing, error: findErr } = await supabase
        .from('pending_orders')
        .select('order_id')
        .eq('photo_path', originalPhotoPath)
        .eq('customer_email', customerEmail)
        .eq('status', 'pending')
        .maybeSingle();

      let orderId = existing?.order_id || `order_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

      // If no existing, try insert; if race hits 23505 due to unique index, reselect
      if (!existing) {
        const { error: insertErr } = await supabase
          .from('pending_orders')
          .insert({
            order_id: orderId,
            photo_path: originalPhotoPath,
            photo_name: photoName,
            customer_email: customerEmail,
            customer_name: customerName,
            session_id: currentResult.sessionId,
            amount: 100.00,
            status: 'pending'
          });

        if (insertErr) {
          if (insertErr.code === '23505') {
            const { data: again } = await supabase
              .from('pending_orders')
              .select('order_id')
              .eq('photo_path', originalPhotoPath)
              .eq('customer_email', customerEmail)
              .eq('status', 'pending')
              .maybeSingle();
            orderId = again?.order_id || orderId;
          } else {
            console.error('Error creating pending order:', insertErr);
            alert('Error creating order. Please try again.');
            return;
          }
        }
      }

      // Store order info for verification (mark as client-side pending)
      setPendingOrder({ orderId, customerEmail, photoName, photoIndex, status: 'pending' });

      // Redirect to Square payment with order_id parameter
      const squareUrl = `https://square.link/u/eF0FryOx?src=embed&order_id=${encodeURIComponent(orderId)}`;
      console.log('Redirecting to Square payment URL:', squareUrl);
      
      // Store order info in localStorage for when user returns
      localStorage.setItem('pendingOrder', JSON.stringify({ orderId, customerEmail, photoName, photoIndex, status: 'pending' }));
      
      // Redirect to Square payment
      window.location.href = squareUrl;

    } catch (error) {
      console.error('Purchase error:', error);
      alert('Error processing purchase: ' + error.message);
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const verifyPayment = async () => {
    // Prefer pending order from current flow; otherwise allow completed order download
    const orderForVerification = pendingOrder || completedOrder;
    if (!orderForVerification) {
      alert('No order found for this photo');
      return;
    }

    setIsVerifyingPayment(true);
    try {
      const response = await fetch(`${supabase.supabaseUrl}/functions/v1/verify-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabase.supabaseKey}`
        },
        body: JSON.stringify({
          orderId: orderForVerification.orderId,
          customerEmail: orderForVerification.customerEmail
        })
      });

      const result = await response.json();

      if (result.success && result.status === 'completed') {
        // Capture values before clearing state to avoid null reference errors
        const baseName = pendingOrder?.photoName || selectedPhoto?.name || 'photo';
        const displayIndex = (pendingOrder?.photoIndex ?? selectedPhoto?.index ?? 0) + 1;
        
        // Download the photo
        const link = document.createElement('a');
        link.href = result.downloadUrl;
        link.download = `${String(baseName).replace(/\s+/g, '-').toLowerCase()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Close modal and reset state
        closePreviewModal();
        setPendingOrder(null);
        setCompletedOrder(null);
        
        // Use captured values for alert message
        alert(`Payment verified! Photo ${displayIndex} is downloading.`);
      } else {
        alert('Payment not yet verified. Please complete payment on Square and try again.');
      }
    } catch (error) {
      console.error('Verification error:', error);
      alert('Error verifying payment: ' + error.message);
    } finally {
      setIsVerifyingPayment(false);
    }
  };

  const closePreviewModal = () => {
    setIsPreviewModalOpen(false);
    setSelectedPhoto(null);
    setPendingOrder(null);
  };

  return (
    <section id="search" className="search-section home-section">
      <div className="container">
        <h2>{t('findYourPhotos')}</h2>
        <p>{t('searchSubtitle')}</p>
        
        <div className="search-container">
          {/* Email option removed; only Session ID search is available */}
          
          <form className="search-form" onSubmit={handleSearch}>
            <div className="input-group">
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('enterSessionId')}
              />
              <button type="submit" className="btn btn-primary" disabled={isSearching}>
                <FontAwesomeIcon icon={faSearch} /> {t('search')}
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={handleRefresh}
                title="Check for new photos"
                disabled={isSearching}
              >
                <FontAwesomeIcon icon={faSyncAlt} spin={isSearching} />
              </button>
            </div>
          </form>
        </div>

        {searchResults.length > 0 && (
          <div className="search-results">
            <h3>Your Photos</h3>
            {searchResults.map((result, index) => (
              <div key={index} className="photos-container">
                {result.photoUrls && result.photoUrls.length > 0 && (
                  <div className="photos-grid">
                    {result.photoUrls.map((url, idx) => (
                      <div key={idx} className="photo-card">
                        <div className="photo-image-container">
                          <img 
                            src={url || (result.originalPublicUrls ? result.originalPublicUrls[idx] : '')} 
                            alt={`Professional Portrait ${idx + 1}`}
                            className="photo-image no-save"
                            draggable={false}
                            onContextMenu={(e) => e.preventDefault()}
                            onDragStart={(e) => e.preventDefault()}
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              console.log('Image failed to load:', url);
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'block';
                            }}
                            onLoad={() => {
                              console.log('Image loaded successfully:', url);
                            }}
                          />
                          <div className="wm-tiles" aria-hidden="true"></div>
                          <div className="photo-error" style={{display: 'none'}}>
                            <p>Photo not available</p>
                            <small>{result.photoNames[idx]}</small>
                          </div>
                          <div className="watermark-overlay">
                            <span>Watermarked</span>
                          </div>
                        </div>
                        <div className="photo-details">
                          <h4 className="photo-title">Professional Portrait {idx + 1}</h4>
                          <p className="photo-id">Photo ID: PHOTO{String(idx + 1).padStart(3, '0')}</p>
                          <p className="photo-type">Watermarked Preview</p>
                          <div className="photo-footer">
                            <span className="photo-price">¥100</span>
                            <button className="view-btn" onClick={() => handleView(url, idx, `Professional Portrait ${idx + 1}`)}>
                              View
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Purchase Photo Modal */}
      {isPreviewModalOpen && selectedPhoto && (
        <div className="purchase-modal-overlay" onClick={closePreviewModal}>
          <div className="purchase-modal" onClick={(e) => e.stopPropagation()}>
            <div className="purchase-modal-header">
              <h2>Purchase Photo</h2>
              <button className="close-btn" onClick={closePreviewModal}>
                ×
              </button>
            </div>
            
            <div className="purchase-modal-content">
              <div className="photo-preview">
                <img 
                  src={selectedPhoto.url} 
                  alt={selectedPhoto.name}
                  className="preview-photo no-save"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                  onDragStart={(e) => e.preventDefault()}
                  referrerPolicy="no-referrer"
                />
                <div className="wm-tiles" aria-hidden="true" style={{ borderRadius: '12px' }}></div>
              </div>
              
              <div className="packages-section">
                <h3>Choose Your Package</h3>
                <div className="packages-grid">
                  <div className="package-card">
                    <h4>Digital Download</h4>
                    <div className="package-price">¥100</div>
                    <ul className="package-features">
                      <li>✓ High-resolution JPG</li>
                      <li>✓ No watermark</li>
                      <li>✓ Perfect for social media</li>
                      <li>✓ Instant download</li>
                    </ul>

                    {completedOrder ? (
                      <div style={{ textAlign: 'center' }}>
                        <p style={{ marginBottom: '10px', color: '#666' }}>
                          Purchase confirmed: {completedOrder.orderId}
                        </p>
                        <button 
                          className="package-btn digital-btn" 
                          onClick={verifyPayment}
                          disabled={isVerifyingPayment}
                          style={{
                            display: 'inline-block',
                            fontSize: '16px',
                            lineHeight: '40px',
                            height: '40px',
                            color: '#ffffff',
                            minWidth: '200px',
                            backgroundColor: isVerifyingPayment ? '#ccc' : '#28a745',
                            textAlign: 'center',
                            borderRadius: '6px',
                            border: 'none',
                            cursor: isVerifyingPayment ? 'not-allowed' : 'pointer'
                          }}
                        >
                          {isVerifyingPayment ? 'Preparing...' : 'Download'}
                        </button>
                      </div>
                    ) : !pendingOrder ? (
                      <div style={{
                        overflow: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        width: '259px',
                        background: '#FFFFFF',
                        border: '1px solid rgba(0, 0, 0, 0.1)',
                        boxShadow: '-2px 10px 5px rgba(0, 0, 0, 0)',
                        borderRadius: '10px',
                        fontFamily: 'SQ Market, SQ Market, Helvetica, Arial, sans-serif'
                      }}>
                        <div style={{ padding: '20px' }}>
                          <p style={{
                            fontSize: '18px',
                            lineHeight: '20px',
                            fontWeight: '600'
                          }}>¥100</p>
                          <button 
                            onClick={() => handleSquarePurchase(selectedPhoto.url, selectedPhoto.index)}
                            style={{
                              display: 'inline-block',
                              fontSize: '18px',
                              lineHeight: '48px',
                              height: '48px',
                              color: '#ffffff',
                              minWidth: '212px',
                              background: '#006aff',
                              textAlign: 'center',
                              boxShadow: '0 0 0 1px rgba(0,0,0,.1) inset',
                              borderRadius: '6px',
                              border: 'none',
                              cursor: isCreatingOrder ? 'not-allowed' : 'pointer',
                              opacity: isCreatingOrder ? 0.6 : 1,
                              fontFamily: 'SQ Market, Helvetica, Arial, sans-serif'
                            }}
                            disabled={isCreatingOrder}
                          >
                            {isCreatingOrder ? 'Creating order...' : 'Buy Now'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center' }}>
                        <p style={{ marginBottom: '10px', color: '#666' }}>
                          Order created: {pendingOrder.orderId}
                        </p>
                        <button 
                          className="package-btn digital-btn" 
                          onClick={verifyPayment}
                          disabled={isVerifyingPayment}
                          style={{
                            display: 'inline-block',
                            fontSize: '16px',
                            lineHeight: '40px',
                            height: '40px',
                            color: '#ffffff',
                            minWidth: '200px',
                            backgroundColor: isVerifyingPayment ? '#ccc' : '#28a745',
                            textAlign: 'center',
                            borderRadius: '6px',
                            border: 'none',
                            cursor: isVerifyingPayment ? 'not-allowed' : 'pointer'
                          }}
                        >
                          {isVerifyingPayment ? 'Verifying...' : 'Verify Payment & Download'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Search;