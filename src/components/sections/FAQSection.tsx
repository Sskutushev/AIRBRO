import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Как быстро можно запустить AIBRO для моего бизнеса?",
      answer: "Процесс подключения занимает всего 5-10 минут. Вы подключаете свой Telegram-канал, настраиваете информацию о бизнесе, и AI начинает создавать контент уже в первый день. Для получения персонализированного контента рекомендуется добавить 5-10 примеров ваших постов."
    },
    {
      question: "Могу ли я интегрировать AIBRO с другими инструментами?",
      answer: "Да! У нас есть готовые интеграции с календарями Google и Яндекс, CRM-системами, а также платежными сервисами. Мы также предоставляем API для кастомных интеграций для enterprise-клиентов."
    },
    {
      question: "Какие отрасли лучше всего подходят для AIBRO?",
      answer: "AIBRO особенно эффективен для сервисных бизнесов: салоны красоты, фитнес-студии, рестораны, ритейл, консалтинг, образование. Однако мы успешно помогаем автоматизировать маркетинг и коммуникации для любой отрасли."
    },
    {
      question: "Какие гарантии вы предоставляете?",
      answer: "Мы предлагаем 72-часовой челлендж без рисков - если не увидите результат в течение 3 дней, вы не платите. Также предоставляем 30-дневную гарантию возврата денег для новых клиентов. Наши SLA включают 99.9% времени безотказной работы."
    },
    {
      question: "Как обеспечивается безопасность и конфиденциальность данных?",
      answer: "Мы используем шифрование данных AES-256, хранение данных в защищенных дата-центрах, и соблюдаем требования GDPR. Все данные клиентов изолированы и не используются для обучения общих моделей. Вы всегда контролируете свои данные и можете экспортировать их в любой момент."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-gradient-to-b from-white to-bg-secondary">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            Ответы на вопросы
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Часто задаваемые вопросы о платформе AIBRO Business
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <button
                className="w-full flex justify-between items-center p-6 text-left"
                onClick={() => toggleFAQ(index)}
              >
                <div className="flex items-center">
                  <HelpCircle className="w-6 h-6 text-primary-electric mr-4" />
                  <span className="text-lg font-semibold text-text-primary">{faq.question}</span>
                </div>
                <ChevronDown 
                  className={`w-6 h-6 text-text-secondary transition-transform duration-300 ${
                    openIndex === index ? 'transform rotate-180' : ''
                  }`} 
                />
              </button>
              
              {openIndex === index && (
                <motion.div 
                  className="px-6 pb-6 text-text-secondary"
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
      </div>
    </section>
  );
};

export default FAQSection;