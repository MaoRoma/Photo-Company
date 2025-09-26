import { useLanguage } from '../../contexts/LanguageContext';
import './Hero.css';

const Hero = () => {
  const { t } = useLanguage();
  
  return (
    <section id="home" className="hero">
      <div className="hero-content">
        <h1>{t('heroTitle')}</h1>
        <p>{t('heroSubtitle')}</p>
        <div className="hero-buttons">
          <a href="#services" className="btn btn-primary">{t('ourServices')}</a>
          <a href="#gallery" className="btn btn-secondary">{t('viewGallery')}</a>
        </div>
      </div>
      <div className="hero-image">
        <img src="https://icomosjapan.org/static/homepage/images/top12m.jpg" alt="Professional Photography" />
      </div>
    </section>
  );
};

export default Hero;