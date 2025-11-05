import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import ruCommon from './locales/ru/common.json';
import ruHero from './locales/ru/hero.json';
import ruProducts from './locales/ru/products.json';
import ruPricing from './locales/ru/pricing.json';
import ruFAQ from './locales/ru/faq.json';

import enCommon from './locales/en/common.json';
import enHero from './locales/en/hero.json';
import enProducts from './locales/en/products.json';
import enPricing from './locales/en/pricing.json';
import enFAQ from './locales/en/faq.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ru: {
        common: ruCommon,
        hero: ruHero,
        products: ruProducts,
        pricing: ruPricing,
        faq: ruFAQ
      },
      en: {
        common: enCommon,
        hero: enHero,
        products: enProducts,
        pricing: enPricing,
        faq: enFAQ
      },
    },
    fallbackLng: 'ru',
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;