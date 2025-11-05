import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  return (
    <div className="flex items-center space-x-2 border-r border-text-tertiary pr-4">
      <button
        onClick={() => changeLanguage('ru')}
        className={`text-sm font-medium ${
          i18n.language === 'ru' 
            ? 'text-primary-telegram' 
            : 'text-text-secondary hover:text-text-primary'
        }`}
      >
        RU
      </button>
      <span className="text-text-tertiary">|</span>
      <button
        onClick={() => changeLanguage('en')}
        className={`text-sm font-medium ${
          i18n.language === 'en' 
            ? 'text-primary-telegram' 
            : 'text-text-secondary hover:text-text-primary'
        }`}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;