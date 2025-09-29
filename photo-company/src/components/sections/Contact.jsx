import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '../../contexts/LanguageContext';
import './Contact.css';

const Contact = () => {
  const { t } = useLanguage();

  return (
    <section id="contact" className="contact">
      <div className="container">
        <h2>{t('contactUs')}</h2>
        
        {/* Company Information */}
        <div className="service-info">
          <div className="service-description">
            <p>{t('professionalPhotographyServices')}</p>
            <p>{t('highQualityPhotoSessions')}</p>
            <p>{t('locatedInHiraizumi')}</p>
          </div>
          
          <div className="service-details">
            <div className="detail-item">
              <strong>・{t('company')}:</strong> Wald LLC (ヴァルト)
            </div>
            <div className="detail-item">
              <strong>・{t('corporateNumber')}:</strong> 7400003003523
            </div>
            <div className="detail-item">
              <strong>・{t('legalEntityType')}:</strong> LLC
            </div>
            <div className="detail-item">
              <strong>・{t('postalCode')}:</strong> 〒029-4102
            </div>
          </div>
          
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <div className="contact-item">
              <FontAwesomeIcon icon={faMapMarkerAlt} />
              <div>
                <h3>{t('businessLocation')}</h3>
                <p>Iwate Prefecture Nishiiwai-gun Hiraizumi-cho</p>
                <p>Hiraizumi character Inoseki 2-9</p>
                <p>〒029-4102</p>
                <a 
                  href="https://maps.app.goo.gl/8cEWMRgVasqqJx6w7" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="map-link"
                >
                  📍 {t('viewOnGoogleMaps')}
                </a>
              </div>
            </div>
            <div className="contact-item">
              <FontAwesomeIcon icon={faPhone} />
              <div>
                <h3>{t('contactInformation')}</h3>
                <p>📞 Phone: 03-6915-0531</p>
                <p>Company: Wald LLC (ヴァルト)</p>
                <p>Corporate Number: 7400003003523</p>
                <p>Company Corporation Number: 4000030003523</p>
              </div>
            </div>
            <div className="contact-item">
              <FontAwesomeIcon icon={faEnvelope} />
              <div>
                <h3>{t('businessDetails')}</h3>
                <p>{t('professionalPhotographyServicesDetail')}</p>
                <p>{t('traditionalCulturalHeritage')}</p>
                <p>{t('digitalPrintSolutions')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;