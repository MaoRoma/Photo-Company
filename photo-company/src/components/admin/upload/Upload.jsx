import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '../../../contexts/LanguageContext';
import './Upload.css';
import { supabase } from '../../../lib/supabase';

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

const Upload = () => {
  const { t } = useLanguage();
  const [sessionId, setSessionId] = useState('');
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [sessionIdError, setSessionIdError] = useState('');

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).filter(file => file.type.startsWith('image/'));
    setPhotos(prev => [...prev, ...files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sessionId || photos.length === 0) {
      alert('Please fill in all required fields and upload at least one photo.');
      return;
    }

    setUploading(true);
    try {
      // Check if session ID already exists
      console.log('Checking for existing session ID:', sessionId.trim());
      const { data: existingSession, error: checkError } = await supabase
        .from('photo_sessions')
        .select('id')
        .eq('id', sessionId.trim())
        .single();

      console.log('Existing session result:', existingSession, 'Error:', checkError);

      if (existingSession) {
        console.log('Session ID already exists, showing error');
        setSessionIdError('The SessionID is Already Use');
        setUploading(false);
        return;
      }

      if (checkError && checkError.code !== 'PGRST116') {
        // PGRST116 means no rows found, which is what we want
        console.error('Error checking session ID:', checkError);
        setSessionIdError('Error checking session ID. Please try again.');
        setUploading(false);
        return;
      }

      // Clear any previous errors if session ID is valid
      setSessionIdError('');
      // Helper: generate a watermarked Blob from a File
      const createWatermarkedBlob = async (file) => {
        return new Promise((resolve) => {
          try {
            const img = new Image();
            img.onload = () => {
              try {
                const maxDim = 2000;
                const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
                const targetW = Math.max(1, Math.round(img.width * scale));
                const targetH = Math.max(1, Math.round(img.height * scale));
                const canvas = document.createElement('canvas');
                canvas.width = targetW;
                canvas.height = targetH;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                  resolve(null);
                  return;
                }
                ctx.drawImage(img, 0, 0, targetW, targetH);

                const text = 'hiraizumi';
                const diagonal = Math.sqrt(targetW * targetW + targetH * targetH);
                const fontSize = Math.max(24, Math.floor(diagonal * 0.06));
                const step = Math.floor(fontSize * 3.8);
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

                canvas.toBlob((blob) => resolve(blob), file.type.includes('png') ? 'image/png' : 'image/jpeg', 0.9);
              } catch (_) {
                resolve(null);
              }
            };
            img.onerror = () => resolve(null);
            const reader = new FileReader();
            reader.onload = () => {
              img.src = reader.result;
            };
            reader.readAsDataURL(file);
          } catch (_) {
            resolve(null);
          }
        });
      };
      // Try to upload to Storage first
      const uploadedPaths = [];
      
      for (const file of photos) {
        const fileName = `${Date.now()}-${file.name}`;
        const path = `${sessionId}/${fileName}`;
        
        console.log('Attempting to upload to Storage:', path);
        
        const { error: uploadError } = await supabase.storage
          .from('photos')
          .upload(path, file, {
            cacheControl: '3600',
            upsert: false
          });
        
        if (uploadError) {
          console.error('Storage upload failed:', uploadError);
          console.log('Error details:', {
            message: uploadError.message,
            statusCode: uploadError.statusCode,
            error: uploadError.error
          });
          // Fallback: store in database
          const base64 = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(file);
          });
          uploadedPaths.push(`database:${base64}`);
        } else {
          console.log('Successfully uploaded to Storage:', path);
          uploadedPaths.push(path);

          // Create and upload watermarked copy under wm/<path>
          try {
            const wmBlob = await createWatermarkedBlob(file);
            if (wmBlob) {
              const wmPath = `wm/${path}`;
              const { error: wmErr } = await supabase.storage
                .from('photos')
                .upload(wmPath, wmBlob, { upsert: true, cacheControl: '3600', contentType: wmBlob.type || file.type });
              if (wmErr) {
                console.warn('Failed to upload watermarked copy:', wmErr);
              } else {
                console.log('Uploaded watermarked copy:', wmPath);
              }
            } else {
              console.warn('Watermark generation returned empty blob for:', fileName);
            }
          } catch (wmError) {
            console.warn('Watermark generation/upload error:', wmError);
          }
        }
      }

      // Save session metadata to database
      const { error: dbErr } = await supabase
        .from('photo_sessions')
        .upsert({
          id: sessionId,
          photos_count: photos.length,
          photo_paths: uploadedPaths, // Send as array for JSONB column
          status: 'active',
          payment_status: 'pending',
          admin_email: ADMIN_EMAIL || 'admin@example.com'
        });
      
      if (dbErr) {
        console.error('Database error:', dbErr);
        throw dbErr;
      }

      const storageCount = uploadedPaths.filter(p => !p.startsWith('database:')).length;
      const dbCount = uploadedPaths.length - storageCount;
      
      let message = `Session uploaded successfully! ${storageCount} photos to Storage, ${dbCount} to database.`;
      
      alert(message);
      clearForm();
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading session: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
    setPhotos(prev => [...prev, ...files]);
  };

  const removePhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const clearForm = () => {
    setSessionId('');
    setPhotos([]);
    setSessionIdError('');
  };

  return (
    <div className="upload-section">
      <h2>{t('uploadCustomerPhotos')}</h2>
      
      <div className="upload-form">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="sessionId">{t('sessionId')}</label>
            <input 
              type="text" 
              id="sessionId"
              value={sessionId}
              onChange={(e) => {
                setSessionId(e.target.value);
                setSessionIdError(''); // Clear error when user types
              }}
              placeholder={t('enterSessionIdPlaceholder')}
              required
            />
            {sessionIdError && (
              <div className="error-message" style={{ 
                color: '#e74c3c', 
                fontSize: '0.9rem', 
                marginTop: '0.5rem',
                fontWeight: 'bold',
                backgroundColor: '#ffeaea',
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #e74c3c'
              }}>
                {sessionIdError}
              </div>
            )}
          </div>
          
          {/* Customer Name field removed to allow upload without name */}
          
          {/* Customer Email field removed as per request */}

          <div 
            className={`upload-area ${photos.length > 0 ? 'has-files' : ''}`}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => document.getElementById('photoUpload').click()}
          >
            <input
              type="file"
              id="photoUpload"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <div className="upload-message">
              <FontAwesomeIcon icon={faCloudUploadAlt} size="3x" />
              <p>{t('clickToUpload')}</p>
              <small>{t('supportsFormats')}</small>
            </div>
          </div>

          {photos.length > 0 && (
            <div className="uploaded-photos">
              {photos.map((photo, index) => (
                <div key={index} className="uploaded-photo">
                  <img src={URL.createObjectURL(photo)} alt={`Upload ${index + 1}`} />
                  <button 
                    type="button"
                    className="remove-btn" 
                    onClick={() => removePhoto(index)}
                    title="Remove"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                  <div className="photo-info">
                    <span>{photo.name}</span>
                    <small>{(photo.size / 1024 / 1024).toFixed(2)} MB</small>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={uploading}
            >
              {uploading ? t('uploading') : t('uploadSession')}
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={clearForm}
              disabled={uploading}
            >
              {t('clearForm')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Upload;