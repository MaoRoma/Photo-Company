import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faPrint, faDownload } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '../../contexts/LanguageContext';
import './Services.css';

const Services = () => {
  const { t } = useLanguage();
  
  const services = [
    {
      icon: faCamera,
      title: t('service1Title'),
      description: t('service1Description')
    },
    {
      icon: faPrint,
      title: t('service2Title'),
      description: t('service2Description')
    },
    {
      icon: faDownload,
      title: t('service3Title'),
      description: t('service3Description')
    }
  ];

  return (
    <section id="services" className="services">
      <div className="container">
        <h2>{t('ourServices')}</h2>
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <div className="service-icon">
                <FontAwesomeIcon icon={service.icon} />
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;