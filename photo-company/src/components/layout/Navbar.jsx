import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faBars, faLock } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import LanguageSwitcher from '../common/LanguageSwitcher';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <FontAwesomeIcon icon={faCamera} />
            <span>PhotoPrint Pro</span>
          </div>
          <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
            <li><a href="#home" className="nav-link">{t('home')}</a></li>
            <li><a href="#services" className="nav-link">{t('services')}</a></li>
            <li><a href="#gallery" className="nav-link">{t('gallery')}</a></li>
            <li><a href="#search" className="nav-link">{t('findPhotos')}</a></li>
            <li><a href="#about" className="nav-link">{t('about')}</a></li>
            <li><a href="#contact" className="nav-link">{t('contact')}</a></li>
            <li>
              <Link to="/admin/login" className="nav-link admin-link">
                <FontAwesomeIcon icon={faLock} /> {t('admin')}
              </Link>
            </li>
            <li>
              <LanguageSwitcher variant="navbar" />
            </li>
          </ul>
          <div className={`hamburger ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
            <FontAwesomeIcon icon={faBars} />
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;