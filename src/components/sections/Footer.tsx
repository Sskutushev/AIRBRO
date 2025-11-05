import React from 'react';

import { Mail, Globe, Sun, Moon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';


const Footer: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  const resources = [
    { text: 'База знаний', href: '#' },
    { text: 'API Documentation', href: '#' },
    { text: 'Status', href: '#' },
    { text: 'Careers', href: '#' },
    { text: 'Press', href: '#' },
    { text: 'Partners', href: '#' }
  ];

  const legal = [
    { text: 'Политика конфиденциальности', href: '/privacy' },
    { text: 'Условия использования', href: '/terms' },
    { text: 'Cookie Policy', href: '/cookies' },
    { text: 'SLA', href: '/sla' },
    { text: 'Реквизиты', href: '/requisites' }
  ];

  const socialLinks = [
    { name: 'Telegram', href: 'https://t.me/AIBROBusinessBot', icon: '📱' },
    { name: 'Twitter', href: 'https://twitter.com', icon: '🐦' },
    { name: 'YouTube', href: 'https://youtube.com', icon: '▶️' },
    { name: 'LinkedIn', href: 'https://linkedin.com', icon: '💼' }
  ];

  return (
    <footer className="bg-bg-primary border-t border-border">
      {/* Top Section - Company Info */}
      <div className="bg-bg-tertiary py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-primary-telegram rounded-full flex items-center justify-center text-white font-bold mr-3">
                  🤖
                </div>
                <span className="text-2xl font-bold text-text-primary">AIBRO Business</span>
              </div>
              <p className="text-text-secondary mb-6 max-w-md">
                AI-операционная система для малого и среднего бизнеса, интегрированная с Telegram.
              </p>
              
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
                  Telegram Support
                </a>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-text-primary mb-4">Продукты</h4>
              <ul className="space-y-2">
                {[
                  'AI PostMaster',
                  'Conversation Bot',
                  'Booking Bot',
                  'Feedback Bot',
                  'Video Inventory Agent',
                  'Vertical Bundles'
                ].map((item, index) => (
                  <li key={index}>
                    <a href="#" className="text-text-secondary hover:text-primary-telegram transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Resources */}
            <div>
              <h4 className="font-bold text-text-primary mb-4">Ресурсы</h4>
              <ul className="space-y-2">
                {resources.map((resource, index) => (
                  <li key={index}>
                    <a href={resource.href} className="text-text-secondary hover:text-primary-telegram transition-colors">
                      {resource.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Support */}
            <div>
              <h4 className="font-bold text-text-primary mb-4">Поддержка</h4>
              <ul className="space-y-2">
                {[
                  'База знаний',
                  'Обратиться в поддержку',
                  'Система статусов',
                  'Community',
                  'Контакты'
                ].map((item, index) => (
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
      
      {/* Bottom Section - Copyright & Legal */}
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-text-secondary text-sm">
                &copy; {new Date().getFullYear()} AIBRO Business. Все права защищены.
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 mb-4 md:mb-0">
              {legal.map((item, index) => (
                <a 
                  key={index} 
                  href={item.href} 
                  className="text-text-secondary hover:text-primary-telegram text-sm transition-colors"
                >
                  {item.text}
                </a>
              ))}
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Language Switcher */}
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
              
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-bg-tertiary hover:bg-bg-secondary transition-colors"
                aria-label="Toggle theme"
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