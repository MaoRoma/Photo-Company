import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faUsers, faAward, faArrowRight, faPlayCircle } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '../../contexts/LanguageContext';
import './About.css';

const About = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState({
    photos: 0,
    customers: 0,
    experience: 0
  });

  const finalStats = {
    photos: 10000,
    customers: 2500,
    experience: 15
  };

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;

    const timers = Object.keys(finalStats).map((key, index) => {
      return setTimeout(() => {
        let current = 0;
        const increment = finalStats[key] / steps;
        
        const interval = setInterval(() => {
          current += increment;
          if (current >= finalStats[key]) {
            current = finalStats[key];
            clearInterval(interval);
          }
          setStats(prev => ({
            ...prev,
            [key]: Math.floor(current)
          }));
        }, stepDuration);
      }, index * 200);
    });

    return () => timers.forEach(timer => clearTimeout(timer));
  }, []);

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToGallery = () => {
    const gallerySection = document.getElementById('gallery');
    if (gallerySection) {
      gallerySection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <section id="about" className="about">
      <div className="container">
        <div className="about-content">
          <div className="about-text">
            <h2>{t('aboutTitle')}</h2>
            <p>{t('aboutDescription')}</p>
            <p>{t('aboutServiceIntro')}</p>
            <ul>
              <li>{t('aboutService1')}</li>
              <li>{t('aboutService2')}</li>
              <li>{t('aboutService3')}</li>
              <li>{t('aboutService4')}</li>
            </ul>

            {/* Stats Section */}
            <div className="about-stats">
              <div className="stat-item">
                <div className="stat-number">{stats.photos.toLocaleString()}+</div>
                <div className="stat-label">Photos Taken</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{stats.customers.toLocaleString()}+</div>
                <div className="stat-label">Happy Customers</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{stats.experience}+</div>
                <div className="stat-label">Years Experience</div>
              </div>
            </div>
          </div>
          
          <div className="about-image">
            <div className="about-image-container">
              <img 
                src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                alt="Our Professional Photography Studio"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="about-cta">
          <h3>Ready to Create Beautiful Memories?</h3>
          <p>Let us capture your special moments with our professional photography services.</p>
          <div className="cta-buttons">
            <button className="cta-btn primary" onClick={scrollToContact}>
              <FontAwesomeIcon icon={faCamera} />
              Book a Session
            </button>
            <button className="cta-btn secondary" onClick={scrollToGallery}>
              <FontAwesomeIcon icon={faPlayCircle} />
              View Our Work
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;