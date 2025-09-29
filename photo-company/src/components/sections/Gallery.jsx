import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '../../contexts/LanguageContext';
import './Gallery.css';

const Gallery = () => {
  const { t } = useLanguage();
  const [lightboxImage, setLightboxImage] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const galleryImages = [
    {
      src: 'https://images.pexels.com/photos/4041191/pexels-photo-4041191.jpeg?cs=srgb&dl=pexels-mohammed-hassan-4041191.jpg&fm=jpg',
      alt: 'Traditional Portrait',
      category: 'portrait',
      title: 'Traditional Japanese Portrait',
      description: 'Beautiful traditional portrait session'
    },
    {
      src: 'https://images.pexels.com/photos/2927646/pexels-photo-2927646.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      alt: 'Modern Portrait',
      category: 'portrait',
      title: 'Modern Portrait Session',
      description: 'Contemporary portrait photography'
    },
    {
      src: 'https://www.creativefabrica.com/wp-content/uploads/2023/08/08/Red-Robotic-Kimono-Japanese-Temple-76410482-1.png',
      alt: 'Cultural Portrait',
      category: 'cultural',
      title: 'Cultural Heritage Shot',
      description: 'Traditional kimono photography'
    },
    {
      src: 'https://i0.wp.com/blog.jtbusa.com/wp-content/uploads/2016/01/2015-Oct-Japan-Hiraizumi-Chusonji-127-1024x682.jpg?resize=640%2C426&is-pending-load=1',
      alt: 'Temple Photography',
      category: 'cultural',
      title: 'Chusonji Temple',
      description: 'Sacred temple photography'
    },
    {
      src: 'https://kyoto-kanko.net/wp-content/uploads/2013/06/chionin_14-min.jpg',
      alt: 'Heritage Site',
      category: 'cultural',
      title: 'Heritage Photography',
      description: 'Historical site captures'
    },
    {
      src: 'https://ichef.bbci.co.uk/ace/ws/640/cpsprodpb/16F45/production/_109912049_gettyimages-544445010.jpg.webp',
      alt: 'Professional Portrait',
      category: 'professional',
      title: 'Professional Session',
      description: 'Business and professional portraits'
    }
  ];


  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleImageClick = (image, index) => {
    setLightboxImage(image);
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxImage(null);
    setLightboxIndex(0);
  };

  const navigateLightbox = (direction) => {
    const newIndex = direction === 'next' 
      ? (lightboxIndex + 1) % galleryImages.length
      : lightboxIndex === 0 ? galleryImages.length - 1 : lightboxIndex - 1;
    
    setLightboxIndex(newIndex);
    setLightboxImage(galleryImages[newIndex]);
  };


  const handleFindPhoto = (image) => {
    // Scroll to search section
    const searchSection = document.getElementById('search');
    if (searchSection) {
      searchSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleKeyPress = (e) => {
    if (lightboxImage) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigateLightbox('prev');
      if (e.key === 'ArrowRight') navigateLightbox('next');
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [lightboxImage, lightboxIndex]);

  if (isLoading) {
    return (
      <section id="gallery" className="gallery">
        <div className="container">
          <div className="gallery-loading">
            Loading gallery...
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" className="gallery">
      <div className="container">
        <h2>{t('photoGallery')}</h2>
        <p className="gallery-subtitle">{t('gallerySubtitle')}</p>
        
        {/* Gallery Grid */}
        <div className="gallery-grid">
          {galleryImages.map((image, index) => (
              <div 
                key={index} 
                className="gallery-item"
                onClick={() => handleImageClick(image, index)}
              >
                <img 
                  src={image.src} 
                  alt={image.alt}
                  loading="lazy"
                />
                <div className="watermark">PhotoPrint Pro</div>
                <div className="gallery-overlay">
                  <button 
                    className="btn btn-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFindPhoto(image);
                    }}
                  >
                    <FontAwesomeIcon icon={faSearch} />
                    {t('findThisPhoto')}
                  </button>
                </div>
              </div>
            ))}
        </div>

        {/* Lightbox Modal */}
        {lightboxImage && (
          <div className="gallery-lightbox" onClick={closeLightbox}>
            <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
              <button 
                className="lightbox-close"
                onClick={closeLightbox}
                aria-label="Close lightbox"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
              
              <img 
                src={lightboxImage.src} 
                alt={lightboxImage.alt}
                className="lightbox-image"
              />
              
              {galleryImages.length > 1 && (
                <>
                  <button 
                    className="lightbox-nav lightbox-prev"
                    onClick={() => navigateLightbox('prev')}
                    aria-label="Previous image"
                  >
                    <FontAwesomeIcon icon={faChevronLeft} />
                  </button>
                  <button 
                    className="lightbox-nav lightbox-next"
                    onClick={() => navigateLightbox('next')}
                    aria-label="Next image"
                  >
                    <FontAwesomeIcon icon={faChevronRight} />
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;