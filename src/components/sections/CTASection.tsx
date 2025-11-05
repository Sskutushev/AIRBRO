import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, User, Building, MessageSquare, Shield, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Определяем тип для статуса отправки
type SubmissionStatus = 'idle' | 'loading' | 'success' | 'error';

const CTASection: React.FC = () => {
  const { t } = useTranslation();
  // Состояние для данных формы
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    telegram: '',
    business: '',
    product: 'AI PostMaster',
    description: ''
  });
  // Состояние для согласия на обработку данных
  const [consent, setConsent] = useState(false);
  // Состояние для статуса отправки формы
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>('idle');

  // Обработчик изменений в полях ввода и выбора
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Обработчик отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      alert('Пожалуйста, дайте согласие на обработку данных.');
      return;
    }
    
    setSubmissionStatus('loading'); // Устанавливаем статус "загрузка"

    try {
      // Отправляем POST-запрос на нашу серверную функцию
      const response = await fetch('/api/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          product: formData.product,
          description: formData.description
        }),
      });

      // Если ответ не успешный, выбрасываем ошибку
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Если все хорошо, устанавливаем статус "успех"
      setSubmissionStatus('success');
      
      // Очищаем форму через 5 секунд
      setTimeout(() => {
        setFormData({ 
          name: '', 
          email: '', 
          telegram: '', 
          business: '', 
          product: 'AI PostMaster', 
          description: '' 
        });
        setConsent(false);
        setSubmissionStatus('idle');
      }, 5000);

    } catch (error) {
      // В случае ошибки устанавливаем статус "ошибка"
      console.error('Failed to send message:', error);
      setSubmissionStatus('error');
    }
  };

  // Функция для отображения контента в зависимости от статуса
  const renderContent = () => {
    switch (submissionStatus) {
      case 'success':
        return (
          <motion.div 
            className="glass rounded-2xl p-12 text-center border border-border/50"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="text-6xl mb-6">✅</div>
            <h3 className="text-3xl font-bold text-text-primary mb-4">Заявка отправлена!</h3>
            <p className="text-text-secondary mb-6">
              Мы отправили вам сообщение в Telegram.
              Проверьте @AIBROBusinessBot.
            </p>
            <div className="flex justify-center">
              <a 
                href="https://t.me/AIBROBusinessBot" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-telegram to-primary-electric text-white rounded-lg font-bold hover:opacity-90 transition-opacity"
              >
                Перейти в Telegram
              </a>
            </div>
          </motion.div>
        );
      case 'error':
        return (
          <motion.div 
            className="glass rounded-2xl p-12 text-center border border-border/50"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="text-6xl mb-6">⚠️</div>
            <h3 className="text-3xl font-bold text-red-500 mb-4">Произошла ошибка</h3>
            <p className="text-text-secondary mb-6">
              Не удалось отправить заявку. Пожалуйста, попробуйте еще раз или свяжитесь с нами напрямую в Telegram.
            </p>
            <button 
              onClick={() => setSubmissionStatus('idle')}
              className="px-6 py-3 bg-primary-telegram text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Попробовать снова
            </button>
          </motion.div>
        );
      default:
        return (
          <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 space-y-6 border border-border/50">
            {/* Поля формы */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Имя */}
              <div>
                <label htmlFor="name" className="block text-text-primary font-medium mb-2 flex items-center">
                  <User size={18} className="mr-2 text-primary-telegram" /> 
                  Имя *
                </label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-4 py-3 bg-bg-primary border border-border rounded-lg focus:ring-2 focus:ring-primary-telegram focus:border-transparent" 
                  placeholder="Иван Иванов" 
                />
              </div>
              
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-text-primary font-medium mb-2 flex items-center">
                  <Mail size={18} className="mr-2 text-primary-telegram" /> 
                  Email *
                </label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-4 py-3 bg-bg-primary border border-border rounded-lg focus:ring-2 focus:ring-primary-telegram focus:border-transparent" 
                  placeholder="email@example.com" 
                />
              </div>
              
              {/* Telegram */}
              <div>
                <label htmlFor="telegram" className="block text-text-primary font-medium mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" className="mr-2 text-primary-telegram">
                    <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m6.62 5.42l-1.5 7.13c-.11.51-.43.65-.91.41l-3-1.91l-1.48 1.4c-.12.11-.21.2-.28.3l-1.17 2.09c-.21.33-.4.24-.63-.12l-1.89-3.18l-4.4-1.64c-.34-.13-.33-.38.09-.55l11.27-4.4c.33-.13.63.1.5.44l-1.1 2.5l-1.97-.61c-.34-.11-.34.14-.1.3l1.45 1.1l-.58 2.43c-.07.31.12.37.33.22l1.35-1.07l2.93 2.91c.19.19.37.13.44-.15l.86-4.3c.08-.36-.24-.5-.54-.28l-2.18 1.61l-.62-1.86c-.08-.24.12-.33.32-.21l4.94 3.28c.35.2.44.05.36-.34"/>
                  </svg>
                  Telegram *
                </label>
                <input 
                  type="text" 
                  id="telegram" 
                  name="telegram" 
                  value={formData.telegram} 
                  onChange={handleChange} 
                  required 
                  pattern="^@[a-zA-Z0-9_]{5,}$"
                  className="w-full px-4 py-3 bg-bg-primary border border-border rounded-lg focus:ring-2 focus:ring-primary-telegram focus:border-transparent" 
                  placeholder="@username" 
                />
              </div>
              
              {/* Название бизнеса */}
              <div>
                <label htmlFor="business" className="block text-text-primary font-medium mb-2 flex items-center">
                  <Building size={18} className="mr-2 text-primary-electric" /> 
                  Название бизнеса
                </label>
                <input 
                  type="text" 
                  id="business" 
                  name="business" 
                  value={formData.business} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 bg-bg-primary border border-border rounded-lg focus:ring-2 focus:ring-primary-electric focus:border-transparent" 
                  placeholder="Мой бизнес" 
                />
              </div>
              
              {/* Интересующий продукт */}
              <div className="md:col-span-2">
                <label htmlFor="product" className="block text-text-primary font-medium mb-2">
                  Что вас интересует?
                </label>
                <select 
                  id="product" 
                  name="product" 
                  value={formData.product} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 bg-bg-primary border border-border rounded-lg focus:ring-2 focus:ring-primary-violet focus:border-transparent"
                >
                  <option value="AI PostMaster">AI PostMaster</option>
                  <option value="Conversation Bot">Conversation Bot</option>
                  <option value="Booking Bot">Booking Bot</option>
                  <option value="Feedback Bot">Feedback Bot</option>
                  <option value="Video Inventory">Video Inventory Agent</option>
                  <option value="Restaurant Suite">Restaurant Suite</option>
                  <option value="Beauty Suite">Beauty & Wellness Suite</option>
                  <option value="Fitness Suite">Fitness Suite</option>
                  <option value="Retail Suite">Retail Suite</option>
                  <option value="Not Sure">Не уверен</option>
                </select>
              </div>
              
              {/* Описание проблемы */}
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-text-primary font-medium mb-2 flex items-center">
                  <MessageSquare size={18} className="mr-2 text-primary-telegram" /> 
                  Расскажите, что хотите автоматизировать *
                </label>
                <textarea 
                  id="description" 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange} 
                  required 
                  rows={4} 
                  className="w-full px-4 py-3 bg-bg-primary border border-border rounded-lg focus:ring-2 focus:ring-primary-telegram focus:border-transparent" 
                  placeholder="Например: создание контента для Telegram, ответы на сообщения, бронирования..."
                ></textarea>
              </div>
            </div>
            
            {/* Согласие и кнопка */}
            <div>
              <label className="flex items-start mb-6">
                <input 
                  type="checkbox" 
                  checked={consent} 
                  onChange={() => setConsent(!consent)} 
                  required 
                  className="mt-1 mr-3 h-5 w-5 accent-primary-telegram rounded" 
                />
                <span className="text-text-secondary text-sm">
                  Я согласен на обработку персональных данных и принимаю условия{' '}
                  <a href="/privacy-policy" target="_blank" className="text-primary-telegram hover:underline">политики конфиденциальности</a>.
                </span>
              </label>
              
              <button 
                type="submit" 
                disabled={submissionStatus === 'loading'} 
                className="w-full py-4 bg-gradient-to-r from-primary-telegram to-primary-electric text-white font-bold rounded-lg hover:opacity-90 transition-opacity text-lg"
              >
                {submissionStatus === 'loading' ? 'Отправка...' : 'Получить бесплатный trial'}
              </button>
            </div>
          </form>
        );
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-primary-telegram to-primary-electric" id="contact">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white">
            Готовы автоматизировать свой бизнес?
          </h2>
          <p className="text-2xl text-white/90 max-w-3xl mx-auto mb-6">
            Присоединяйтесь к {new Intl.NumberFormat('ru-RU').format(500)}+ бизнесам, которые уже используют AIBRO
          </p>
        </motion.div>

        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {renderContent()}
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="glass rounded-xl p-6 text-center border border-border/50">
            <div className="w-16 h-16 bg-primary-mint/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-mint">
              <Shield className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-white mb-2">Безопасно</h3>
            <p className="text-white/80">Все данные зашифрованы и хранятся в защищённом виде</p>
          </div>
          <div className="glass rounded-xl p-6 text-center border border-border/50">
            <div className="w-16 h-16 bg-primary-electric/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-electric">
              <Clock className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-white mb-2">Быстро</h3>
            <p className="text-white/80">Запуск за 15 минут. Первый результат за 72 часа.</p>
          </div>
          <div className="glass rounded-xl p-6 text-center border border-border/50">
            <div className="w-16 h-16 bg-primary-telegram/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-telegram">
              <div className="text-2xl">💯</div>
            </div>
            <h3 className="font-bold text-white mb-2">Бесплатный trial</h3>
            <p className="text-white/80">7 дней бесплатно. Без привязки карты.</p>
          </div>
        </motion.div>

        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <a 
            href="https://t.me/AIBROBusinessBot" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-white font-bold text-lg hover:opacity-90 transition-opacity"
          >
            Или напишите нам в Telegram →
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;