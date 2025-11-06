import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, User, LogOut, Sun, Moon } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t('products', { ns: 'common' }), href: '#products' },
    { name: t('pricing', { ns: 'common' }), href: '#pricing' },
    { name: t('cases', { ns: 'common' }), href: '#success-metrics' },
    { name: t('faq', { ns: 'common' }), href: '#faq' },
  ];

  const handleNavClick = (href: string, name: string) => {
    setActiveLink(name);
    // Проверяем, находимся ли мы на главной странице
    if (window.location.pathname === '/') {
      // Если на главной странице, то просто прокручиваем
      const element = document.getElementById(href.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Если не на главной, то переходим на главную страницю с якорем
      navigate('/');
      // Небольшая задержка для перехода на главную страницу, затем прокрутка
      setTimeout(() => {
        const element = document.getElementById(href.replace('#', ''));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  return (
    <motion.header
      className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-bg-secondary bg-opacity-90 backdrop-blur-md py-3 shadow-sm' 
          : 'bg-transparent py-5'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <div key={link.name} className="relative">
              <button
                className={`font-medium transition-colors duration-300 ${
                  activeLink === link.name 
                    ? 'text-primary-telegram' 
                    : 'text-text-primary hover:text-primary-telegram'
                }`}
                onClick={() => handleNavClick(link.href, link.name)}
              >
                {link.name}
              </button>
              <span className={`absolute bottom-0 left-0 h-0.5 bg-primary-telegram transition-all duration-300 ${
                activeLink === link.name ? 'w-full' : 'w-0 hover:w-full'
              }`}></span>
            </div>
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          {/* Language Switcher */}
          <div className="flex items-center space-x-2 border-r border-text-tertiary pr-4">
            <button
              onClick={() => changeLanguage('ru')}
              className={`text-sm font-medium ${
                localStorage.getItem('language') === 'ru' 
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
                localStorage.getItem('language') === 'en' 
                  ? 'text-primary-telegram' 
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              EN
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-bg-tertiary hover:bg-bg-secondary transition-colors mr-2"
            aria-label={t('toggle_theme', { ns: 'common' })}
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5 text-text-primary" />
            ) : (
              <Sun className="w-5 h-5 text-text-primary" />
            )}
          </button>

          {user ? (
            <>
              <Link to="/account" className="flex items-center text-text-primary hover:text-primary-telegram font-medium transition-colors">
                <User className="w-5 h-5 mr-1" />
                {t('dashboard', { ns: 'common' })}
              </Link>
              <button 
                onClick={logout}
                className="flex items-center text-text-primary hover:text-primary-telegram font-medium transition-colors"
              >
{t('logout', { ns: 'common' })}
              </button>
            </>
          ) : (
            <>
              <Link to="/auth" className="flex items-center text-text-primary hover:text-primary-telegram font-medium transition-colors">
                <User className="w-5 h-5 mr-1" />
                {t('login', { ns: 'common' })}
              </Link>
            </>
          )}
          
          <Button 
            variant="gradient-primary" 
            size="md"
            className="relative overflow-hidden group"
            glow={true}
            onClick={() => {
              const element = document.getElementById('contact');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            <span className="relative z-10">{t('start_free_trial', { ns: 'common' })}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary-telegram to-primary-electric opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-text-primary"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <motion.div 
          className="md:hidden bg-bg-secondary py-4 px-4 absolute top-full left-0 right-0 shadow-lg"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <button
                key={link.name}
                className="font-medium text-text-primary hover:text-primary-telegram py-2 text-left"
                onClick={() => {
                  handleNavClick(link.href, link.name);
                  setIsMenuOpen(false);
                }}
              >
                {link.name}
              </button>
            ))}
            
            <div className="pt-4 border-t border-border flex flex-col space-y-3">
              {/* Mobile Language Switcher */}
              <div className="flex items-center justify-center space-x-4 py-2">
                <button
                  onClick={() => {
                    changeLanguage('ru');
                    setIsMenuOpen(false);
                  }}
                  className={`text-sm font-medium ${
                    localStorage.getItem('language') === 'ru' 
                      ? 'text-primary-telegram' 
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  RU
                </button>
                <span className="text-text-tertiary">|</span>
                <button
                  onClick={() => {
                    changeLanguage('en');
                    setIsMenuOpen(false);
                  }}
                  className={`text-sm font-medium ${
                    localStorage.getItem('language') === 'en' 
                      ? 'text-primary-telegram' 
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  EN
                </button>
              </div>
              
              {/* Mobile Theme Toggle */}
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    toggleTheme();
                  }}
                  className="p-2 rounded-full bg-bg-tertiary hover:bg-bg-secondary transition-colors"
                  aria-label={t('toggle_theme', { ns: 'common' })}
                >
                  {theme === 'light' ? (
                    <Moon className="w-5 h-5 text-text-primary" />
                  ) : (
                    <Sun className="w-5 h-5 text-text-primary" />
                  )}
                </button>
              </div>
              
              {user ? (
                <>
                  <Link 
                    to="/account" 
                    className="flex items-center text-text-primary hover:text-primary-telegram py-2 text-left"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-5 h-5 mr-2" />
                    {t('dashboard', { ns: 'common' })}
                  </Link>
                  <button 
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center text-text-primary hover:text-primary-telegram py-2 text-left"
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    {t('logout', { ns: 'common' })}
                  </button>
                </>
              ) : (
                <Link 
                  to="/auth" 
                  className="flex items-center text-text-primary hover:text-primary-telegram py-2 text-left"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="w-5 h-5 mr-2" />
                  {t('login', { ns: 'common' })}
                </Link>
              )}
              
              <Button 
                variant="gradient-primary" 
                size="md" 
                className="w-full"
                onClick={() => {
                  setIsMenuOpen(false);
                  const element = document.getElementById('contact');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                {t('start_free_trial', { ns: 'common' })}
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Header;