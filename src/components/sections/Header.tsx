import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, User, CreditCard, LogOut } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Проблема', href: '#problem' },
    { name: 'Решение', href: '#solution' },
    { name: 'Продукты', href: '#products' },
    { name: 'Цены', href: '#pricing' },
    { name: 'Отзывы', href: '#success-metrics' },
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
      // Если не на главной, то переходим на главную страницу с якорем
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

  return (
    <motion.header
      className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white bg-opacity-90 backdrop-blur-md py-3 shadow-sm' 
          : 'bg-transparent py-5'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          {/* Logo */}
          <div className="w-[200px] h-full overflow-hidden">
            <img 
              src="/images/Logo.png" 
              alt="AIRBRO Business Logo" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <div key={link.name} className="relative">
              <button
                className={`font-medium transition-colors duration-300 ${
                  activeLink === link.name 
                    ? 'text-primary-coral' 
                    : 'text-text-primary hover:text-primary-coral'
                }`}
                onClick={() => handleNavClick(link.href, link.name)}
              >
                {link.name}
              </button>
              <span className={`absolute bottom-0 left-0 h-0.5 bg-primary-coral transition-all duration-300 ${
                activeLink === link.name ? 'w-full' : 'w-0 hover:w-full'
              }`}></span>
            </div>
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              <Link to="/account" className="flex items-center text-text-primary hover:text-primary-coral font-medium transition-colors">
                <User className="w-5 h-5 mr-1" />
                Личный кабинет
              </Link>
              <button 
                onClick={logout}
                className="flex items-center text-text-primary hover:text-primary-coral font-medium transition-colors"
              >
                <LogOut className="w-5 h-5 mr-1" />
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link to="/auth" className="flex items-center text-text-primary hover:text-primary-coral font-medium transition-colors">
                <User className="w-5 h-5 mr-1" />
                Войти
              </Link>
            </>
          )}
          <Button 
            variant="cta" 
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
            <span className="relative z-10">Попробовать бесплатно</span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary-electric to-primary-violet opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
          className="md:hidden bg-white py-4 px-4 absolute top-full left-0 right-0 shadow-lg"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <button
                key={link.name}
                className="font-medium text-text-primary hover:text-primary-coral py-2 text-left"
                onClick={() => {
                  handleNavClick(link.href, link.name);
                  setIsMenuOpen(false);
                }}
              >
                {link.name}
              </button>
            ))}
            <div className="pt-4 border-t border-gray-200 flex flex-col space-y-3">
              {user ? (
                <>
                  <Link 
                    to="/account" 
                    className="flex items-center text-text-primary hover:text-primary-coral py-2 text-left"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-5 h-5 mr-2" />
                    Личный кабинет
                  </Link>
                  <button 
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center text-text-primary hover:text-primary-coral py-2 text-left"
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    Выйти
                  </button>
                </>
              ) : (
                <Link 
                  to="/auth" 
                  className="flex items-center text-text-primary hover:text-primary-coral py-2 text-left"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="w-5 h-5 mr-2" />
                  Войти
                </Link>
              )}
              <Button 
                variant="cta" 
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
                Попробовать бесплатно
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Header;