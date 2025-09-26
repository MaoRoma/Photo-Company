import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '../../../contexts/LanguageContext';
import { supabase } from '../../../lib/supabase';
import './Sessions.css';

const Sessions = () => {
  const { t } = useLanguage();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('photo_sessions')
        .select('id, photos_count, status, payment_status, created_at')
        .order('created_at', { ascending: false });
      if (!error) setSessions(data || []);
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSession = async (sessionId, updates) => {
    try {
      const { error } = await supabase
        .from('photo_sessions')
        .update(updates)
        .eq('id', sessionId);
      
      if (error) {
        console.error('Error updating session:', error);
        return false;
      }
      
      // Reload sessions to get updated data
      loadSessions();
      return true;
    } catch (error) {
      console.error('Error updating session:', error);
      return false;
    }
  };

  const deleteSession = async (sessionId) => {
    if (window.confirm('Are you sure you want to delete this session and all its photos? This action cannot be undone.')) {
      try {
        // First, get the session data to find photo paths
        const { data: sessionData, error: fetchError } = await supabase
          .from('photo_sessions')
          .select('photo_paths')
          .eq('id', sessionId)
          .single();

        if (fetchError) {
          console.error('Error fetching session data:', fetchError);
          alert('Error fetching session data. Please try again.');
          return false;
        }

        // Delete photos from storage if they exist
        if (sessionData && sessionData.photo_paths && Array.isArray(sessionData.photo_paths)) {
          const photoPaths = sessionData.photo_paths.filter(path => !String(path).startsWith('database:'));
          
          if (photoPaths.length > 0) {
            // Delete original photos
            const { error: deletePhotosError } = await supabase.storage
              .from('photos')
              .remove(photoPaths);

            if (deletePhotosError) {
              console.warn('Error deleting original photos:', deletePhotosError);
            }

            // Delete watermarked photos (wm/ prefix)
            const watermarkedPaths = photoPaths.map(path => `wm/${path}`);
            const { error: deleteWmError } = await supabase.storage
              .from('photos')
              .remove(watermarkedPaths);

            if (deleteWmError) {
              console.warn('Error deleting watermarked photos:', deleteWmError);
            }

            console.log(`Deleted ${photoPaths.length} original photos and ${watermarkedPaths.length} watermarked photos`);
          }
        }

        // Delete the session record from database
        const { error } = await supabase
          .from('photo_sessions')
          .delete()
          .eq('id', sessionId);
        
        if (error) {
          console.error('Error deleting session:', error);
          alert('Error deleting session from database. Please try again.');
          return false;
        }
        
        alert('Session and all photos deleted successfully!');
        // Reload sessions to get updated data
        loadSessions();
        return true;
      } catch (error) {
        console.error('Error deleting session:', error);
        alert('Error deleting session. Please try again.');
        return false;
      }
    }
  };

  if (loading) {
    return <div>{t('loading')}</div>;
  }

  return (
    <div className="sessions-section">
      <h2>{t('photoSessions')}</h2>
      <div className="sessions-list">
        {sessions.length === 0 ? (
          <p>{t('noSessionsFound')}</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>{t('id')}</th>
                <th>{t('date')}</th>
                <th>{t('photos')}</th>
                <th>{t('status')}</th>
                <th>{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map(session => (
                <tr key={session.id}>
                  <td>{session.id}</td>
                  <td>{new Date(session.created_at).toLocaleDateString()}</td>
                  <td>{session.photos_count}</td>
                  <td>
                    <span className={`status ${session.status.toLowerCase()}`}>
                      {session.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn-icon"
                      onClick={() => updateSession(session.id, {
                        status: session.status === 'active' ? 'completed' : 'active'
                      })}
                      title="Toggle Status"
                    >
                      <FontAwesomeIcon icon={session.status === 'active' ? faCheck : faTimes} />
                    </button>
                    <button
                      className="btn-icon"
                      onClick={() => deleteSession(session.id)}
                      title="Delete"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Sessions;