import React from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Globe, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Footer: React.FC = () => {
  const { t, i18n } = useTranslation('footer');
  const { theme, toggleTheme } = useTheme();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  const products = t('products', { returnObjects: true }) as string[];
  const resources = t('resources', { returnObjects: true }) as string[];
  const support = t('support', { returnObjects: true }) as string[];
  const legal = t('legal', { returnObjects: true }) as { [key: string]: string };

  const socialLinks = [
    { name: 'Telegram', href: 'https://t.me/AIBROBusinessBot', icon: '📱' },
    { name: 'Twitter', href: 'https://twitter.com', icon: '🐦' },
    { name: 'YouTube', href: 'https://youtube.com', icon: '▶️' },
    { name: 'LinkedIn', href: 'https://linkedin.com', icon: '💼' }
  ];

  return (
    <footer className="bg-bg-primary border-t border-border">
      <div className="bg-bg-tertiary py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-bg-primary rounded-full flex items-center justify-center mr-3">
                  <img src="/Favicon.svg" alt="AIBRO Logo" className="w-full h-full object-contain" />
                </div>
                <span className="text-2xl font-bold text-text-primary">AIBRO Business</span>
              </div>
              <p className="text-text-secondary mb-6 max-w-md">{t('description')}</p>
              
              <div className="flex space-x-4 mb-6">
                {socialLinks.map((social, index) => (
                  <a 
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-bg-primary border border-border flex items-center justify-center text-lg hover:bg-primary-telegram/10 hover:text-primary-telegram transition-colors"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center border-r border-border pr-4">
                  <Mail className="w-5 h-5 text-text-primary mr-2" />
                  <a href="mailto:hello@aibrobusiness.com" className="text-text-secondary hover:text-primary-telegram">
                    hello@aibrobusiness.com
                  </a>
                </div>
                <a href="https://t.me/AIBROSupportBot" target="_blank" rel="noopener noreferrer" className="text-primary-telegram hover:underline">
                  {t('support_link')}
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-text-primary mb-4">{t('products_title')}</h4>
              <ul className="space-y-2">
                {products.map((item, index) => (
                  <li key={index}>
                    <a href="#" className="text-text-secondary hover:text-primary-telegram transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-text-primary mb-4">{t('resources_title')}</h4>
              <ul className="space-y-2">
                {resources.map((item, index) => (
                  <li key={index}>
                    <a href="#" className="text-text-secondary hover:text-primary-telegram transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-text-primary mb-4">{t('support_title')}</h4>
              <ul className="space-y-2">
                {support.map((item, index) => (
                  <li key={index}>
                    <a href="#" className="text-text-secondary hover:text-primary-telegram transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-text-secondary text-sm">
                {t('copyright', { year: new Date().getFullYear() })}
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 mb-4 md:mb-0">
              {Object.entries(legal).map(([key, value]) => (
                <a 
                  key={key} 
                  href={`/${key}`} 
                  className="text-text-secondary hover:text-primary-telegram text-sm transition-colors"
                >
                  {value}
                </a>
              ))}
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center border-r border-border pr-4">
                <Globe className="w-4 h-4 text-text-secondary mr-2" />
                <button
                  onClick={() => changeLanguage('ru')}
                  className={`text-sm ${
                    i18n.language === 'ru' 
                      ? 'text-primary-telegram font-medium' 
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  RU
                </button>
                <span className="text-text-tertiary mx-1">|</span>
                <button
                  onClick={() => changeLanguage('en')}
                  className={`text-sm ${
                    i18n.language === 'en' 
                      ? 'text-primary-telegram font-medium' 
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  EN
                </button>
              </div>
              
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-bg-tertiary hover:bg-bg-secondary transition-colors"
                aria-label={t('toggle_theme')}
              >
                {theme === 'light' ? (
                  <Moon className="w-4 h-4 text-text-primary" />
                ) : (
                  <Sun className="w-4 h-4 text-text-primary" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;