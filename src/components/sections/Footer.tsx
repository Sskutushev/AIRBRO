import React from 'react';
import { Mail, Phone, MessageCircle, Globe, Twitter, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-text-primary text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="text-2xl font-bold gradient-text mb-4">AI-Spetsnaz</div>
            <p className="text-text-muted mb-4">
              Элитное спецподразделение по автоматизации индустрии
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-text-muted hover:text-white transition-colors">
                <Globe size={20} />
              </a>
              <a href="#" className="text-text-muted hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-text-muted hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">Контакты</h4>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Mail size={16} className="mr-2" />
                <a href="mailto:contact@ai-spetsnaz.com" className="text-text-muted hover:text-white transition-colors">
                  contact@ai-spetsnaz.com
                </a>
              </li>
              <li className="flex items-center">
                <Phone size={16} className="mr-2" />
                <a href="tel:+71234567890" className="text-text-muted hover:text-white transition-colors">
                  +7 (123) 456-78-90
                </a>
              </li>
              <li className="flex items-center">
                <MessageCircle size={16} className="mr-2" />
                <a href="#" className="text-text-muted hover:text-white transition-colors">
                  @AI_Spetsnaz
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">Быстрые ссылки</h4>
            <ul className="space-y-2">
              <li><a href="#problem" className="text-text-muted hover:text-white transition-colors">Проблема</a></li>
              <li><a href="#solution" className="text-text-muted hover:text-white transition-colors">Решение</a></li>
              <li><a href="#products" className="text-text-muted hover:text-white transition-colors">Продукты</a></li>
              <li><a href="#guarantees" className="text-text-muted hover:text-white transition-colors">Гарантии</a></li>
              <li><a href="#contact" className="text-text-muted hover:text-white transition-colors">Контакты</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">Правовая информация</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-text-muted hover:text-white transition-colors">Политика конфиденциальности</a></li>
              <li><a href="#" className="text-text-muted hover:text-white transition-colors">Пользовательское соглашение</a></li>
              <li><a href="#" className="text-text-muted hover:text-white transition-colors">Условия использования</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-text-muted">
          <p>© 2025 AI-Spetsnaz. Ваш личный AI-мозг.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;