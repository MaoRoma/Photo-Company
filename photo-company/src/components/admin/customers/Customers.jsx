import { useState, useEffect } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { supabase } from '../../../lib/supabase';
import './Customers.css';

const Customers = () => {
  const { t } = useLanguage();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const { data } = await supabase
        .from('photo_sessions')
        .select('id, photos_count, payment_status')
        .order('created_at', { ascending: false });
      setSessions(data || []);
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Payment status is display-only on this screen

  if (loading) {
    return <div>{t('loading')}</div>;
  }

  return (
    <div className="customers-section">
      <h2>{t('customers')}</h2>
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
                    <span className={`status ${session.payment_status}`}>
                      {session.payment_status === 'done' ? 'completed' : session.payment_status}
                    </span>
                  </div>
                  <div className="label">{t('paymentStatus')}</div>
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