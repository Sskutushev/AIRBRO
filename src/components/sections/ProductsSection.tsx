import React, { useState, memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, Star, Bot, Video, Coins } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ModulePopup from '../common/ModulePopup';

// Define a basic Product interface for now, will be replaced by actual API types later
interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: React.ReactNode;
  price: string;
  status: string;
  statusText: string;
}

// Memoized ProductCard component
const ProductCard = memo<{ product: Product; onSelect: (product: Product) => void }>(
  ({ product, onSelect }) => {
    const handleClick = useCallback(() => {
      onSelect(product);
    }, [product, onSelect]);

    return (
      <motion.div
        key={product.id}
        className="glass rounded-2xl p-6 border border-border/50 hover:scale-105 transition-transform duration-300"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        onClick={handleClick}
      >
        <div className="flex items-center mb-4">
          <div className="bg-primary-electric/20 w-12 h-12 rounded-xl flex items-center justify-center text-primary-electric mr-4">
            {product.icon}
          </div>
          <div>
            <h4 className="font-bold text-lg text-text-primary">{product.name}</h4>
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                product.status === 'available'
                  ? 'bg-green-500/20 text-green-600'
                  : product.status === 'coming'
                    ? 'bg-yellow-500/20 text-yellow-600'
                    : 'bg-red-500/20 text-red-600'
              }`}
            >
              {product.statusText}
            </span>
          </div>
        </div>

        <p className="text-text-secondary text-sm mb-4">{product.tagline}</p>
        <p className="text-text-secondary text-xs mb-6">{product.description}</p>

        <div className="text-primary-telegram font-bold text-lg mb-4">{product.price}</div>

        <button
          className="w-full py-2 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-colors"
          onClick={handleClick} // Use handleClick for the button as well
        >
          Узнать больше
        </button>
      </motion.div>
    );
  }
);

ProductCard.displayName = 'ProductCard';

const ProductsSection = memo(() => {
  const { t } = useTranslation('products');
  const [activeModule, setActiveModule] = useState<{
    id: string;
    name: string;
    icon: string;
    tagline: string;
    price: string;
    status: string;
  } | null>(null);

  // Tier 1 Product (Featured)
  const aiPostMaster = {
    id: 'ai-postmaster',
    name: t('ai_postmaster.name'),
    tagline: t('ai_postmaster.tagline'),
    description: t('ai_postmaster.description'),
    icon: <Coins className="w-10 h-10" />,
    features: [
      t('ai_postmaster.features.text_gen'),
      t('ai_postmaster.features.image_gen'),
      t('ai_postmaster.features.smart_scheduling'),
      t('ai_postmaster.features.brand_personalization'),
    ],
  };

  const postMasterPricing = t('ai_postmaster.pricing', { returnObjects: true }) as any;

  // Tier 2 Products
  const additionalModulesData = t('additional_modules', { returnObjects: true }) as any;


  // Tier 2 Products
  const tier2Products: Product[] = Object.keys(additionalModulesData)
    .filter((key) => key !== 'title')
    .map((key) => ({
      id: key,
      name: additionalModulesData[key].name,
      tagline: additionalModulesData[key].tagline,
      description: additionalModulesData[key].description,
      price: additionalModulesData[key].price,
      statusText: additionalModulesData[key].status,
      status: 'coming', // Simplified status for logic
      icon:
        key === 'conversation_bot' ? (
          <Users className="w-8 h-8" />
        ) : key === 'booking_bot' ? (
          <Calendar className="w-8 h-8" />
        ) : key === 'feedback_bot' ? (
          <Star className="w-8 h-8" />
        ) : (
          <Video className="w-8 h-8" />
        ),
    }));

  const handleProductSelect = useCallback((product: Product) => {
    setActiveModule({
      id: product.id,
      name: product.name,
      icon:
        product.id === 'conversation-bot'
          ? '💬'
          : product.id === 'booking-bot'
            ? '📅'
            : product.id === 'feedback-bot'
              ? '⭐'
              : '📹',
      tagline: product.tagline,
      price: product.price,
      status: product.statusText,
    });
  }, []);

  return (
    <section id="products" className="py-20 bg-gradient-to-b from-bg-primary to-bg-secondary">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 gradient-text">
            {t('ecosystem')}
          </h2>
          <p className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto">
            {t('description')}
          </p>
        </motion.div>

        {/* Featured Product (AI PostMaster) */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="bg-gradient-to-r from-primary-telegram to-primary-electric rounded-3xl p-8 md:p-12 text-white bg-opacity-85">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 text-center md:text-left">
                <div className="inline-block bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full mb-4">
                  MOST POPULAR
                </div>
                <h3 className="text-3xl md:text-4xl font-bold mb-3">{aiPostMaster.name}</h3>
                <p className="text-lg mb-6 opacity-90">{aiPostMaster.tagline}</p>
                <p className="mb-6 opacity-80">{aiPostMaster.description}</p>

                <ul className="space-y-2 mb-8">
                  {aiPostMaster.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <Bot className="w-4 h-4 mr-2 opacity-80" />
                      <span className="opacity-90">{feature}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="https://t.me/aipostmaster_bot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-white text-primary-telegram font-bold px-8 py-4 rounded-lg text-lg hover:bg-gray-100 transition-colors"
                >
                  {t('ai_postmaster.cta_button')}
                </a>
              </div>

              <div className="flex-1 flex justify-center">
                <div className="bg-[#334155]/70 backdrop-blur-[15px] rounded-2xl p-8 border border-white/20 w-full max-w-md">
                  <div className="flex items-center justify-center mb-6">
                    <div className="bg-primary-mint/20 w-16 h-16 rounded-full flex items-center justify-center mr-3">
                      {aiPostMaster.icon}
                    </div>
                    <h4 className="font-bold text-lg">{t('ai_postmaster.pricing_title')}</h4>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-white/10 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Starter</span>
                        <span className="font-bold text-xl">{postMasterPricing.starter.price}</span>
                      </div>
                      <ul className="text-sm space-y-1 opacity-80">
                        {postMasterPricing.starter.features.map((feature: string, idx: number) => (
                          <li key={idx}>• {feature}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-white/10 rounded-xl p-4 relative">
                      <div className="absolute top-[-10px] left-[-10px] bg-gradient-to-r from-primary-telegram to-primary-electric text-white font-bold text-xs px-3 py-1 rounded-full animate-pulse whitespace-nowrap">
                        {t('recommended_badge')}
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Business</span>
                        <div className="flex flex-col items-end">
                          <span className="font-bold text-xl">{postMasterPricing.pro.price}</span>
                        </div>
                      </div>
                      <ul className="text-sm space-y-1 opacity-80">
                        {postMasterPricing.pro.features.map((feature: string, idx: number) => (
                          <li key={idx}>• {feature}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-white/10 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Premium</span>
                        <span className="font-bold text-xl">{postMasterPricing.business.price}</span>
                      </div>
                      <ul className="text-sm space-y-1 opacity-80">
                        {postMasterPricing.business.features.map((feature: string, idx: number) => (
                          <li key={idx}>• {feature}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tier 2 Products */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-text-primary">
            {t('additional_modules.title')}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tier2Products.map((product) => (
              <ProductCard key={product.id} product={product} onSelect={handleProductSelect} />
            ))}
          </div>
        </motion.div>

        {/* Module Popup */}
        <ModulePopup
          isOpen={!!activeModule}
          onClose={() => setActiveModule(null)}
          moduleId={activeModule?.id || ''}
          moduleName={activeModule?.name || ''}
          moduleIcon={activeModule?.icon || ''}
          tagline={activeModule?.tagline || ''}
          price={activeModule?.price || ''}
          status={activeModule?.status || ''}
        />
      </div>
    </section>
  );
});

ProductsSection.displayName = 'ProductsSection';

export default ProductsSection;
