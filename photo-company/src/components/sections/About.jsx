import { useLanguage } from '../../contexts/LanguageContext';
import './About.css';

const About = () => {
  const { t } = useLanguage();
  
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
          </div>
          <div className="about-image">
            <img 
              src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
              alt="Our Studio" 
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;