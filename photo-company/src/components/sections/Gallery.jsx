import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import './Gallery.css';

const Gallery = () => {
  const { t } = useLanguage();
  const galleryImages = [
    {
      src: 'https://images.pexels.com/photos/4041191/pexels-photo-4041191.jpeg?cs=srgb&dl=pexels-mohammed-hassan-4041191.jpg&fm=jpg',
      alt: 'Portrait'
    },
    {
      src: 'https://images.pexels.com/photos/2927646/pexels-photo-2927646.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      alt: 'Portrait'
    },
    {
      src: 'https://www.creativefabrica.com/wp-content/uploads/2023/08/08/Red-Robotic-Kimono-Japanese-Temple-76410482-1.png',
      alt: 'Portrait'
    },
    {
      src: 'http://hiraizumiphoto.com/img/chusonji-kojin_360_02.png',
      alt: 'Portrait'
    },
    {
      src: 'http://hiraizumiphoto.com/img/chusonji-kojin_360_04.jpg',
      alt: 'Portrait'
    },
    {
      src: 'https://ichef.bbci.co.uk/ace/ws/640/cpsprodpb/16F45/production/_109912049_gettyimages-544445010.jpg.webp',
      alt: 'Portrait'
    }
  ];

  const [selectedImage, setSelectedImage] = useState(null);

  const handleFindPhoto = (image) => {
    setSelectedImage(image);
    // Add photo search functionality later
  };

  return (
    <section id="gallery" className="gallery">
      <div className="container">
        <h2>{t('photoGallery')}</h2>
        <p className="gallery-subtitle">{t('gallerySubtitle')}</p>
        <div className="gallery-grid">
          {galleryImages.map((image, index) => (
            <div key={index} className="gallery-item">
              <img src={image.src} alt={image.alt} />
              <div className="watermark">PhotoPrint Pro</div>
              <div className="gallery-overlay">
                <button 
                  className="btn btn-primary"
                  onClick={() => handleFindPhoto(image)}
                >
                  {t('findThisPhoto')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;