import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Mail, User, Building, MessageSquare, Shield, Clock } from 'lucide-react';

type SubmissionStatus = 'idle' | 'loading' | 'success' | 'error';

const CTASection: React.FC = () => {
  const { t } = useTranslation('cta');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    telegram: '',
    business: '',
    product: 'AI PostMaster',
    description: ''
  });
  const [consent, setConsent] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      alert(t('form.consent_alert'));
      return;
    }
    
    setSubmissionStatus('loading');

    try {
      const response = await fetch('http://localhost:3000/api/telegram/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setSubmissionStatus('success');
      
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
      console.error('Failed to send message:', error);
      setSubmissionStatus('error');
    }
  };

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
            <h3 className="text-3xl font-bold text-text-primary mb-4">{t('success.title')}</h3>
            <p className="text-text-secondary mb-6">{t('success.message')}</p>
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
            <h3 className="text-3xl font-bold text-red-500 mb-4">{t('error.title')}</h3>
            <p className="text-text-secondary mb-6">{t('error.message')}</p>
            <button 
              onClick={() => setSubmissionStatus('idle')}
              className="px-6 py-3 bg-primary-telegram text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              {t('error.button')}
            </button>
          </motion.div>
        );
      default:
        return (
          <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 space-y-6 border border-border/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-text-primary font-medium mb-2 flex items-center">
                  <User size={18} className="mr-2 text-primary-telegram" /> 
                  {t('form.name')} *
                </label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-4 py-3 bg-bg-primary border border-border rounded-lg focus:ring-2 focus:ring-primary-telegram focus:border-transparent text-text-primary placeholder:text-text-tertiary" 
                  placeholder={t('form.name_placeholder')} 
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-text-primary font-medium mb-2 flex items-center">
                  <Mail size={18} className="mr-2 text-primary-telegram" /> 
                  {t('form.email')} *
                </label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-4 py-3 bg-bg-primary border border-border rounded-lg focus:ring-2 focus:ring-primary-telegram focus:border-transparent text-text-primary placeholder:text-text-tertiary" 
                  placeholder={t('form.email_placeholder')} 
                />
              </div>
              
              <div>
                <label htmlFor="telegram" className="block text-text-primary font-medium mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" className="mr-2 text-primary-telegram">
                    <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m6.62 5.42l-1.5 7.13c-.11.51-.43.65-.91.41l-3-1.91l-1.48 1.4c-.12.11-.21.2-.28.3l-1.17 2.09c-.21.33-.4.24-.63-.12l-1.89-3.18l-4.4-1.64c-.34-.13-.33-.38.09-.55l11.27-4.4c.33-.13.63.1.5.44l-1.1 2.5l-1.97-.61c-.34-.11-.34.14-.1.3l1.45 1.1l-.58 2.43c-.07.31.12.37.33.22l1.35-1.07l2.93 2.91c.19.19.37.13.44-.15l.86-4.3c.08-.36-.24-.5-.54-.28l-2.18 1.61l-.62-1.86c-.08-.24.12-.33.32-.21l4.94 3.28c.35.2.44.05.36-.34"/>
                  </svg>
                  {t('form.telegram')} *
                </label>
                <input 
                  type="text" 
                  id="telegram" 
                  name="telegram" 
                  value={formData.telegram} 
                  onChange={handleChange} 
                  required 
                  pattern="^@[a-zA-Z0-9_]{5,}$"
                  className="w-full px-4 py-3 bg-bg-primary border border-border rounded-lg focus:ring-2 focus:ring-primary-telegram focus:border-transparent text-text-primary placeholder:text-text-tertiary" 
                  placeholder={t('form.telegram_placeholder')} 
                />
              </div>
              
              <div>
                <label htmlFor="business" className="block text-text-primary font-medium mb-2 flex items-center">
                  <Building size={18} className="mr-2 text-primary-electric" /> 
                  {t('form.business')}
                </label>
                <input 
                  type="text" 
                  id="business" 
                  name="business" 
                  value={formData.business} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 bg-bg-primary border border-border rounded-lg focus:ring-2 focus:ring-primary-electric focus:border-transparent text-text-primary placeholder:text-text-tertiary" 
                  placeholder={t('form.business_placeholder')} 
                />
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="product" className="block text-text-primary font-medium mb-2">
                  {t('form.product_interest')}
                </label>
                <select 
                  id="product" 
                  name="product" 
                  value={formData.product} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 bg-bg-primary border border-border rounded-lg focus:ring-2 focus:ring-primary-violet focus:border-transparent text-text-primary"
                >
                  {Object.entries(t('form.products', { returnObjects: true }) as { [key: string]: string }).map(([key, value]) => (
                    <option key={key} value={value}>{value}</option>
                  ))}
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-text-primary font-medium mb-2 flex items-center">
                  <MessageSquare size={18} className="mr-2 text-primary-telegram" /> 
                  {t('form.problem_description')} *
                </label>
                <textarea 
                  id="description" 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange} 
                  required 
                  rows={4} 
                  className="w-full px-4 py-3 bg-bg-primary border border-border rounded-lg focus:ring-2 focus:ring-primary-telegram focus:border-transparent text-text-primary placeholder:text-text-tertiary" 
                  placeholder={t('form.problem_placeholder')}
                ></textarea>
              </div>
            </div>
            
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
                  {t('form.consent')}{' '}
                  <a href="/privacy-policy" target="_blank" className="text-primary-telegram hover:underline">{t('form.privacy_policy')}</a>.
                </span>
              </label>
              
              <button 
                type="submit" 
                disabled={submissionStatus === 'loading'} 
                className="w-full py-4 bg-gradient-to-r from-primary-telegram to-primary-electric text-white font-bold rounded-lg hover:opacity-90 transition-opacity text-lg"
              >
                {submissionStatus === 'loading' ? t('form.submitting_button') : t('form.submit_button')}
              </button>
            </div>
          </form>
        );
    }
  };

  const features = t('features', { returnObjects: true }) as { title: string; description: string }[];

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
            {t('title')}
          </h2>
          <p className="text-2xl text-white/90 max-w-3xl mx-auto mb-6">
            {t('subtitle', { count: 500 })}
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
          {features.map((feature, index) => (
            <div key={index} className="glass rounded-xl p-6 text-center border border-border/50">
              <div className="w-16 h-16 bg-primary-mint/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-mint">
                {index === 0 ? <Shield className="w-8 h-8" /> : index === 1 ? <Clock className="w-8 h-8" /> : <div className="text-2xl">💯</div>}
              </div>
              <h3 className="font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-white/80">{feature.description}</p>
            </div>
          ))}
        </motion.div>

        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <a 
            href="https://t.me/zayavki_ai" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-white font-bold text-lg hover:opacity-90 transition-opacity"
          >
            {t('final_link')}
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;