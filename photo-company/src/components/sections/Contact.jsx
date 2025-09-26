import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '../../contexts/LanguageContext';
import './Contact.css';

const Contact = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement form submission logic
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <section id="contact" className="contact">
      <div className="container">
        <h2>{t('contactUs')}</h2>
        <div className="contact-content">
          <div className="contact-info">
            <div className="contact-item">
              <FontAwesomeIcon icon={faMapMarkerAlt} />
              <div>
                <h3>{t('address')}</h3>
                <p>{t('addressDetails')}</p>
              </div>
            </div>
            <div className="contact-item">
              <FontAwesomeIcon icon={faPhone} />
              <div>
                <h3>{t('phone')}</h3>
                <p>{t('phoneNumber')}</p>
              </div>
            </div>
            <div className="contact-item">
              <FontAwesomeIcon icon={faEnvelope} />
              <div>
                <h3>{t('email')}</h3>
                <p>{t('emailAddress')}</p>
              </div>
            </div>
          </div>
          <form className="contact-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={t('yourName')}
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t('yourEmail')}
              required
            />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder={t('yourMessage')}
              rows="5"
              required
            />
            <button type="submit" className="btn btn-primary">{t('sendMessage')}</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;