import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, MessageCircle, Phone, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const FAQSection: React.FC = () => {
  const { t } = useTranslation('faq');
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState(5);

  const categories = ['all', 'general', 'products', 'pricing', 'security', 'support'];
  const categoryLabels = t('categories', { returnObjects: true }) as Record<string, string>;
  const questionsData = t('questions', { returnObjects: true }) as Record<
    string,
    { question: string; answer: string; category: string }
  >;

  const faqs = Object.keys(questionsData).map((key, index) => ({
    id: index + 1,
    category: questionsData[key].category,
    question: questionsData[key].question,
    answer: questionsData[key].answer,
  }));

  // Фильтрация FAQ по категории и поисковому запросу
  const filteredFAQs = faqs.filter((faq) => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Ограничиваем отображение только для категории 'all'
  const displayedFAQs =
    activeCategory === 'all' ? filteredFAQs.slice(0, visibleCount) : filteredFAQs;

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // Сбросить количество видимых элементов при новом поиске
    if (activeCategory === 'all') {
      setVisibleCount(5);
    }
  };

  const loadMore = () => {
    setVisibleCount((prev) => prev + 5);
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
              placeholder={t('search_placeholder')}
              value={searchTerm}
              onChange={handleSearch}
              className="w-full px-6 py-4 rounded-2xl bg-bg-tertiary border border-border focus:outline-none focus:ring-2 focus:ring-primary-telegram pl-14"
            />
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-text-tertiary" />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
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
          {displayedFAQs.map((faq, index) => (
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

        {/* Load More Button - показываем только для вкладки 'Все' и если есть скрытые вопросы */}
        {activeCategory === 'all' && filteredFAQs.length > displayedFAQs.length && (
          <div className="text-center mt-8">
            <button
              onClick={loadMore}
              className="px-6 py-3 bg-gradient-to-r from-primary-telegram to-primary-electric text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              {t('load_more')}
            </button>
          </div>
        )}

        {/* Support Banner */}
        <motion.div
          className="mt-20 w-full max-w-[calc(100%-30px)] md:w-[calc(100%-500px)] mx-auto bg-white dark:bg-[#334155] backdrop-blur-[15px] rounded-[20px] p-6 sm:p-8 text-center text-text-primary dark:text-white shadow-[0_10px_30px_rgba(0,0,0,0.1),_10px_0_30px_rgba(0,0,0,0.1),_-10px_0_30px_rgba(0,0,0,0.1)]"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold">{t('not_found_banner.title')}</h3>
              <p className="mt-2 text-sm sm:text-base">{t('not_found_banner.subtitle')}</p>
            </div>
            <a
              href="https://t.me/AIBRO_Support"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 px-6 py-3 bg-[#00DDFD] text-white font-bold rounded-lg hover:opacity-90 transition-colors w-full sm:w-auto"
            >
              {t('not_found_banner.button')}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
