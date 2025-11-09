import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import ruCommon from './locales/ru/common.json';
import ruHero from './locales/ru/hero.json';
import ruProducts from './locales/ru/products.json';
import ruPricing from './locales/ru/pricing.json';
import ruFAQ from './locales/ru/faq.json';
import ruProblem from './locales/ru/problem.json';
import ruSolution from './locales/ru/solution.json';
import ruHowItWorks from './locales/ru/how_it_works.json';
import ruSuccessMetrics from './locales/ru/success_metrics.json';
import ruRoadmap from './locales/ru/roadmap.json';
import ruCta from './locales/ru/cta.json';
import ruFooter from './locales/ru/footer.json';

import enCommon from './locales/en/common.json';
import enHero from './locales/en/hero.json';
import enProducts from './locales/en/products.json';
import enPricing from './locales/en/pricing.json';
import enFAQ from './locales/en/faq.json';
import enProblem from './locales/en/problem.json';
import enSolution from './locales/en/solution.json';
import enHowItWorks from './locales/en/how_it_works.json';
import enSuccessMetrics from './locales/en/success_metrics.json';
import enRoadmap from './locales/en/roadmap.json';
import enCta from './locales/en/cta.json';
import enFooter from './locales/en/footer.json';

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
        faq: ruFAQ,
        problem: ruProblem,
        solution: ruSolution,
        how_it_works: ruHowItWorks,
        success_metrics: ruSuccessMetrics,
        roadmap: ruRoadmap,
        cta: ruCta,
        footer: ruFooter,
      },
      en: {
        common: enCommon,
        hero: enHero,
        products: enProducts,
        pricing: enPricing,
        faq: enFAQ,
        problem: enProblem,
        solution: enSolution,
        how_it_works: enHowItWorks,
        success_metrics: enSuccessMetrics,
        roadmap: enRoadmap,
        cta: enCta,
        footer: enFooter,
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
