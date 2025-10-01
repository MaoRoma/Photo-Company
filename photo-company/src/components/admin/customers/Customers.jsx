import { useState, useEffect } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { supabase } from '../../../lib/supabase';
import './Customers.css';

const Customers = () => {
  const { t } = useLanguage();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadSessions();
    
    // Set up auto-refresh every 30 seconds to keep status in sync
    const refreshInterval = setInterval(() => {
      loadSessions(true);
    }, 30000); // 30 seconds

    return () => clearInterval(refreshInterval);
  }, []);

  const loadSessions = async (isAutoRefresh = false) => {
    try {
      if (isAutoRefresh) {
        setRefreshing(true);
      }
      // Get all photo sessions
      const { data: sessionsData } = await supabase
        .from('photo_sessions')
        .select('id, photos_count, payment_status, expires_at')
        .order('created_at', { ascending: false });

      if (!sessionsData) {
        setSessions([]);
        return;
      }

      // For each session, check the actual completion status from pending_orders
      const sessionsWithStatus = await Promise.all(
        sessionsData.map(async (session) => {
          // Get all orders for this session
          const { data: ordersData } = await supabase
            .from('pending_orders')
            .select('status, completed_at')
            .eq('session_id', session.id);

          if (!ordersData || ordersData.length === 0) {
            // No orders found, use session payment_status
            return { ...session, actual_payment_status: session.payment_status };
          }

          // Count orders by status
          const completedOrders = ordersData.filter(order => order.status === 'completed');
          const pendingOrders = ordersData.filter(order => order.status === 'pending');
          const totalOrders = ordersData.length;
          
          // Determine the actual status based on pending_orders
          let actualStatus;
          if (completedOrders.length === totalOrders && totalOrders > 0) {
            // All orders are completed
            actualStatus = 'completed';
          } else if (pendingOrders.length === totalOrders && totalOrders > 0) {
            // All orders are pending
            actualStatus = 'pending';
          } else if (completedOrders.length > 0 && pendingOrders.length > 0) {
            // Mixed status - some completed, some pending
            actualStatus = 'partial';
          } else {
            // Fallback to session payment_status
            actualStatus = session.payment_status;
          }

          return { 
            ...session, 
            actual_payment_status: actualStatus,
            expired: (() => {
              try {
                return !!session.expires_at && new Date(session.expires_at).getTime() <= Date.now();
              } catch {
                return false;
              }
            })(),
            total_orders: totalOrders,
            completed_orders: completedOrders.length,
            pending_orders: pendingOrders.length
          };
        })
      );

      setSessions(sessionsWithStatus);
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Payment status is display-only on this screen

  if (loading) {
    return <div>{t('loading')}</div>;
  }

  return (
    <div className="customers-section">
      <div className="customers-header">
        <h2>{t('customers')}</h2>
        <button 
          onClick={() => loadSessions(false)} 
          className="refresh-btn"
          title="Refresh customer status"
          disabled={refreshing}
        >
          {refreshing ? '🔄 Refreshing...' : '🔄 Refresh'}
        </button>
      </div>
      {sessions.length === 0 ? (
        <div className="no-customers">
          <p>{t('noCustomersFound')}</p>
        </div>
      ) : (
        <div className="customers-grid">
          {sessions.map(session => (
            <div key={session.id} className="customer-card">
              <div className="customer-header">
                <div className="customer-avatar">
                  {String(session.id).slice(-2)}
                </div>
                <div className="customer-info">
                  <h3>{t('id')}: {session.id}</h3>
                </div>
              </div>

              <div className="customer-stats">
                <div className="stat-item">
                  <div className="number">{session.photos_count}</div>
                  <div className="label">{t('totalPhotos')}</div>
                </div>
                <div className="stat-item">
                  <div className="number">
                    <span className={`status ${session.actual_payment_status || session.payment_status}`}>
                      {session.actual_payment_status || session.payment_status}
                    </span>
                  </div>
                  <div className="label">{t('paymentStatus')}</div>
                  {session.total_orders > 0 && (
                    <div className="order-details">
                      <small>
                        {session.completed_orders}/{session.total_orders} completed
                      </small>
                    </div>
                  )}
                </div>
                <div className="stat-item">
                  <div className="number">
                    {session.expires_at ? new Date(session.expires_at).toLocaleDateString() : '—'}
                  </div>
                  <div className="label">Expiry</div>
                  {session.expired && (
                    <div className="order-details">
                      <small style={{ color: '#e74c3c', fontWeight: 'bold' }}>Expired</small>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Customers;