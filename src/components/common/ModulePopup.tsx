import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModulePopupProps {
  isOpen: boolean;
  onClose: () => void;
  moduleId: string;
  moduleName: string;
  moduleIcon: string;
  tagline: string;
  price: string;
  status: string;
}

const ModulePopup: React.FC<ModulePopupProps> = ({ 
  isOpen, 
  onClose, 
  moduleId, 
  moduleName, 
  moduleIcon, 
  tagline, 
  price, 
  status 
}) => {
  const [activeTab, setActiveTab] = useState<'keyBenefits' | 'howItWorks' | 'useCases'>('keyBenefits');

  if (!isOpen) return null;

  // Определяем содержимое для каждого модуля
  const moduleData: Record<string, any> = {
    'conversation-bot': {
      keyBenefits: [
        {
          title: "Непрерывная поддержка",
          description: "Ваши клиенты всегда получат ответ, даже в нерабочее время, что повышает лояльность и доступность сервиса."
        },
        {
          title: "Экономия ресурсов",
          description: "Автоматизация рутинных запросов сокращает нагрузку на живых операторов до 70%, позволяя им сосредоточиться на сложных задачах."
        },
        {
          title: "Персонализация",
          description: "AI запоминает историю обращений каждого клиента, предлагая релевантные решения и создавая ощущение индивидуального подхода."
        }
      ],
      howItWorks: [
        "Интеграция: Бот легко интегрируется в Telegram, а также в другие популярные мессенджеры и корпоративные чаты, где работают ваши клиенты и сотрудники.",
        "NLP-анализ запросов: Использует передовые модели обработки естественного языка (NLP) для глубокого понимания контекста и намерений пользователя в каждом сообщении.",
        "База знаний: Подключите свою базу знаний (FAQ, документация, спецификации продуктов, корпоративные правила), и бот будет мгновенно извлекать из нее нужную информацию для ответов.",
        "Квалификация лидов: Задает уточняющие вопросы для определения потребностей клиента, его бюджета и готовности к покупке, 'подогревая' лида для менеджера по продажам.",
        "Бесшовная передача: В случае сложных, нестандартных запросов или по требованию клиента, бот аккуратно передает диалог живому специалисту, предоставляя ему полную историю переписки и контекст проблемы."
      ],
      useCases: [
        "Автоматические ответы на часто задаваемые вопросы по продуктам, услугам, условиям доставки и оплаты.",
        "Сбор первичных данных и квалификация потенциальных клиентов перед передачей их менеджерам по продажам.",
        "Предоставление актуальных статусов заказов или информации о наличии товаров.",
        "Первая линия технической поддержки для решения типовых проблем и консультаций.",
        "Обслуживание клиентов в нерабочие часы и выходные дни."
      ]
    },
    'booking-bot': {
      keyBenefits: [
        {
          title: "Полная автоматизация",
          description: "Исключите ручную обработку звонков и сообщений по записи, освободив время сотрудников."
        },
        {
          title: "Снижение 'неявок'",
          description: "Автоматические напоминания о предстоящих встречах значительно сокращают количество пропущенных бронирований."
        },
        {
          title: "Увеличение заполняемости",
          description: "Удобный и интуитивно понятный процесс бронирования, доступный 24/7, стимулирует клиентов к записи."
        }
      ],
      howItWorks: [
        "Интеграция с календарями: Синхронизация с популярными календарными сервисами (Google Calendar, Outlook Calendar, Apple Calendar) и CRM-системами для актуального отображения свободных слотов.",
        "Интуитивный интерфейс: Клиенты взаимодействуют с ботом напрямую в Telegram, проходя простой пошаговый процесс выбора услуги, специалиста и удобного времени.",
        "Гибкое расписание: Возможность настройки различных графиков работы, перерывов, выходных дней и праздников для каждого специалиста или ресурса.",
        "Автоматические напоминания: Бот отправляет персонализированные напоминания клиентам за заранее установленное время (например, за 24 часа и за 1 час до встречи) для подтверждения записи.",
        "Самостоятельное управление записью: Клиенты могут легко перенести или отменить свою запись через бота, без необходимости звонить или писать, что удобно для обеих сторон."
      ],
      useCases: [
        "Запись клиентов в салоны красоты, барбершопы, СПА-салоны, фитнес-центры.",
        "Бронирование столиков в ресторанах, мест в коворкингах, аренда оборудования.",
        "Запись на индивидуальные консультации к врачам, юристам, психологам, репетиторам.",
        "Планирование встреч с менеджерами по продажам или демонстраций продуктов.",
        "Автоматическая организация вебинаров, мастер-классов и групповых занятий."
      ]
    },
    'feedback-bot': {
      keyBenefits: [
        {
          title: "Улучшение сервиса",
          description: "Быстро выявляйте слабые места в вашем бизнесе и оперативно реагируйте на негативные отзывы."
        },
        {
          title: "Рост репутации",
          description: "Автоматически собирайте позитивные отзывы и стимулируйте их публикацию на внешних площадках."
        },
        {
          title: "Глубокая аналитика",
          description: "Получайте агрегированные отчеты NPS (Net Promoter Score) и анализ настроений клиентов в автоматическом режиме."
        }
      ],
      howItWorks: [
        "Автоматические триггеры: Бот автоматически отправляет запросы на обратную связь после заранее определенных событий (например, завершения заказа, визита, окончания проекта, истечения гарантии).",
        "Гибкие сценарии опросов: Настройте цепочки сообщений в зависимости от оценки клиента. Для низкой оценки бот деликатно выяснит причины, для высокой — предложит оставить отзыв на публичных платформах.",
        "Сбор развернутых отзывов: Помимо числовых оценок, бот может собирать текстовые комментарии, фотографии и видео, предоставляя полную картину клиентского опыта.",
        "Управление негативом: При получении отрицательной оценки бот может автоматически инициировать связь с менеджером для оперативного решения проблемы, предотвращая публичный негатив.",
        "Репутационный менеджмент: Помогает направлять довольных клиентов на площадки, важные для вашей репутации (Google My Business, Яндекс.Карты, профильные отзовики)."
      ],
      useCases: [
        "Оценка качества обслуживания в розничных магазинах, кафе, ресторанах, отелях.",
        "Сбор обратной связи после завершения онлайн-курсов, тренингов, вебинаров.",
        "Мониторинг удовлетворенности клиентов в сервисных центрах, автосервисах.",
        "Постоянный сбор мнений о новых продуктах или функциях.",
        "Управление репутацией на всех ключевых онлайн-площадках."
      ]
    },
    'video-inventory': {
      keyBenefits: [
        {
          title: "Снижение ошибок",
          description: "Минимизация человеческого фактора и повышение точности учета запасов."
        },
        {
          title: "Оптимизация запасов",
          description: "Точное знание остатков и сроков годности предотвращает потери и излишки."
        },
        {
          title: "Экономия времени",
          description: "Автоматизация рутинных и трудоемких задач инвентаризации."
        }
      ],
      howItWorks: [
        "Компьютерное зрение: Использует передовые алгоритмы машинного зрения для анализа видеопотока с обычных камер (смартфон, стационарные IP-камеры).",
        "Автоматическое распознавание: AI способен распознавать товары по их внешнему виду, штрих-кодам, QR-кодам, логотипам и даже форме упаковки.",
        "OCR сроков годности: Специализированный модуль оптического распознавания символов (OCR) считывает даты производства и истечения срока годности на упаковках товаров.",
        "Синхронизация с ERP/WMS: Полученные данные о количестве и статусе товаров автоматически синхронизируются с вашей системой учета запасов (ERP, WMS, 1С), обеспечивая актуальность информации.",
        "Прогноз и автозаказ: На основе анализа текущих остатков, скорости продаж и сроков годности, AI может генерировать рекомендации по пополнению запасов или автоматически формировать черновики заказов поставщикам."
      ],
      useCases: [
        "Быстрая и точная инвентаризация товаров на складах, в розничных магазинах, аптеках.",
        "Контроль свежести продуктов в супермаркетах, ресторанах, кафе.",
        "Учет оборудования, инструментария и комплектующих на производстве или в арендных компаниях.",
        "Мониторинг наличия товаров на полках магазинов для предотвращения пустых мест.",
        "Автоматизированный контроль качества поступлений товаров."
      ]
    }
  };

  const data = moduleData[moduleId] || {
    keyBenefits: [],
    howItWorks: [],
    useCases: []
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'keyBenefits':
        return (
          <div className="space-y-3">
            {data.keyBenefits.map((benefit: any, index: number) => (
              <div key={index} className="p-3 bg-bg-tertiary/50 rounded-lg">
                <h4 className="font-semibold text-text-primary mb-1 text-sm sm:text-base">{benefit.title}</h4>
                <p className="text-text-secondary text-xs sm:text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        );
      case 'howItWorks':
        return (
          <div className="space-y-2">
            {data.howItWorks.map((step: string, index: number) => (
              <div key={index} className="flex">
                <div className="flex-shrink-0 mt-1 mr-2 w-5 h-5 rounded-full bg-primary-telegram/20 flex items-center justify-center">
                  <span className="text-primary-telegram text-xs">{index + 1}</span>
                </div>
                <p className="text-text-secondary text-xs sm:text-sm">{step}</p>
              </div>
            ))}
          </div>
        );
      case 'useCases':
        return (
          <ul className="space-y-1">
            {data.useCases.map((useCase: string, index: number) => (
              <li key={index} className="flex items-start">
                <span className="text-primary-telegram mr-1 text-sm">•</span>
                <span className="text-text-secondary text-xs sm:text-sm">{useCase}</span>
              </li>
            ))}
          </ul>
        );
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-primary/90 backdrop-blur-[80px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-y-auto bg-bg-primary rounded-2xl sm:rounded-3xl shadow-2xl border border-border"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            style={{ maxHeight: '90vh' }}
          >
            <div className="p-4 sm:p-6">
              {/* Заголовок попапа с кнопкой закрытия в правом верхнем углу */}
              <div className="relative">
                <button 
                  onClick={onClose}
                  className="absolute top-2 right-2 sm:top-2 sm:right-3 text-text-secondary hover:text-text-primary z-10 p-1"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                
                <div className="flex flex-col sm:flex-row justify-between items-start mb-4 sm:mb-6 pt-4 sm:pt-0">
                  <div className="flex flex-col sm:flex-row items-center text-center sm:text-left mb-2 sm:mb-0">
                    <span className="text-2xl sm:text-3xl mr-0 sm:mr-3 mb-1 sm:mb-0">{moduleIcon}</span>
                    <div>
                      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-text-primary">
                        {moduleName}
                      </h2>
                      <p className="text-text-secondary text-xs sm:text-sm md:text-base">{tagline}</p>
                    </div>
                  </div>
                  <div className="text-center sm:text-right mt-1 sm:mt-0">
                    <div className="text-primary-telegram font-bold text-base sm:text-lg">{price}</div>
                    <div className="text-text-secondary text-xs sm:text-sm">{status}</div>
                  </div>
                </div>
              </div>

              {/* Вкладки */}
              <div className="flex flex-wrap justify-center border-b border-border mb-3 sm:mb-4 overflow-x-auto pb-1">
                <button
                  className={`px-2 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                    activeTab === 'keyBenefits'
                      ? 'text-primary-telegram border-b-2 border-primary-telegram'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                  onClick={() => setActiveTab('keyBenefits')}
                >
                  Ключевые преимущества
                </button>
                <button
                  className={`px-2 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                    activeTab === 'howItWorks'
                      ? 'text-primary-telegram border-b-2 border-primary-telegram'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                  onClick={() => setActiveTab('howItWorks')}
                >
                  Как это работает
                </button>
                <button
                  className={`px-2 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                    activeTab === 'useCases'
                      ? 'text-primary-telegram border-b-2 border-primary-telegram'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                  onClick={() => setActiveTab('useCases')}
                >
                  Сценарии использования
                </button>
              </div>

              {/* Контент вкладок */}
              <div className="mb-4 sm:mb-6 max-h-[50vh] overflow-y-auto pr-2">
                {renderContent()}
              </div>

              {/* Кнопка CTA внизу */}
              <div className="sticky bottom-0 bg-bg-primary pt-3 sm:pt-4 border-t border-border">
                <button 
                  onClick={() => {
                    onClose();
                    // Плавный скролл к секции контактов
                    const element = document.getElementById('contact');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="w-full py-2 sm:py-3 bg-gradient-to-r from-primary-telegram to-primary-electric text-white rounded-lg font-bold hover:opacity-90 transition-opacity text-sm sm:text-base"
                >
                  Оставить заявку на ранний доступ
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModulePopup;