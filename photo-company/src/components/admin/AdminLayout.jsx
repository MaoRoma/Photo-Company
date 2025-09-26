import React from 'react';
import { NavLink, Link, Outlet } from 'react-router-dom';
import { FaCamera, FaHome, FaUsers, FaCalendarAlt, FaCloudUploadAlt, FaGlobe } from 'react-icons/fa';
import { useLanguage } from '../../contexts/LanguageContext';
import LanguageSwitcher from '../common/LanguageSwitcher';
import './AdminLayout.css';

const AdminLayout = () => {
  const { t } = useLanguage();
  
  return (
    <div className="admin-layout">
      <header className="admin-navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <FaCamera />
            <div>
              <div style={{ fontWeight: 800 }}>PhotoPrint Pro</div>
              <small style={{ opacity: 0.85 }}>Admin</small>
            </div>
          </div>
          <nav>
            <ul className="nav-menu">
              <li>
                <NavLink to="/admin/dashboard" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                  <FaHome />
                  <span>{t('dashboard')}</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/upload" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                  <FaCloudUploadAlt />
                  <span>{t('uploadPhotos')}</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/sessions" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                  <FaCalendarAlt />
                  <span>{t('manageSessions')}</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/customers" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                  <FaUsers />
                  <span>{t('customers')}</span>
                </NavLink>
              </li>
              <li>
                <Link to="/" className="nav-link">
                  <FaGlobe />
                  <span>{t('viewWebsite')}</span>
                </Link>
              </li>
            </ul>
          </nav>
          <LanguageSwitcher variant="admin" />
        </div>
      </header>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;