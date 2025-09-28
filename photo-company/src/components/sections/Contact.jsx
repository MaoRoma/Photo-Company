import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPhone, faEnvelope, faCheck, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '../../contexts/LanguageContext';
import './Contact.css';

const Contact = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // TODO: Implement actual form submission logic
      console.log('Form submitted:', formData);
      
      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setErrors({});
      
      // Clear success message after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <section id="contact" className="contact">
      <div className="container">
        <h2>{t('contactUs')}</h2>
        
        {/* Company Information */}
        <div className="service-info">
          <div className="service-description">
            <p>Professional photography services specializing in traditional Japanese cultural heritage sites.</p>
            <p>We offer high-quality photo sessions with immediate printing and digital download options.</p>
            <p>Located in the beautiful historic area of Hiraizumi, capturing memories at sacred temple grounds.</p>
          </div>
          
          <div className="service-details">
            <div className="detail-item">
              <strong>・Company:</strong> Wald LLC (ヴァルト)
            </div>
            <div className="detail-item">
              <strong>・Corporate Number:</strong> 7400003003523
            </div>
            <div className="detail-item">
              <strong>・Legal Entity Type:</strong> LLC
            </div>
            <div className="detail-item">
              <strong>・Postal Code:</strong> 〒029-4102
            </div>
          </div>
          
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <div className="contact-item">
              <FontAwesomeIcon icon={faMapMarkerAlt} />
              <div>
                <h3>Business Location</h3>
                <p>Iwate Prefecture Nishiiwai-gun Hiraizumi-cho</p>
                <p>Hiraizumi character Inoseki 2-9</p>
                <p>〒029-4102</p>
                <a 
                  href="https://maps.app.goo.gl/8cEWMRgVasqqJx6w7" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="map-link"
                >
                  📍 View on Google Maps
                </a>
              </div>
            </div>
            <div className="contact-item">
              <FontAwesomeIcon icon={faPhone} />
              <div>
                <h3>Contact Information</h3>
                <p>📞 Phone: 03-6915-0531</p>
                <p>Company: Wald LLC (ヴァルト)</p>
                <p>Corporate Number: 7400003003523</p>
                <p>Company Corporation Number: 4000030003523</p>
              </div>
            </div>
            <div className="contact-item">
              <FontAwesomeIcon icon={faEnvelope} />
              <div>
                <h3>Business Details</h3>
                <p>Professional Photography Services</p>
                <p>Traditional Cultural Heritage Photography</p>
                <p>Digital & Print Photo Solutions</p>
              </div>
            </div>
          </div>
          <form className="contact-form" onSubmit={handleSubmit}>
            {submitStatus && (
              <div className={`form-message ${submitStatus}`}>
                <FontAwesomeIcon 
                  icon={submitStatus === 'success' ? faCheck : faExclamationTriangle} 
                />
                {submitStatus === 'success' 
                  ? ' Thank you! Your message has been sent successfully.'
                  : ' There was an error sending your message. Please try again.'
                }
              </div>
            )}
            
            <div className="form-field">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t('yourName')}
                className={errors.name ? 'error' : ''}
                required
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>
            
            <div className="form-field">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t('yourEmail')}
                className={errors.email ? 'error' : ''}
                required
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>
            
            <div className="form-field">
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder={t('yourMessage')}
                rows="5"
                className={errors.message ? 'error' : ''}
                required
              />
              {errors.message && <span className="field-error">{errors.message}</span>}
            </div>
            
            <button 
              type="submit" 
              className={`btn btn-primary ${isSubmitting ? 'loading' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : t('sendMessage')}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;