import { useLanguage } from '../../contexts/LanguageContext';
import './LanguageSwitcher.css';

const LanguageSwitcher = ({ variant = 'default' }) => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button 
      className={`language-switcher ${variant}`}
      onClick={toggleLanguage}
      title={language === 'en' ? 'Switch to Japanese' : '日本語に切り替え'}
    >
      {language === 'en' ? '日本語' : 'English'}
    </button>
  );
};

export default LanguageSwitcher;
