import React, { useState } from 'react';
import { motion } from 'framer-motion';
import CountUp from '../common/CountUp';
import { Users, MessageSquare, Clock, Star, ChevronLeft, ChevronRight } from 'lucide-react';

const SuccessMetricsSection: React.FC = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  
  const metrics = [
    {
      icon: <Users className="w-8 h-8" />,
      value: 500,
      suffix: "+",
      label: "бизнесов",
      description: "уже автоматизировали свой бизнес"
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      value: 50000,
      suffix: "+",
      label: "постов создано",
      description: "с помощью AI PostMaster"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      value: 40,
      suffix: "+",
      label: "часов сэкономлено",
      description: "ежемесячно нашими клиентами"
    },
    {
      icon: <Star className="w-8 h-8" />,
      value: 4.8,
      label: "рейтинг",
      description: "среди наших клиентов"
    }
  ];

  const testimonials = [
    {
      id: 1,
      avatar: "/images/тимлид3.jpg",
      name: "Дмитрий Иванов",
      business: "@TastyBitesRest",
      industry: "Ресторан, Санкт-Петербург",
      subscribers: 3500,
      quote: "Booking Bot уменьшил no-show на 30%. Теперь столики всегда заполнены.",
      result: "↑ 30% загрузка",
      rating: 5
    },
    {
      id: 2,
      avatar: "/images/Тимлид.jpg",
      name: "Анна Петрова",
      business: "@BeautySalonMoscow",
      industry: "Салон красоты, Москва",
      subscribers: 1200,
      quote: "AI PostMaster сэкономил мне 20 часов в неделю. Контент стал лучше, вовлечённость выросла на 35%.",
      result: "↓ 20ч/неделю",
      rating: 5
    },
    {
      id: 3,
      avatar: "/images/тимлид3.jpg",
      name: "Сергей Ковалёв",
      business: "@FitLifeStudio",
      industry: "Фитнес, Казань",
      subscribers: 5800,
      quote: "Conversation Bot отвечает на 80% вопросов. Моя команда фокусируется на клиентах.",
      result: "↑ 80% автоответов",
      rating: 5
    },
    {
      id: 4,
      avatar: "/images/Тимлид.jpg",
      name: "Елена Смирнова",
      business: "@TechShopKrasnodar",
      industry: "Электроника, Краснодар",
      subscribers: 2100,
      quote: "Video Inventory Agent сократил время инвентаризации с 4 часов до 20 минут.",
      result: "↓ 92% время",
      rating: 5
    },
    {
      id: 5,
      avatar: "/images/тимлид3.jpg",
      name: "Максим Соколов",
      business: "@CoffeeCornerEkb",
      industry: "Кофейня, Екатеринбург",
      subscribers: 800,
      quote: "Feedback Bot помог собрать 200+ отзывов. Рейтинг вырос с 4.2 до 4.8.",
      result: "↑ 4.8★ рейтинг",
      rating: 5
    },
    {
      id: 6,
      avatar: "/images/Тимлид.jpg",
      name: "Игорь Волков",
      business: "@SharpCutsBarber",
      industry: "Барбершоп, Нижний Новгород",
      subscribers: 1500,
      quote: "AIBRO Business окупился за первый месяц. Больше не ищу SMM-менеджера.",
      result: "↓ 58K₽/мес",
      rating: 5
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  return (
    <section id="success-metrics" className="py-20 bg-gradient-to-b from-bg-primary to-bg-secondary">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 gradient-text">
            Они уже автоматизировали свой бизнес
          </h2>
          <p className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto">
            Реальные результаты от реальных бизнесов
          </p>
        </motion.div>

        {/* Metrics Bar */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {metrics.map((metric, index) => (
            <div 
              key={index}
              className="glass rounded-2xl p-6 text-center border border-border/50"
            >
              <div className="flex justify-center mb-4 text-primary-telegram">
                {metric.icon}
              </div>
              <div className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
                <CountUp end={metric.value} suffix={metric.suffix} />
              </div>
              <h3 className="font-medium text-text-primary">{metric.label}</h3>
              <p className="text-text-secondary text-sm mt-2">{metric.description}</p>
            </div>
          ))}
        </motion.div>

        {/* Testimonials Carousel */}
        <motion.div 
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="relative max-w-4xl mx-auto">
            <div className="glass rounded-3xl p-8 border border-border/50">
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-2/3 md:pl-8">
                  <div className="text-2xl mb-4 text-center md:text-left text-text-secondary italic">
                    "{testimonials[currentTestimonial].quote}"
                  </div>
                  <div className="text-center md:text-left">
                    <div className="font-bold text-lg text-text-primary">{testimonials[currentTestimonial].name}</div>
                    <div className="text-text-secondary">{testimonials[currentTestimonial].business}</div>
                    <div className="text-sm text-text-tertiary mt-1">
                      {testimonials[currentTestimonial].industry} | {testimonials[currentTestimonial].subscribers} подписчиков
                    </div>
                    <div className="flex items-center justify-center md:justify-start mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-5 h-5 ${i < testimonials[currentTestimonial].rating ? 'text-primary-telegram fill-current' : 'text-text-tertiary'}`} 
                        />
                      ))}
                      <span className="ml-2 bg-primary-mint/20 text-primary-mint text-xs font-medium px-2 py-1 rounded-full">
                        {testimonials[currentTestimonial].result}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Navigation arrows */}
            <button 
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg text-text-primary hover:bg-white transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg text-text-primary hover:bg-white transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            
            {/* Dots navigation */}
            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentTestimonial(idx)}
                  className={`w-3 h-3 rounded-full ${
                    idx === currentTestimonial ? 'bg-primary-telegram' : 'bg-border'
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Partners/Logos Marquee */}
        <motion.div 
          className="py-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="text-center mb-8">
            <p className="text-text-secondary font-medium">Нам доверяют:</p>
          </div>
          <div className="flex animate-marquee whitespace-nowrap overflow-hidden">
            <div className="flex items-center justify-around w-full">
              {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map((item, idx) => (
                <div key={idx} className="mx-8 opacity-60 hover:opacity-100 transition-opacity">
                  <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center">
                    <span className="text-text-primary font-bold">{item}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SuccessMetricsSection;