import { useState, useEffect } from 'react';
import { FaUsers, FaImages, FaDollarSign, FaCalendarAlt } from 'react-icons/fa';
import { useLanguage } from '../../../contexts/LanguageContext';
import { supabase } from '../../../lib/supabase';
import './Dashboard.css';

const Dashboard = () => {
  const { t } = useLanguage();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [purchasesTotal, setPurchasesTotal] = useState(0);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('photo_sessions')
        .select('id, photos_count, payment_status, created_at');
      
      if (error) {
        throw error;
      }
      
      setSessions(data || []);
      setError(null);

      // Sales should come from immutable purchase records so deletions don't reduce totals
      const { data: purchases, error: purchasesErr } = await supabase
        .from('photo_purchases')
        .select('amount');
      if (!purchasesErr) {
        const sum = (purchases || []).reduce((acc, p) => acc + (Number(p?.amount) || 0), 0);
        setPurchasesTotal(sum);
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
      setSessions([]);
      setError('Error loading dashboard data. Please try refreshing the page.');
    } finally {
      setLoading(false);
    }
  };

  const getStats = () => {
    try {
      const totalCustomers = sessions.length;
      const totalPhotos = sessions.reduce((sum, session) => {
        const photos = Number(session?.photos_count) || 0;
        return sum + photos;
      }, 0);
      
      const totalSales = purchasesTotal;

      const currentMonth = new Date().getMonth();
      const monthSessions = sessions.filter(session => {
        try {
          return new Date(session?.created_at).getMonth() === currentMonth;
        } catch {
          return false;
        }
      }).length;

      return {
        totalCustomers,
        totalPhotos,
        totalSales,
        monthSessions
      };
    } catch (error) {
      console.error('Error calculating stats:', error);
      return {
        totalCustomers: 0,
        totalPhotos: 0,
        totalSales: 0,
        monthSessions: 0
      };
    }
  };

  if (loading) {
    return <div>{t('loading')}</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  const stats = getStats();

  return (
    <div>
      <h1>{t('dashboard')}</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <FaUsers />
          </div>
          <div className="stat-info">
            <h3>{t('totalCustomers')}</h3>
            <p>{stats.totalCustomers}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaImages />
          </div>
          <div className="stat-info">
            <h3>{t('totalPhotos')}</h3>
            <p>{stats.totalPhotos}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaDollarSign />
          </div>
          <div className="stat-info">
            <h3>{t('totalSales')}</h3>
            <p>¥{stats.totalSales.toLocaleString()}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaCalendarAlt />
          </div>
          <div className="stat-info">
            <h3>{t('sessionsThisMonth')}</h3>
            <p>{stats.monthSessions}</p>
          </div>
        </div>
      </div>

      {/* Recent Sessions section removed as requested */}
    </div>
  );
}

export default Dashboard;