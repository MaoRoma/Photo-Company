import { Navigate, useLocation } from 'react-router-dom';

const RequireAdmin = ({ children }) => {
  const location = useLocation();
  const isAuthed = localStorage.getItem('isAdminAuthenticated') === 'true';

  if (!isAuthed) {
    return <Navigate to="/admin/login" state={{ from: location.pathname + location.search }} replace />;
  }

  return children;
};

export default RequireAdmin;


