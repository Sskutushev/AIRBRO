import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Calendar, Rocket, Zap } from 'lucide-react';

const RoadmapSection: React.FC = () => {
  const quarters = [
    {
      id: "q4-2025",
      label: "Q4 2025",
      status: "in-progress",
      features: [
        {
          id: "apm-v1",
          title: "AI PostMaster V1 (Gemini 2.0 Flash + Imagen 4)",
          description: "Core functionality with RAG Data Stores"
        },
        {
          id: "multi-channel",
          title: "Multi-channel support (Telegram)",
          description: "Manage multiple channels from one dashboard"
        },
        {
          id: "rag-ds",
          title: "RAG Data Stores",
          description: "Personalized AI based on your business data"
        },
        {
          id: "basic-analytics",
          title: "Basic analytics",
          description: "Performance metrics and insights"
        }
      ]
    },
    {
      id: "q1-2026",
      label: "Q1 2026",
      status: "planned",
      features: [
        {
          id: "conv-bot-v1",
          title: "Conversation Bot V1",
          description: "AI assistant for customer support"
        },
        {
          id: "multi-lang",
          title: "Multi-language support (EN, RU)",
          description: "Expand to international markets"
        },
        {
          id: "adv-analytics",
          title: "Advanced analytics dashboard",
          description: "Deeper insights and reporting"
        },
        {
          id: "api-beta",
          title: "API beta access",
          description: "For developers and custom integrations"
        }
      ]
    },
    {
      id: "q2-2026",
      label: "Q2 2026",
      status: "planned",
      features: [
        {
          id: "booking-bot-v1",
          title: "Booking Bot V1",
          description: "Automated appointment scheduling"
        },
        {
          id: "feedback-bot-v1",
          title: "Feedback Bot V1",
          description: "Review collection and reputation management"
        },
        {
          id: "restaurant-suite",
          title: "Restaurant & Beauty Suites",
          description: "Industry-specific bundles"
        },
        {
          id: "white-label",
          title: "White-label option",
          description: "Custom branding for agencies"
        }
      ]
    },
    {
      id: "q3-2026",
      label: "Q3 2026",
      status: "future",
      features: [
        {
          id: "video-inventory",
          title: "Video Inventory Agent (R&D)",
          description: "Computer vision for inventory management"
        },
        {
          id: "fitness-retail-suites",
          title: "Fitness & Retail Suites",
          description: "Additional industry bundles"
        },
        {
          id: "premium-features",
          title: "Premium features (Analytics Pro)",
          description: "Advanced analytics and reporting"
        },
        {
          id: "intl-expansion",
          title: "International expansion",
          description: "Market entry in new regions"
        }
      ]
    },
    {
      id: "2027",
      label: "2027+",
      status: "vision",
      features: [
        {
          id: "voice-integration",
          title: "Voice AI integration",
          description: "Voice commands and responses"
        },
        {
          id: "cv-features",
          title: "Computer Vision features",
          description: "Advanced visual recognition"
        },
        {
          id: "iot-integration",
          title: "IoT device integration",
          description: "Connect with physical devices"
        },
        {
          id: "full-biz-os",
          title: "Full Business OS",
          description: "Complete management platform"
        }
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in-progress': return <Clock className="w-5 h-5 text-blue-500" />;
      case 'planned': return <Calendar className="w-5 h-5 text-yellow-500" />;
      case 'future': return <Zap className="w-5 h-5 text-purple-500" />;
      case 'vision': return <Rocket className="w-5 h-5 text-indigo-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'planned': return 'bg-yellow-500';
      case 'future': return 'bg-purple-500';
      case 'vision': return 'bg-indigo-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <section id="roadmap" className="py-20 bg-gradient-to-b from-bg-primary to-bg-secondary">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 gradient-text">
            Что дальше?
          </h2>
          <p className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto">
            Мы постоянно развиваемся. Вот что у нас в планах.
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-primary-telegram to-primary-electric"></div>
          
          <div className="space-y-20">
            {quarters.map((quarter, index) => (
              <motion.div 
                key={quarter.id}
                className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <div className={`${index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'} lg:w-1/2`}>
                  <div className="glass rounded-2xl p-8 border border-border/50">
                    <div className="flex items-center mb-6">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${getStatusColor(quarter.status)} bg-opacity-20`}>
                        {getStatusIcon(quarter.status)}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-text-primary">{quarter.label}</h3>
                        <span className="text-text-secondary capitalize">{quarter.status.replace('-', ' ')}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {quarter.features.map((feature) => (
                        <div key={feature.id} className="flex items-start p-4 bg-bg-tertiary/50 rounded-xl hover:bg-bg-tertiary transition-colors">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-4 mt-1 ${getStatusColor(quarter.status)} bg-opacity-20`}>
                            {getStatusIcon(quarter.status)}
                          </div>
                          <div>
                            <h4 className="font-medium text-text-primary">{feature.title}</h4>
                            <p className="text-text-secondary text-sm">{feature.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className={`${index % 2 === 0 ? 'lg:order-1' : 'lg:order-2'} lg:w-1/2 flex justify-center`}>
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-primary-telegram flex items-center justify-center text-white font-bold text-lg z-10">
                      {quarter.label}
                    </div>
                    <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full ${getStatusColor(quarter.status)} opacity-20`}></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Feature Voting Teaser */}
        <motion.div 
          className="mt-20 bg-gradient-to-r from-primary-mint/10 to-primary-neon/10 rounded-2xl p-8 border border-border/50 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <div className="flex items-center justify-center mb-4">
            <div className="text-2xl mr-2">💡</div>
            <h3 className="text-xl font-bold text-text-primary">Хотите повлиять на roadmap?</h3>
          </div>
          <button className="px-6 py-3 bg-primary-telegram text-white rounded-lg font-medium hover:bg-primary-electric transition-colors">
            Голосовать за функции
          </button>
        </motion.div>

        {/* Newsletter Signup */}
        <motion.div 
          className="mt-12 bg-bg-tertiary rounded-2xl p-8 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-xl font-bold text-text-primary mb-4">Получайте обновления о новых функциях</h3>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Ваш email" 
              className="flex-1 px-4 py-3 rounded-lg border border-border bg-bg-primary focus:outline-none focus:ring-2 focus:ring-primary-telegram"
            />
            <button className="px-6 py-3 bg-gradient-to-r from-primary-telegram to-primary-electric text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
              Подписаться
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default RoadmapSection;