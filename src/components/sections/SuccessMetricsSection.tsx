import React from 'react';
import { motion } from 'framer-motion';
import CountUp from '../common/CountUp';
import { Users, TrendingUp, Clock, Star } from 'lucide-react';

const SuccessMetricsSection: React.FC = () => {
  const metrics = [
    {
      icon: <Users className="w-8 h-8" />,
      value: 500,
      suffix: "+",
      label: "Довольных клиентов",
      description: "Малые бизнесы уже используют AIBRO"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      value: 70,
      suffix: "%",
      label: "Экономия времени",
      description: "В среднем экономят 40 часов в неделю"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      value: 72,
      suffix: "ч",
      label: "Быстрый запуск",
      description: "Прототип за 3 дня без рисков"
    },
    {
      icon: <Star className="w-8 h-8" />,
      value: 4.8,
      label: "Рейтинг",
      description: "Средний рейтинг среди клиентов"
    }
  ];

  const testimonials = [
    {
      name: "Анна Петрова",
      business: "Салон красоты 'Шикар'",
      text: "С AIBRO мы увеличили бронирования на 40% за 2 месяца. Теперь я могу уделять больше времени клиентам, а не администрированию.",
      avatar: "/images/тимлид3.jpg"
    },
    {
      name: "Михаил Сидоров",
      business: "Кафе 'Уголок'",
      text: "AI PostMaster создает контент лучше, чем наш SMM-менеджер. Экономим 30,000 ₽ в месяц на зарплате специалиста.",
      avatar: "/images/Тимлид.jpg"
    }
  ];

  return (
    <section id="success-metrics" className="py-20 bg-gradient-to-b from-white to-bg-secondary">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            Социальное доказательство
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Тысячи малых бизнесов уже автоматизируют свои процессы с AIBRO
          </p>
        </motion.div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="w-14 h-14 bg-primary-electric/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary-electric">
                {metric.icon}
              </div>
              <div className="text-4xl font-bold text-primary-coral mb-2">
                <CountUp end={metric.value} suffix={metric.suffix} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-text-primary">{metric.label}</h3>
              <p className="text-text-secondary">{metric.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-center mb-6">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name} 
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-bold text-text-primary">{testimonial.name}</h4>
                  <p className="text-text-secondary">{testimonial.business}</p>
                </div>
              </div>
              <p className="text-text-secondary italic">"{testimonial.text}"</p>
              <div className="flex mt-4 text-primary-gold">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuccessMetricsSection;