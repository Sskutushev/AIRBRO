import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../common/Button';
import { Mail, User, Building, Briefcase, Users, MessageSquare, MessageCircle, Zap, Shield, Clock } from 'lucide-react';
import { staggerContainer, fadeInUp } from '../../lib/motionPresets';

// Определяем тип для статуса отправки
type SubmissionStatus = 'idle' | 'loading' | 'success' | 'error';

const CTASection: React.FC = () => {
  // Состояние для данных формы
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    service: 'AI PostMaster', // Значение по умолчанию для AIRBRO
    employees: '1-10', // Значение по умолчанию для малого бизнеса
    problem: ''
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
        body: JSON.stringify(formData),
      });

      // Если ответ не успешный, выбрасываем ошибку
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Если все хорошо, устанавливаем статус "успех"
      setSubmissionStatus('success');
      
      // Очищаем форму через 5 секунд
      setTimeout(() => {
        setFormData({ name: '', email: '', company: '', service: 'AI PostMaster', employees: '1-10', problem: '' });
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
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-12 text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="text-6xl mb-6">🎉</div>
            <h3 className="text-3xl font-bold text-text-primary mb-4">Спасибо за заявку!</h3>
            <p className="text-text-secondary mb-6">
              Мы свяжемся с вами в ближайшее время для начала 72-часового челленджа.
            </p>
            <div className="inline-block animate-bounce">
              <div className="text-4xl">🚀</div>
            </div>
          </motion.div>
        );
      case 'error':
        return (
          <motion.div 
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-12 text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="text-6xl mb-6">😥</div>
            <h3 className="text-3xl font-bold text-red-600 mb-4">Произошла ошибка</h3>
            <p className="text-text-secondary mb-6">
              Не удалось отправить заявку. Пожалуйста, попробуйте еще раз или свяжитесь с нами напрямую в Telegram.
            </p>
            <Button onClick={() => setSubmissionStatus('idle')}>Попробовать снова</Button>
          </motion.div>
        );
      default:
        return (
          <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 space-y-6">
            {/* Поля формы */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Имя */}
              <div>
                <label htmlFor="name" className="block text-text-primary font-medium mb-2 flex items-center">
                  <User size={18} className="mr-2 text-primary-electric" /> Имя*
                </label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-electric" placeholder="Иван Иванов" />
              </div>
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-text-primary font-medium mb-2 flex items-center">
                  <Mail size={18} className="mr-2 text-primary-electric" /> Email*
                </label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-electric" placeholder="email@example.com" />
              </div>
              {/* Компания */}
              <div>
                <label htmlFor="company" className="block text-text-primary font-medium mb-2 flex items-center">
                  <Building size={18} className="mr-2 text-primary-violet" /> Компания
                </label>
                <input type="text" id="company" name="company" value={formData.company} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-violet" placeholder="Название вашего бизнеса" />
              </div>
              {/* Интересующая услуга */}
              <div>
                <label htmlFor="service" className="block text-text-primary font-medium mb-2 flex items-center">
                  <Briefcase size={18} className="mr-2 text-primary-gold" /> Что интересует?
                </label>
                <select id="service" name="service" value={formData.service} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-gold">
                  <option>AI PostMaster</option>
                  <option>Conversation Bot</option>
                  <option>Booking Bot</option>
                  <option>Restaurant Suite</option>
                  <option>Beauty Suite</option>
                  <option>Другое</option>
                </select>
              </div>
              {/* Количество сотрудников */}
              <div className="md:col-span-2">
                 <label htmlFor="employees" className="block text-text-primary font-medium mb-2 flex items-center">
                  <Users size={18} className="mr-2 text-primary-coral" /> Количество сотрудников в бизнесе
                </label>
                <select id="employees" name="employees" value={formData.employees} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-coral">
                  <option>1-10</option>
                  <option>11-30</option>
                  <option>31-50</option>
                  <option>50+</option>
                </select>
              </div>
              {/* Описание проблемы */}
              <div className="md:col-span-2">
                <label htmlFor="problem" className="block text-text-primary font-medium mb-2 flex items-center">
                  <MessageSquare size={18} className="mr-2 text-primary-electric" /> Опишите вашу бизнес-проблему*
                </label>
                <textarea id="problem" name="problem" value={formData.problem} onChange={handleChange} required rows={4} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-electric" placeholder="Например: 'У меня нет времени на создание контента для Telegram-канала'"></textarea>
              </div>
            </div>
            
            {/* Согласие и кнопка */}
            <div>
              <label className="flex items-start mb-6">
                <input type="checkbox" checked={consent} onChange={() => setConsent(!consent)} required className="mt-1 mr-3 h-5 w-5 accent-primary-electric" />
                <span className="text-text-secondary text-sm">
                  Я соглашаюсь на обработку персональных данных и принимаю условия <a href="/privacy-policy" target="_blank" className="text-primary-electric hover:underline">политики конфиденциальности</a>.
                </span>
              </label>
              
              <button type="submit" disabled={submissionStatus === 'loading'} className="w-full btn-primary text-lg py-4 disabled:opacity-70 disabled:cursor-not-allowed bg-gradient-to-r from-primary-electric to-primary-violet text-white">
                {submissionStatus === 'loading' ? 'Отправка...' : 'Начать 72-часовой челлендж'}
              </button>
            </div>
          </form>
        );
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-primary-electric to-primary-violet" id="contact">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          <motion.h2 className="text-4xl md:text-5xl font-bold mb-4 text-white" variants={fadeInUp}>
            Начните 72-часовой челлендж
          </motion.h2>
          <motion.p className="text-2xl text-white/90 max-w-3xl mx-auto" variants={fadeInUp}>
            Протестируйте платформу бесплатно и без рисков
          </motion.p>
          <motion.p className="text-xl text-white/80 max-w-2xl mx-auto mt-6" variants={fadeInUp}>
            Если не увидите результат в течение 72 часов - не платите
          </motion.p>
        </motion.div>

        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          {renderContent()}
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
            <Zap className="w-8 h-8 text-white mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">Быстрый старт</h3>
            <p className="text-white/80">Запуск за 5 минут, первые результаты за 72 часа</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
            <Shield className="w-8 h-8 text-white mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">Без рисков</h3>
            <p className="text-white/80">Не видите результат - не платите</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
            <Clock className="w-8 h-8 text-white mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">Ограниченное время</h3>
            <p className="text-white/80">Только для первых 100 участников</p>
          </div>
        </motion.div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Button 
            variant="secondary" 
            size="lg" 
            className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30"
            glow={true}
          >
            <MessageCircle className="mr-2" />
            Написать в Telegram
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;