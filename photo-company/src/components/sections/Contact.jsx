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
        
        {/* Service Information */}
        <div className="service-info">
          <div className="service-description">
            <p>Feel free to take photos with a small group of people, such as family, friends, or solo travelers.</p>
            <p>After taking the photo, you can hand over the photo in 2 or 3 minutes.</p>
            <p>The shooting location is mainly the background of the golden hall, but depending on the season, we can also accommodate the customer's wishes, such as cherry blossoms and maples.</p>
          </div>
          
          <div className="service-details">
            <div className="detail-item">
              <strong>・Shooting location:</strong> Chusonji precincts (near Kindo)
            </div>
            <div className="detail-item">
              <strong>・Reception location:</strong> Kindo-mae square shooting site
            </div>
            <div className="detail-item">
              <strong>・Fee:</strong> 1,800 yen (1 photo)
            </div>
            <div className="detail-item">
              <strong>・Size:</strong> Hachikiri (204mm×152mm)
            </div>
          </div>
          
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <div className="contact-item">
              <FontAwesomeIcon icon={faMapMarkerAlt} />
              <div>
                <h3>Reception Location</h3>
                <p>Kindo-mae square shooting site</p>
              </div>
            </div>
            <div className="contact-item">
              <FontAwesomeIcon icon={faPhone} />
              <div>
                <h3>Phone & Fax</h3>
                <p>TEL: 0191-46-3554</p>
                <p>FAX: 0191-46-3554</p>
                <p><small>(Reception hours 8:30~17:30)</small></p>
              </div>
            </div>
            <div className="contact-item">
              <FontAwesomeIcon icon={faEnvelope} />
              <div>
                <h3>{t('email')}</h3>
                <p>hiraizumi-photo@spice.ocn.ne.jp</p>
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