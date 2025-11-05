import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, MessageCircle, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const FAQSection: React.FC = () => {
  const { t } = useTranslation('faq');
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = ['all', 'general', 'products', 'pricing', 'security', 'support'];
  const categoryLabels = {
    all: 'Все',
    general: 'Общее',
    products: 'Продукты',
    pricing: 'Цены',
    security: 'Безопасность',
    support: 'Поддержка'
  };

  const faqs = [
    {
      id: 1,
      category: 'general',
      question: t('questions.what_is_aibro.question'),
      answer: t('questions.what_is_aibro.answer')
    },
    {
      id: 2,
      category: 'general',
      question: t('questions.why_telegram.question'),
      answer: t('questions.why_telegram.answer')
    },
    {
      id: 3,
      category: 'general',
      question: 'Нужны ли технические знания?',
      answer: 'Нет. Если вы умеете пользоваться Telegram, вы сможете пользоваться AIBRO Business. Всё управление — через простые команды и кнопки в боте.'
    },
    {
      id: 4,
      category: 'products',
      question: 'Что входит в AI PostMaster?',
      answer: 'AI PostMaster автоматически создаёт и публикует контент для ваших Telegram-каналов. Включает: генерацию текста (Gemini 2.0 Flash), генерацию изображений (Imagen 4 Fast), умное планирование и персонализацию под ваш бренд.'
    },
    {
      id: 5,
      category: 'products',
      question: 'Могу ли я редактировать посты перед публикацией?',
      answer: 'Да! По умолчанию включен режим \'human-in-the-loop\' — вы видите пост перед публикацией и можете отредактировать или отклонить. Также можно включить автопубликацию для полной автоматизации.'
    },
    {
      id: 6,
      category: 'products',
      question: 'Когда будут доступны другие продукты (Conversation Bot и т.д.)?',
      answer: 'Conversation Bot запланирован на Q2 2025, Booking Bot — Q3 2025, Feedback Bot — Q4 2025. Подпишитесь на обновления, чтобы узнать первыми.'
    },
    {
      id: 7,
      category: 'pricing',
      question: 'Есть ли бесплатный trial?',
      answer: 'Да! 7 дней бесплатного доступа к AI PostMaster. Без привязки карты. После trial можете выбрать подходящий тариф или отказаться.'
    },
    {
      id: 8,
      category: 'pricing',
      question: 'Можно ли отменить подписку в любой момент?',
      answer: 'Да. Никаких долгосрочных контрактов. Отмените подписку в любой момент через бота. Доступ сохранится до конца оплаченного периода.'
    },
    {
      id: 9,
      category: 'pricing',
      question: 'Что если мне нужно больше/меньше продуктов?',
      answer: 'Модульная система позволяет добавлять или удалять продукты в любое время. Платите только за то, что используете.'
    },
    {
      id: 10,
      category: 'security',
      question: 'Безопасны ли мои данные?',
      answer: 'Да. Все данные хранятся в зашифрованном виде. Мы используем Google Cloud infrastructure с сертификацией SOC 2 Type II. Ваш персональный Data Store доступен только вам.'
    },
    {
      id: 11,
      category: 'security',
      question: 'Кто имеет доступ к моим постам и контенту?',
      answer: 'Только вы. AI генерирует контент на основе ваших данных, но мы не храним и не используем ваш контент для обучения моделей.'
    },
    {
      id: 12,
      category: 'support',
      question: 'Как получить помощь?',
      answer: 'Напишите @AIBROSupportBot в Telegram. Среднее время ответа — 2 часа (на тарифах Pro/Business). Также доступна база знаний и video-tutorials.'
    }
  ];

  const filteredFAQs = activeCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === activeCategory);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleSearch = () => {
    // В реальном приложении здесь будет фильтрация
  };

  return (
    <section id="faq" className="py-20 bg-gradient-to-b from-bg-primary to-bg-secondary">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 gradient-text">
            {t('frequently_asked')}
          </h2>
          <p className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto">
            {t('not_found')}
          </p>
        </motion.div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Поиск по вопросам..."
              onChange={handleSearch}
              className="w-full px-6 py-4 rounded-2xl bg-bg-tertiary border border-border focus:outline-none focus:ring-2 focus:ring-primary-telegram pl-14"
            />
            <MessageCircle className="absolute left-5 top-1/2 transform -translate-y-1/2 text-text-tertiary" />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map(category => (
            <button
              key={category}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category
                  ? 'bg-primary-telegram text-white'
                  : 'bg-bg-tertiary text-text-secondary hover:text-text-primary'
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {categoryLabels[category as keyof typeof categoryLabels]}
            </button>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto space-y-4">
          {filteredFAQs.map((faq, index) => (
            <motion.div
              key={faq.id}
              className="glass rounded-2xl overflow-hidden border border-border/50"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <button
                className="w-full flex justify-between items-center p-6 text-left"
                onClick={() => toggleFAQ(faq.id)}
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary-telegram/10 flex items-center justify-center text-primary-telegram mr-4">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <span className="text-lg font-semibold text-text-primary">{faq.question}</span>
                </div>
                <ChevronDown 
                  className={`w-6 h-6 text-text-secondary transition-transform duration-300 ${
                    openIndex === faq.id ? 'transform rotate-180' : ''
                  }`} 
                />
              </button>
              
              {openIndex === faq.id && (
                <motion.div 
                  className="px-6 pb-6 text-text-secondary border-t border-border"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {faq.answer}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Support Banner */}
        <motion.div 
          className="mt-20 bg-gradient-to-r from-primary-telegram to-primary-electric rounded-2xl p-8 text-center text-white"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Не нашли ответ?</h3>
              <p className="mt-2">Напишите нам в поддержку</p>
            </div>
            <button className="mt-4 md:mt-0 px-6 py-3 bg-white text-primary-telegram font-bold rounded-lg hover:bg-gray-100 transition-colors">
              Написать в поддержку
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;