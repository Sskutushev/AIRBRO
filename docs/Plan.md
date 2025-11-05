ПОЛНЫЙ ПЛАН РЕФАКТОРИНГА LANDING PAGE ДЛЯ AIBRO BUSINESS
🎯 ОБЩАЯ КОНЦЕПЦИЯ
Философия дизайна
"AI-driven Future Meets Human Touch" - Футуристичный, но теплый и доверительный дизайн, который говорит: "Мы используем передовые технологии, но всегда на стороне человека".
Ключевые послания

Telegram-нативность - "Всё, что нужно вашему бизнесу, в одном мессенджере"
Модульность - "Начните с малого, растите вместе с нами"
AI-персонализация - "Чем дольше вы с нами, тем умнее становится ваш AI"
Прозрачность - "Никаких скрытых платежей. Только честная подписка"

📋 СТРУКТУРА НОВОГО LANDING PAGE
Секции (по порядку)

Header/Navigation - Фиксированная навигация
Hero Section - Главный экран с wow-эффектом
Problem Section - Проблемы МСБ (3-4 карточки)
Solution Section - Почему AIBRO Business (наши отличия)
Products Showcase - Tier 1 + Tier 2 продукты
How It Works - 3 шага к автоматизации
Pricing & Packages - Tier 3 вертикальные пакеты
Success Metrics - Социальное доказательство
Roadmap - Что дальше (будущие продукты)
FAQ - Ответы на вопросы
CTA Section - Форма + кнопка в Telegram
Footer - Контакты, соцсети, политики

🎨 ДИЗАЙН-СИСТЕМА
Цветовая палитра
javascriptcolors: {
// Primary Brand Colors
primary: {
telegram: '#0088cc', // Telegram blue
electric: '#00D9FF', // Electric cyan
neon: '#7B2FFF', // Neon purple
mint: '#00FFA3', // Mint green
},

// Accent Colors
accent: {
coral: '#FF6B6B', // Warm coral (для CTA)
gold: '#FFD93D', // Golden yellow (для premium)
violet: '#A855F7', // Deep violet (для features)
},

// Neutrals
neutral: {
900: '#0F172A', // Dark navy (текст)
800: '#1E293B',
700: '#334155',
100: '#F1F5F9', // Light background
50: '#F8FAFC', // Ultra light
},

// Semantic
success: '#10B981',
warning: '#F59E0B',
error: '#EF4444',
info: '#3B82F6',
}
Типографика
javascriptfonts: {
heading: "'Inter', 'SF Pro Display', -apple-system, sans-serif",
body: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
mono: "'Fira Code', 'JetBrains Mono', monospace",
},

fontSize: {
// Desktop
'hero-xl': '4.5rem', // 72px - Main hero
'hero-lg': '3.5rem', // 56px - Section headers
'display': '2.5rem', // 40px - Sub-headers
'heading': '2rem', // 32px - Card headers
'subheading': '1.5rem', // 24px - Sub-headers
'body-lg': '1.125rem', // 18px - Large body
'body': '1rem', // 16px - Default body
'body-sm': '0.875rem', // 14px - Small text
'caption': '0.75rem', // 12px - Captions

// Mobile (responsive)
'mobile-hero': '2.5rem',
'mobile-display': '1.875rem',
'mobile-heading': '1.5rem',
}
Анимации и эффекты
javascript// Framer Motion Variants
animations: {
// Fade In Up
fadeInUp: {
hidden: { opacity: 0, y: 60 },
visible: {
opacity: 1,
y: 0,
transition: { duration: 0.6, ease: 'easeOut' }
}
},

// Scale In
scaleIn: {
hidden: { opacity: 0, scale: 0.8 },
visible: {
opacity: 1,
scale: 1,
transition: { duration: 0.5, ease: 'backOut' }
}
},

// Slide In From Left
slideInLeft: {
hidden: { opacity: 0, x: -100 },
visible: {
opacity: 1,
x: 0,
transition: { duration: 0.7, ease: 'easeOut' }
}
},

// Floating Animation (для 3D элементов)
floating: {
animate: {
y: [0, -20, 0],
rotate: [0, 5, 0, -5, 0],
transition: {
duration: 6,
repeat: Infinity,
ease: 'easeInOut'
}
}
},

// Gradient Shift (для фонов)
gradientShift: {
animate: {
backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
transition: {
duration: 15,
repeat: Infinity,
ease: 'linear'
}
}
},

// Glow Pulse (для кнопок)
glowPulse: {
animate: {
boxShadow: [
'0 0 20px rgba(0, 136, 204, 0.5)',
'0 0 40px rgba(0, 136, 204, 0.8)',
'0 0 20px rgba(0, 136, 204, 0.5)',
],
transition: {
duration: 2,
repeat: Infinity,
ease: 'easeInOut'
}
}
}
}

// CSS Custom Properties для анимаций
@keyframes gradient-x {
0%, 100% { background-position: 0% 50%; }
50% { background-position: 100% 50%; }
}

@keyframes shimmer {
0% { transform: translateX(-100%); }
100% { transform: translateX(100%); }
}

@keyframes float {
0%, 100% { transform: translateY(0) rotate(0deg); }
50% { transform: translateY(-20px) rotate(5deg); }
}
3D и визуальные эффекты
javascript// Three.js элементы
3DElements: {
// Hero Section - Вращающийся абстрактный 3D объект
heroObject: {
type: 'TorusKnot', // или abstract mesh
material: 'MeshPhysicalMaterial',
color: 'gradient(#0088cc, #00D9FF, #7B2FFF)',
animation: 'rotate + float',
lighting: 'dramatic with rim lights',
},

// Product Cards - 3D иконки при hover
productIcons: {
type: 'Animated 3D Icons',
interaction: 'Rotate on mouse move',
effect: 'Depth shadow',
},

// Background Particles
particles: {
type: 'Interactive particles',
behavior: 'Mouse-follow',
color: 'primary.telegram with opacity',
count: 100,
}
}

// Glassmorphism эффекты
glassmorphism: {
background: 'rgba(255, 255, 255, 0.1)',
backdropFilter: 'blur(20px) saturate(180%)',
border: '1px solid rgba(255, 255, 255, 0.2)',
boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
}

// Neumorphism для карточек (светлая тема)
neumorphism: {
background: '#f0f0f0',
boxShadow: `    8px 8px 16px rgba(163, 177, 198, 0.6),
    -8px -8px 16px rgba(255, 255, 255, 0.5)
 `,
}

// Gradient meshes (фоны секций)
gradientMeshes: {
hero: 'radial-gradient(circle at 20% 50%, rgba(0, 136, 204, 0.3), transparent 50%),
radial-gradient(circle at 80% 80%, rgba(123, 47, 255, 0.3), transparent 50%),
radial-gradient(circle at 40% 20%, rgba(0, 255, 163, 0.2), transparent 50%)',

cta: 'linear-gradient(135deg, #0088cc 0%, #7B2FFF 50%, #FF6B6B 100%)',
}

```

---

## 🏗️ ДЕТАЛЬНАЯ РАЗБИВКА СЕКЦИЙ

### 1. HEADER/NAVIGATION

**Цель**: Простая навигация + призыв к действию

**Структура**:
```

[LOGO: AIBRO Business] [Навигация: Продукты | Цены | Кейсы | FAQ] [Language Switcher] [Theme Toggle] [CTA Button: Начать бесплатно]
Дизайн:

Фиксированный header с blur-эффектом при скролле
Анимированное появление (slide down)
Активное состояние для текущей секции
Мобильное меню (hamburger) с плавным выдвижением

Элементы:

Логотип: Текст "AIBRO" + иконка (абстрактный AI мозг или Telegram-стилизация)
Desktop nav: horizontal меню
Mobile nav: slide-in drawer
CTA button: Градиентная кнопка с glow-эффектом
Language: RU/EN флаги-иконки
Theme: Sun/Moon иконка

Компоненты:
tsx<Header>
<Logo />
<Navigation items={navItems} />
<HeaderActions>
<LanguageSwitcher />
<ThemeToggle />
<Button variant="gradient-cta">Начать бесплатно</Button>
</HeaderActions>

</Header>
```

---

### 2. HERO SECTION

**Цель**: Мгновенно захватить внимание + четкое value proposition

**Заголовок (H1)**:

```
RU: "AI-автоматизация бизнеса прямо в Telegram"
EN: "AI Business Automation. Native in Telegram."
```

**Подзаголовок (H2)**:

```
RU: "Один мессенджер. Полная экосистема AI-инструментов. Начните с 3,000₽/месяц."
EN: "One messenger. Complete AI ecosystem. Start at $30/month."
```

**CTA Buttons**:

1. Primary: "Попробовать бесплатно 7 дней" → Form/TG Bot
2. Secondary: "Посмотреть демо" → Scroll to Products

**Визуальные элементы**:

- **3D Hero Object**: Вращающийся абстрактный объект (символизирует AI + Telegram)

  - Материал: Holographic/iridescent
  - Анимация: Медленное вращение + float
  - Интерактивность: Реагирует на движение мыши
  - Цвета: Градиент primary.telegram → primary.electric → primary.neon

- **Animated Background**:

  - Gradient mesh с медленным shifting
  - Floating particles (Telegram-logo-shaped)
  - Тонкая grid overlay (cyber-эффект)

- **Stats Bar** (под CTA):

```
  [500+ бизнесов] [50K+ постов создано] [4.8★ рейтинг]
```

- CountUp анимация при загрузке
- Иконки: Company icon, Post icon, Star icon

**Layout**:

```
Desktop: 50/50 split (текст слева, 3D справа)
Tablet: 60/40 split
Mobile: Stack (текст сверху, 3D под кнопками)
Scroll Indicator:

Анимированная стрелка вниз (bounce)
Текст: "Прокрутите вниз"
Исчезает после первого скролла

Компоненты:
tsx<HeroSection>
  <HeroContent>
    <Badge>🚀 Новинка: AI PostMaster теперь с Imagen 4</Badge>
    <Heading size="hero-xl" gradient>
      AI-автоматизация бизнеса прямо в Telegram
    </Heading>
    <Subheading size="display">
      Один мессенджер. Полная экосистема AI-инструментов.
    </Subheading>
    <CTAButtons>
      <Button size="xl" variant="gradient-primary" glow>
        Попробовать бесплатно 7 дней
      </Button>
      <Button size="xl" variant="ghost">
        Посмотреть демо →
      </Button>
    </CTAButtons>
    <StatsBar>
      <Stat icon={<Company />} value="500+" label="бизнесов" />
      <Stat icon={<Post />} value="50K+" label="постов" />
      <Stat icon={<Star />} value="4.8" label="рейтинг" />
    </StatsBar>
  </HeroContent>

  <HeroVisual>
    <ThreeJSScene>
      <HeroObject3D />
      <ParticleSystem />
    </ThreeJSScene>
  </HeroVisual>

  <ScrollIndicator />
</HeroSection>
```

---

### 3. PROBLEM SECTION

**Цель**: Показать боли целевой аудитории (владельцы МСБ)

**Заголовок**:

```
RU: "Знакомая боль?"
EN: "Sound Familiar?"
```

**Подзаголовок**:

```
RU: "Малый бизнес тратит слишком много на задачи, которые AI решает за минуты"
EN: "Small businesses overspend on tasks AI solves in minutes"
```

**Проблемы** (4 карточки):

**1. Дорогие специалисты**

- Иконка: 💰 (3D анимированная)
- Заголовок: "SMM-менеджер: 58,000₽/месяц"
- Описание: "Нужен контент каждый день. Нанять дорого, делать самому — нет времени."
- Stat: "58K₽/мес на одного человека"
- Цвет акцента: accent.coral

**2. Ручное общение с клиентами**

- Иконка: 💬 (3D анимированная)
- Заголовок: "3-5 часов/день на ответы"
- Описание: "Одни и те же вопросы. Пропущенные сообщения = потерянные клиенты."
- Stat: "40+ часов/месяц впустую"
- Цвет акцента: primary.electric

**3. Хаос с бронированиями**

- Иконка: 📅 (3D анимированная)
- Заголовок: "Пропущенные звонки = потерянные заказы"
- Описание: "Ручное управление календарём. No-show клиенты. Потерянная прибыль."
- Stat: "20% пропущенных бронирований"
- Цвет акцента: primary.neon

**4. Нет времени на анализ**

- Иконка: 📊 (3D анимированная)
- Заголовок: "Работаете вслепую"
- Описание: "Не знаете, что работает. Нет данных для решений."
- Stat: "95% МСБ не используют аналитику"
- Цвет акцента: primary.mint

**Дизайн карточек**:

- Glassmorphism эффект
- Hover: Поднимается + усиливается glow
- 3D иконка вращается при hover
- Gradient border (соответствует цвету акцента)
- Particle trail при hover

**Layout**:

```
Desktop: 2x2 grid с gap
Tablet: 2 колонки
Mobile: 1 колонка, stack
Анимация появления:

Stagger (0.15s delay между карточками)
Fade in + scale up
Иконки появляются с rotation

Компоненты:
tsx<ProblemSection>
  <SectionHeader>
    <Heading size="hero-lg" gradient>Знакомая боль?</Heading>
    <Subheading>
      Малый бизнес тратит слишком много на задачи, которые AI решает за минуты
    </Subheading>
  </SectionHeader>

  <ProblemsGrid>
    {problems.map((problem, index) => (
      <ProblemCard
        key={problem.id}
        icon={<Animated3DIcon icon={problem.icon} />}
        title={problem.title}
        description={problem.description}
        stat={problem.stat}
        accentColor={problem.color}
        animationDelay={index * 0.15}
      />
    ))}
  </ProblemsGrid>

  <TransitionElement>
    <AnimatedArrowDown />
    <Text>Но есть решение...</Text>
  </TransitionElement>
</ProblemSection>
```

---

### 4. SOLUTION SECTION

**Цель**: Показать почему AIBRO Business — правильный выбор

**Заголовок**:

```
RU: "AIBRO Business: Ваш AI-отдел в Telegram"
EN: "AIBRO Business: Your AI Department in Telegram"
```

**Подзаголовок**:

```
RU: "Не просто инструменты. Полная экосистема, которая растёт вместе с вами."
EN: "Not just tools. A complete ecosystem that grows with you."
```

**Ключевые преимущества** (3 колонки):

**1. Telegram-нативность 🚀**

- **Заголовок**: "Всё в одном приложении"
- **Описание**: "Не нужны отдельные приложения. Всё управление — в Telegram, где вы уже работаете."
- **Визуал**: Mockup Telegram интерфейса с AIBRO ботом
- **Highlights**:
  - ✓ Уведомления в реальном времени
  - ✓ Никакого переключения приложений
  - ✓ 98% открываемость (vs 20% у email)

**2. Модульная экосистема 🧩**

- **Заголовок**: "Начните с малого, растите вместе с нами"
- **Описание**: "Не платите за то, что не используете. Добавляйте модули по мере роста бизнеса."
- **Визуал**: Интерактивная диаграмма модулей (как конструктор LEGO)
- **Highlights**:
  - ✓ Низкий входной барьер (3,000₽/мес)
  - ✓ Естественные апсейлы
  - ✓ Никакого vendor lock-in

**3. AI, который изучает ваш бизнес 🧠**

- **Заголовок**: "Чем дольше — тем умнее"
- **Описание**: "Каждый клиент получает персональный AI Data Store. Знает ваши продукты, цены, стиль бренда."
- **Визуал**: Анимация "мозг учится" (нейронная сеть)
- **Highlights**:
  - ✓ RAG-based персонализация
  - ✓ Никаких шаблонов
  - ✓ Уникальный контент для вашего бизнеса

**Comparison Table** (AIBRO vs Альтернативы):

```
| Критерий              | Фрилансер SMM | Корп. ПО      | AIBRO Business |
|-----------------------|---------------|---------------|----------------|
| Стоимость/месяц       | 58,000₽       | 150,000₽+     | от 3,000₽      |
| Время на настройку    | 2-4 недели    | 3-6 месяцев   | 15 минут       |
| Персонализация        | Высокая       | Низкая        | AI-driven      |
| Надёжность            | Зависит       | Высокая       | SLA 99.9%      |
| Масштабируемость      | Нет           | Да            | Да             |
| Интеграция с Telegram | Нет           | Нет           | Нативная       |
Визуальный стиль:

Split layout: Текст слева, визуал справа (чередуется)
Animated comparison table (highlight разницы)
Interactive module builder (можно кликать на модули)

Компоненты:
tsx<SolutionSection>
  <SectionHeader>
    <Heading size="hero-lg" gradient>
      AIBRO Business: Ваш AI-отдел в Telegram
    </Heading>
    <Subheading>
      Не просто инструменты. Полная экосистема, которая растёт вместе с вами.
    </Subheading>
  </SectionHeader>

  <BenefitsGrid>
    {benefits.map((benefit, index) => (
      <BenefitColumn key={benefit.id} reverse={index % 2 === 1}>
        <BenefitContent>
          <Icon3D icon={benefit.icon} />
          <Title>{benefit.title}</Title>
          <Description>{benefit.description}</Description>
          <HighlightsList items={benefit.highlights} />
        </BenefitContent>
        <BenefitVisual>
          {benefit.visual}
        </BenefitVisual>
      </BenefitColumn>
    ))}
  </BenefitsGrid>

  <ComparisonTable>
    <TableHeader />
    <TableRows data={comparisonData} />
  </ComparisonTable>

  <CTABanner>
    <Text>Готовы начать?</Text>
    <Button variant="gradient-primary" size="lg">
      Попробовать бесплатно
    </Button>
  </CTABanner>
</SolutionSection>
```

---

### 5. PRODUCTS SHOWCASE

**Цель**: Представить Tier 1 (AI PostMaster) и Tier 2 продукты

**Заголовок**:

```
RU: "Познакомьтесь с экосистемой"
EN: "Meet the Ecosystem"
```

**Подзаголовок**:

```
RU: "От автоматизации контента до полного управления бизнесом"
EN: "From content automation to full business management"
```

**Структура**:

**Tier 1: Точка входа** (Featured Product Card - большая):

**AI PostMaster**

- **Tagline**: "Ваш AI SMM-менеджер за 3,000₽/месяц"
- **Описание**: "Автоматическое создание и публикация контента в Telegram-каналах. Gemini 2.0 Flash + Imagen 4 Fast."
- **Ключевые функции**:
  - 📝 Генерация текста (информационные, рекламные, мотивационные посты)
  - 🎨 Генерация изображений (512x512, моментально)
  - 📅 Умное планирование (AI подсказывает лучшее время)
  - 🤖 Персонализация (AI изучает ваш бренд)
- **Pricing**:
  - Starter: 3,000₽ (1 канал, 30 постов/мес)
  - Pro: 5,000₽ (неограниченные посты)
  - Business: 8,000₽ (3 канала)
- **CTA**: "Попробовать бесплатно 7 дней"
- **Визуал**: Mockup Telegram-канала с примерами постов + 3D иконка

**Tier 2: Дополнительные модули** (Grid из 4 карточек):

**1. Conversation Bot**

- Иконка: 💬 (3D)
- Tagline: "AI-сотрудник 24/7"
- Краткое описание: "Отвечает на вопросы, квалифицирует лиды, передаёт сложные случаи человеку."
- Цена: от 2,000₽/мес
- Status: 🟡 Coming Q2 2025
- CTA: "Узнать больше"

**2. Booking Bot**

- Иконка: 📅 (3D)
- Tagline: "Менеджер по бронированию"
- Краткое описание: "Автоматические записи, напоминания, управление календарём."
- Цена: от 2,500₽/мес
- Status: 🟡 Coming Q3 2025
- CTA: "Узнать больше"

**3. Feedback Bot**

- Иконка: ⭐ (3D)
- Tagline: "Превратите клиентов в промоутеров"
- Краткое описание: "Автосбор отзывов, управление репутацией, NPS-трекинг."
- Цена: от 1,500₽/мес
- Status: 🟡 Coming Q4 2025
- CTA: "Узнать больше"

**4. Video Inventory Agent**

- Иконка: 📹 (3D)
- Tagline: "Умный помощник по инвентарю"
- Краткое описание: "Видео-инвентаризация, OCR сроков годности, автозаказ."
- Цена: от 3,000₽/мес
- Status: 🔴 R&D, 2026
- CTA: "Узнать больше"

**Дизайн карточек**:

- **Featured Card (AI PostMaster)**:
  - Большая карточка (2x размер стандартной)
  - Gradient background (primary.telegram → primary.electric)
  - Animated mockup (видео-превью или lottie)
  - Badge "MOST POPULAR"
- **Tier 2 Cards**:
  - Glassmorphism
  - Hover: 3D tilt effect
  - Status badge (✅ Available / 🟡 Coming Soon / 🔴 R&D)
  - Animated icon (rotate on hover)

**Layout**:

```
Desktop:
  [Featured Card (2col)] [Tier2 Card] [Tier2 Card]
  [Tier2 Card]           [Tier2 Card]

Tablet:
  [Featured Card (full width)]
  [Tier2 Card] [Tier2 Card]
  [Tier2 Card] [Tier2 Card]

Mobile:
  [Featured Card]
  [Tier2 Card]
  [Tier2 Card]
  [Tier2 Card]
  [Tier2 Card]
Interactive Element:

"Калькулятор экономии": Пользователь выбирает продукты → видит, сколько сэкономит vs найма людей

Компоненты:
tsx<ProductsSection>
  <SectionHeader>
    <Heading size="hero-lg" gradient>Познакомьтесь с экосистемой</Heading>
    <Subheading>От автоматизации контента до полного управления бизнесом</Subheading>
  </SectionHeader>

  <ProductsLayout>
    <FeaturedProductCard
      product={aiPostMaster}
      badge="MOST POPULAR"
      mockup={<TelegramChannelMockup />}
    />

    <Tier2Grid>
      {tier2Products.map(product => (
        <ProductCard
          key={product.id}
          icon={<Animated3DIcon icon={product.icon} />}
          title={product.name}
          tagline={product.tagline}
          description={product.shortDesc}
          price={product.price}
          status={product.status}
          onLearnMore={() => openModal(product.id)}
        />
      ))}
    </Tier2Grid>
  </ProductsLayout>

  <SavingsCalculator />

  <CTABanner>
    <Text>Начните с AI PostMaster сегодня</Text>
    <Button variant="gradient-primary" size="lg">
      Попробовать бесплатно 7 дней
    </Button>
  </CTABanner>
</ProductsSection>

6. HOW IT WORKS
Цель: Показать простоту начала работы
Заголовок:
RU: "3 шага к автоматизации"
EN: "3 Steps to Automation"
Подзаголовок:
RU: "От регистрации до первого поста — 15 минут"
EN: "From signup to first post — 15 minutes"
Шаги (Timeline с анимацией):
Шаг 1: Регистрация в Telegram

Иконка: 📱 (3D анимированная)
Заголовок: "Найдите @AIBROBusinessBot"
Описание: "Просто напишите боту в Telegram. Никаких регистраций на сайтах."
Время: "1 минута"
Визуал: Screenshot/mockup Telegram чата с ботом
Анимация: Появление сообщений в чате

Шаг 2: Настройка под ваш бизнес

Иконка: ⚙️ (3D анимированная)
Заголовок: "Расскажите о своём бизнесе"
Описание: "Бот задаст несколько вопросов: название, ниша, продукты, стиль. AI создаст ваш персональный Data Store."
Время: "5 минут"
Визуал: Интерактивная форма в Telegram
Анимация: Заполнение полей → AI обрабатывает

Шаг 3: Первый пост

Иконка: 🚀 (3D анимированная)
Заголовок: "Создайте первый пост"
Описание: "Просто скажите боту тему. AI сгенерирует текст + изображение. Одобрите или отредактируйте. Готово!"
Время: "9 минут"
Визуал: Пост в Telegram-канале
Анимация: Генерация текста → появление изображения → публикация

Визуальный дизайн:

Timeline: Вертикальная линия (gradient) соединяет шаги
Каждый шаг:

Большой номер (01, 02, 03) с gradient fill
3D иконка с floating animation
Split layout: Описание слева, визуал справа (чередуется)
Animated mockup/screenshot
Time badge (floating chip)



Интерактивность:

Scroll-triggered animations (появление по очереди)
Hover на шаге → увеличивается + glow
Клик на визуал → открывается в fullscreen

Бонус элемент:
💡 Pro Tip: Хотите ещё быстрее? Используйте /quickstart команду
Компоненты:
tsx<HowItWorksSection>
  <SectionHeader>
    <Heading size="hero-lg" gradient>3 шага к автоматизации</Heading>
    <Subheading>От регистрации до первого поста — 15 минут</Subheading>
  </SectionHeader>

  <Timeline>
    {steps.map((step, index) => (
      <TimelineStep
        key={step.id}
        number={index + 1}
        icon={<Animated3DIcon icon={step.icon} />}
        title={step.title}
        description={step.description}
        duration={step.duration}
        visual={step.mockup}
        reverse={index % 2 === 1}
        animationDelay={index * 0.3}
      />
    ))}
  </Timeline>

  <ProTipBanner>
    <Icon>💡</Icon>
    <Text>Pro Tip: Хотите ещё быстрее? Используйте /quickstart команду</Text>
  </ProTipBanner>

  <CTAButtons>
    <Button variant="gradient-primary" size="xl">
      Начать сейчас
    </Button>
    <Button variant="ghost" size="xl">
      Посмотреть демо-видео
    </Button>
  </CTAButtons>
</HowItWorksSection>
```

---

### 7. PRICING & PACKAGES (Tier 3)

**Цель**: Показать вертикальные пакеты со скидками

**Заголовок**:

```
RU: "Готовые решения для вашей индустрии"
EN: "Industry-Ready Bundles"
```

**Подзаголовок**:

```
RU: "Сэкономьте до 17% с отраслевыми пакетами"
EN: "Save up to 17% with industry bundles"
```

**Вертикальные пакеты** (4 карточки с pricing):

**1. Restaurant Suite 🍽️**

- **Включает**:
  - AI PostMaster (меню дня, акции)
  - Booking Bot (резервирование столиков)
  - Feedback Bot (отзывы после ужина)
  - Video Inventory Agent (инвентаризация кухни)
- **Цена раздельно**: 11,500₽/мес
- **Цена пакета**: 9,900₽/мес
- **Экономия**: 1,600₽/мес (14%)
- **Бонусы**:
  - ✓ Menu Management (динамическое меню)
  - ✓ Table Optimization
  - ✓ Food Waste Tracking
- **Кому подходит**: Рестораны, кафе, кофейни (10-100 мест)

**2. Beauty & Wellness Suite 💇**

- **Включает**:
  - AI PostMaster (до/после, промо)
  - Booking Bot (записи на приём)
  - Feedback Bot (отзывы)
  - Conversation Bot (консультации)
- **Цена раздельно**: 11,500₽/мес
- **Цена пакета**: 9,500₽/мес
- **Экономия**: 2,000₽/мес (17%)
- **Бонусы**:
  - ✓ Stylist Profiles
  - ✓ Service Upselling
  - ✓ Loyalty Program
- **Кому подходит**: Салоны красоты, барбершопы, спа (2-10 специалистов)

**3. Fitness Suite 🏋️**

- **Включает**:
  - AI PostMaster (советы по тренировкам)
  - Booking Bot (записи на классы)
  - Feedback Bot (отзывы членов)
  - Conversation Bot (вопросы о членстве)
- **Цена раздельно**: 11,500₽/мес
- **Цена пакета**: 9,900₽/мес
- **Экономия**: 1,600₽/мес (14%)
- **Бонусы**:
  - ✓ Class Capacity Management
  - ✓ Membership Renewals
  - ✓ Progress Tracking
- **Кому подходит**: Спортзалы, йога-студии (50-500 членов)

**4. Retail Suite 🛍️**

- **Включает**:
  - AI PostMaster (новые поступления, распродажи)
  - Conversation Bot (запросы продуктов)
  - Feedback Bot (отзывы)
  - Video Inventory Agent (отслеживание запасов)
- **Цена раздельно**: 10,500₽/мес
- **Цена пакета**: 8,900₽/мес
- **Экономия**: 1,600₽/мес (15%)
- **Бонусы**:
  - ✓ Product Catalog
  - ✓ Order Processing
  - ✓ Loyalty Points
- **Кому подходит**: Бутики, магазины электроники (100-10K SKU)

**Дизайн карточек**:

- **Pricing Card Layout**:

```
  [Industry Icon 3D]
  [Package Name + Emoji]
  [Tagline]
  ---
  [Included Products List]
  ---
  [Pricing Comparison]
    Before: ~~11,500₽~~ (strikethrough)
    After: 9,900₽/мес (large, gradient)
    Badge: "SAVE 14%"
  ---
  [Bonus Features]
  ---
  [Target Audience]
  ---
  [CTA Button: "Выбрать пакет"]
```

- **Стилистика**:
  - Glassmorphism для основы
  - Gradient border (цвет пакета)
  - Hover: Scale + glow
  - Badge "BEST VALUE" на самом популярном
  - Animated savings counter

**Comparison Toggle**:

```
[Show Individual Prices] ←→ [Show Bundle Prices]
```

- Toggle анимирует изменение цен
- Highlight экономии

**Custom Package Builder**:

```
Не нашли подходящий пакет?
[Собрать свой пакет]
→ Opens interactive builder
Компоненты:
tsx<PricingSection>
  <SectionHeader>
    <Heading size="hero-lg" gradient>Готовые решения для вашей индустрии</Heading>
    <Subheading>Сэкономьте до 17% с отраслевыми пакетами</Subheading>
  </SectionHeader>

  <ComparisonToggle
    options={['Individual', 'Bundle']}
    onChange={setViewMode}
  />

  <PricingGrid>
    {packages.map((pkg, index) => (
      <PricingCard
        key={pkg.id}
        icon={<Animated3DIcon icon={pkg.icon} />}
        name={pkg.name}
        tagline={pkg.tagline}
        includedProducts={pkg.products}
        priceOriginal={pkg.priceOriginal}
        priceBundle={pkg.priceBundle}
        savings={pkg.savings}
        bonuses={pkg.bonuses}
        targetAudience={pkg.target}
        badge={pkg.badge}
        animationDelay={index * 0.15}
      />
    ))}
  </PricingGrid>

  <CustomPackageTeaser>
    <Text>Не нашли подходящий пакет?</Text>
    <Button variant="outline" onClick={openPackageBuilder}>
      Собрать свой пакет
    </Button>
  </CustomPackageTeaser>

  <FAQTeaser>
    <Text>Вопросы по ценам?</Text>
    <Link to="#faq">Посмотрите FAQ</Link>
  </FAQTeaser>
</PricingSection>
```

---

### 8. SUCCESS METRICS

**Цель**: Социальное доказательство + метрики

**Заголовок**:

```
RU: "Они уже автоматизировали свой бизнес"
EN: "They've Already Automated Their Business"
```

**Подзаголовок**:

```
RU: "Реальные результаты от реальных бизнесов"
EN: "Real results from real businesses"
```

**Metrics Bar** (большие цифры с CountUp):

```
[500+ бизнесов] [50,000+ постов создано] [40+ часов сэкономлено/месяц] [4.8★ рейтинг]
```

**Testimonials** (карусель из 6 отзывов):

**Пример структуры отзыва**:

```
[Avatar/Logo бизнеса]
"AI PostMaster сэкономил мне 20 часов в неделю. Контент стал лучше, вовлечённость выросла на 35%."
— Анна Петрова, владелица @BeautySalonMoscow
📍 Салон красоты, Москва | 👥 1,200 подписчиков
```

**6 отзывов** (разные индустрии):

1. **Ресторан**:

   - Имя: Дмитрий Иванов
   - Бизнес: @TastyBitesRest
   - Индустрия: Ресторан, Санкт-Петербург
   - Подписчики: 3,500
   - Цитата: "Booking Bot уменьшил no-show на 30%. Теперь столики всегда заполнены."
   - Результат: "↑ 30% загрузка"

2. **Салон красоты**:

   - Имя: Анна Петрова
   - Бизнес: @BeautySalonMoscow
   - Индустрия: Салон красоты, Москва
   - Подписчики: 1,200
   - Цитата: "AI PostMaster сэкономил 20 часов в неделю. Вовлечённость +35%."
   - Результат: "↓ 20ч/неделю"

3. **Фитнес-студия**:

   - Имя: Сергей Ковалёв
   - Бизнес: @FitLifeStudio
   - Индустрия: Фитнес, Казань
   - Подписчики: 5,800
   - Цитата: "Conversation Bot отвечает на 80% вопросов. Моя команда фокусируется на клиентах."
   - Результат: "↑ 80% автоответов"

4. **Розничный магазин**:

   - Имя: Елена Смирнова
   - Бизнес: @TechShopKrasnodar
   - Индустрия: Электроника, Краснодар
   - Подписчики: 2,100
   - Цитата: "Video Inventory Agent сократил время инвентаризации с 4 часов до 20 минут."
   - Результат: "↓ 92% время"

5. **Кофейня**:

   - Имя: Максим Соколов
   - Бизнес: @CoffeeCornerEkb
   - Индустрия: Кофейня, Екатеринбург
   - Подписчики: 800
   - Цитата: "Feedback Bot помог собрать 200+ отзывов. Рейтинг вырос с 4.2 до 4.8."
   - Результат: "↑ 4.8★ рейтинг"

6. **Барбершоп**:
   - Имя: Игорь Волков
   - Бизнес: @SharpCutsBarber
   - Индустрия: Барбершоп, Нижний Новгород
   - Подписчики: 1,500
   - Цитата: "AIBRO Business окупился за первый месяц. Больше не ищу SMM-менеджера."
   - Результат: "↓ 58K₽/мес"

**Дизайн**:

- **Carousel**:
  - Автопрокрутка (5 секунд на отзыв)
  - Smooth transition
  - Dots navigation
  - Swipe на мобильных
- **Testimonial Card**:
  - Avatar/logo слева
  - Цитата (большой текст)
  - Имя + бизнес (меньший текст)
  - Метрика результата (badge с gradient)
  - 5 звёзд рейтинга

**Logos Bar** (партнёры/каналы):

```
"Нам доверяют:"
[Logo 1] [Logo 2] [Logo 3] [Logo 4] [Logo 5]

Grayscale logos
Hover → color
Scrolling marquee animation

Компоненты:
tsx<SuccessMetricsSection>
  <SectionHeader>
    <Heading size="hero-lg" gradient>
      Они уже автоматизировали свой бизнес
    </Heading>
    <Subheading>Реальные результаты от реальных бизнесов</Subheading>
  </SectionHeader>

  <MetricsBar>
    <Metric
      icon={<Company />}
      value={500}
      suffix="+"
      label="бизнесов"
    />
    <Metric
      icon={<Post />}
      value={50000}
      suffix="+"
      label="постов создано"
    />
    <Metric
      icon={<Clock />}
      value={40}
      suffix="+"
      label="часов сэкономлено"
    />
    <Metric
      icon={<Star />}
      value={4.8}
      prefix="★"
      label="рейтинг"
    />
  </MetricsBar>

  <TestimonialsCarousel>
    {testimonials.map(testimonial => (
      <TestimonialCard
        key={testimonial.id}
        avatar={testimonial.avatar}
        quote={testimonial.quote}
        name={testimonial.name}
        business={testimonial.business}
        industry={testimonial.industry}
        subscribers={testimonial.subscribers}
        result={testimonial.result}
        rating={5}
      />
    ))}
  </TestimonialsCarousel>

  <LogosBar>
    <Text>Нам доверяют:</Text>
    <LogosMarquee logos={partnerLogos} />
  </LogosBar>
</SuccessMetricsSection>
```

---

### 9. ROADMAP

**Цель**: Показать будущее продукта + transparentность

**Заголовок**:

```
RU: "Что дальше?"
EN: "What's Next?"
```

**Подзаголовок**:

```
RU: "Мы постоянно развиваемся. Вот что у нас в планах."
EN: "We're constantly evolving. Here's what's on the horizon."
```

**Timeline** (horizontal на desktop, vertical на mobile):

**Q1 2025** ✅ Готово

- AI PostMaster V1 (Gemini 2.0 Flash + Imagen 4)
- Multi-channel support (Telegram)
- RAG Data Stores
- Basic analytics

**Q2 2025** 🚧 В разработке

- Conversation Bot V1
- Multi-language support (EN, RU)
- Advanced analytics dashboard
- API beta access

**Q3 2025** 📅 Запланировано

- Booking Bot V1
- Feedback Bot V1
- Restaurant & Beauty Suites
- White-label option

**Q4 2025** 🔮 Будущее

- Video Inventory Agent (R&D)
- Fitness & Retail Suites
- Premium features (Analytics Pro)
- International expansion

**2026+** 🚀 Видение

- Voice AI integration
- Computer Vision features
- IoT device integration
- Full Business OS

**Дизайн**:

- **Timeline bar**: Gradient line (primary.telegram → primary.neon)
- **Quarter cards**:
  - Status icon (✅ 🚧 📅 🔮 🚀)
  - Quarter label
  - Features list
  - Expandable (клик → подробнее)
- **Interactive**:
  - Hover на quarter → highlight + expand preview
  - Клик → modal с детальным описанием
  - "Vote for feature" button (собираем feedback)

**Feature Voting**:

```
💡 Хотите повлиять на roadmap?
[Голосовать за функции] → Opens feature voting modal
Компоненты:
tsx<RoadmapSection>
  <SectionHeader>
    <Heading size="hero-lg" gradient>Что дальше?</Heading>
    <Subheading>Мы постоянно развиваемся. Вот что у нас в планах.</Subheading>
  </SectionHeader>

  <RoadmapTimeline>
    {quarters.map((quarter, index) => (
      <QuarterCard
        key={quarter.id}
        status={quarter.status}
        label={quarter.label}
        features={quarter.features}
        onClick={() => openQuarterDetails(quarter.id)}
        animationDelay={index * 0.2}
      />
    ))}
  </RoadmapTimeline>

  <FeatureVotingTeaser>
    <Icon>💡</Icon>
    <Text>Хотите повлиять на roadmap?</Text>
    <Button variant="outline" onClick={openFeatureVoting}>
      Голосовать за функции
    </Button>
  </FeatureVotingTeaser>

  <SubscribeToUpdates>
    <Text>Получайте обновления о новых функциях</Text>
    <EmailInput placeholder="Ваш email" />
    <Button variant="gradient-primary">Подписаться</Button>
  </SubscribeToUpdates>
</RoadmapSection>
```

---

### 10. FAQ

**Цель**: Ответить на распространённые вопросы + снять возражения

**Заголовок**:

```
RU: "Частые вопросы"
EN: "Frequently Asked Questions"
```

**Подзаголовок**:

```
RU: "Не нашли ответ? Напишите нам в Telegram."
EN: "Can't find an answer? Message us on Telegram."
Вопросы (accordion, 12 вопросов):
Категория: Общее

Что такое AIBRO Business?

Ответ: "AIBRO Business — это экосистема AI-инструментов для автоматизации малого и среднего бизнеса, полностью интегрированная в Telegram. Мы помогаем автоматизировать создание контента, общение с клиентами, бронирование и другие рутинные задачи."


Почему именно Telegram?

Ответ: "Telegram — это не просто мессенджер. Это полноценная бизнес-платформа с каналами, группами, ботами и встроенными платежами. 70% российских бизнесов уже используют Telegram для общения с клиентами. Мы делаем эту работу автоматической."


Нужны ли технические знания?

Ответ: "Нет. Если вы умеете пользоваться Telegram, вы сможете пользоваться AIBRO Business. Всё управление — через простые команды и кнопки в боте."



Категория: Продукты

Что входит в AI PostMaster?

Ответ: "AI PostMaster автоматически создаёт и публикует контент для ваших Telegram-каналов. Включает: генерацию текста (Gemini 2.0 Flash), генерацию изображений (Imagen 4 Fast), умное планирование и персонализацию под ваш бренд."


Могу ли я редактировать посты перед публикацией?

Ответ: "Да! По умолчанию включен режим 'human-in-the-loop' — вы видите пост перед публикацией и можете отредактировать или отклонить. Также можно включить автопубликацию для полной автоматизации."


Когда будут доступны другие продукты (Conversation Bot и т.д.)?

Ответ: "Conversation Bot запланирован на Q2 2025, Booking Bot — Q3 2025, Feedback Bot — Q4 2025. Подпишитесь на обновления, чтобы узнать первыми."



Категория: Цены

Есть ли бесплатный trial?

Ответ: "Да! 7 дней бесплатного доступа к AI PostMaster. Без привязки карты. После trial можете выбрать подходящий тариф или отказаться."


Можно ли отменить подписку в любой момент?

Ответ: "Да. Никаких долгосрочных контрактов. Отмените подписку в любой момент через бота. Доступ сохранится до конца оплаченного периода."


Что если мне нужно больше/меньше продуктов?

Ответ: "Модульная система позволяет добавлять или удалять продукты в любое время. Платите только за то, что используете."



Категория: Безопасность

Безопасны ли мои данные?

Ответ: "Да. Все данные хранятся в зашифрованном виде. Мы используем Google Cloud infrastructure с сертификацией SOC 2 Type II. Ваш персональный Data Store доступен только вам."


Кто имеет доступ к моим постам и контенту?

Ответ: "Только вы. AI генерирует контент на основе ваших данных, но мы не храним и не используем ваш контент для обучения моделей."



Категория: Поддержка

Как получить помощь?

Ответ: "Напишите @AIBROSupportBot в Telegram. Среднее время ответа — 2 часа (на тарифах Pro/Business). Также доступна база знаний и video-tutorials."



Дизайн:

Accordion:

Вопрос: Bold, с иконкой +/- справа
Ответ: Плавно раскрывается с fade-in
Hover: Подсвечивается


Категории:

Tabs сверху (Общее | Продукты | Цены | Безопасность | Поддержка)
Клик на tab → фильтрует вопросы


Search:

Поисковая строка сверху: "Поиск по вопросам..."
Live search (фильтрует при вводе)



Компоненты:
tsx<FAQSection id="faq">
  <SectionHeader>
    <Heading size="hero-lg" gradient>Частые вопросы</Heading>
    <Subheading>Не нашли ответ? Напишите нам в Telegram.</Subheading>
  </SectionHeader>

  <FAQSearch
    placeholder="Поиск по вопросам..."
    onChange={filterFAQs}
  />

  <FAQCategories>
    {categories.map(category => (
      <CategoryTab
        key={category}
        active={activeCategory === category}
        onClick={() => setActiveCategory(category)}
      >
        {category}
      </CategoryTab>
    ))}
  </FAQCategories>

  <FAQAccordion>
    {filteredFAQs.map(faq => (
      <AccordionItem
        key={faq.id}
        question={faq.question}
        answer={faq.answer}
      />
    ))}
  </FAQAccordion>

  <ContactSupportBanner>
    <Text>Не нашли ответ?</Text>
    <Button variant="outline" onClick={openTelegramSupport}>
      Написать в поддержку
    </Button>
  </ContactSupportBanner>
</FAQSection>
```

---

### 11. CTA SECTION (Final)

**Цель**: Последний призыв к действию перед footer

**Заголовок**:

```
RU: "Готовы автоматизировать свой бизнес?"
EN: "Ready to Automate Your Business?"
```

**Подзаголовок**:

```
RU: "Присоединяйтесь к 500+ бизнесам, которые уже работают с AIBRO"
EN: "Join 500+ businesses already using AIBRO"
```

**Два пути действия**:

**1. Форма заявки** (Primary):

**Поля формы**:

- Имя (обязательно)
- Email (обязательно)
- Telegram username (обязательно, с валидацией @username)
- Название бизнеса (опционально)
- Интересующий продукт (dropdown: AI PostMaster | Conversation Bot | Booking Bot | Feedback Bot | Video Inventory | Вертикальный пакет | Не уверен)
- Краткое описание (textarea): "Расскажите, что хотите автоматизировать"
- Checkbox: "Я согласен на обработку персональных данных" (обязательно)
- reCAPTCHA v3 (invisible)

**Кнопка отправки**:

```
"Получить бесплатный trial"
```

**После отправки**:

1. Success message (modal or inline):

```
   ✅ Заявка отправлена!
   Мы отправили вам сообщение в Telegram.
   Проверьте @AIBROBusinessBot.
```

2. Отправка в Telegram:
   - Боту (ID: 7689714723): Уведомление о новой заявке с данными
   - Каналу (https://t.me/c/3293972627/3): Лог заявки
   - Пользователю (@username): Приветственное сообщение с инструкциями

**2. Прямая кнопка в Telegram** (Secondary):

```
"Написать в Telegram →"

Открывает t.me/AIBROBusinessBot
Deep link с параметром: ?start=landing_cta

Визуальный дизайн:

Фон: Gradient mesh (primary.telegram → primary.neon → primary.mint)
- **Форма**: Glassmorphism card в центре
- **Анимация**: Floating particles вокруг формы
- **Inputs**:
  - Glass-style с subtle border
  - Focus: Glow effect
  - Error state: Red border + shake animation
  - Success state: Green checkmark animation

**Trust badges** (под формой):
```

[🔒 Безопасно] [⚡ Быстро] [💯 Бесплатный trial]

`````

**Компоненты**:
````tsx
<CTASection>
  <CTABackground>
    <GradientMesh />
    <ParticleField />
  </CTABackground>

  <CTAContent>
    <SectionHeader>
      <Heading size="hero-lg" color="white">
        Готовы автоматизировать свой бизнес?
      </Heading>
      <Subheading color="white/80">
        Присоединяйтесь к 500+ бизнесам, которые уже работают с AIBRO
      </Subheading>
    </SectionHeader>

    <CTAForm onSubmit={handleSubmit}>
      <FormField>
        <Label>Имя *</Label>
        <Input
          name="name"
          placeholder="Иван Иванов"
          required
        />
      </FormField>

      <FormField>
        <Label>Email *</Label>
        <Input
          type="email"
          name="email"
          placeholder="ivan@example.com"
          required
        />
      </FormField>

      <FormField>
        <Label>Telegram *</Label>
        <Input
          name="telegram"
          placeholder="@username"
          pattern="^@[a-zA-Z0-9_]{5,}$"
          required
        />
      </FormField>

      <FormField>
        <Label>Название бизнеса</Label>
        <Input
          name="business"
          placeholder="Моя компания"
        />
      </FormField>

      <FormField>
        <Label>Что вас интересует?</Label>
        <Select name="product">
          <option>AI PostMaster</option>
          <option>Conversation Bot</option>
          <option>Booking Bot</option>
          <option>Feedback Bot</option>
          <option>Video Inventory</option>
          <option>Вертикальный пакет</option>
          <option>Не уверен</option>
        </Select>
      </FormField>

      <FormField>
        <Label>Что хотите автоматизировать?</Label>
        <Textarea
          name="description"
          placeholder="Например: создание контента для Instagram, ответы на сообщения..."
          rows={3}
        />
      </FormField>

      <Checkbox required>
        <CheckboxInput id="consent" />
        <CheckboxLabel htmlFor="consent">
          Я согласен на обработку персональных данных
        </CheckboxLabel>
      </Checkbox>

      <ReCAPTCHA sitekey={RECAPTCHA_SITE_KEY} />

      <FormActions>
        <Button
          type="submit"
          variant="white"
          size="xl"
          loading={isSubmitting}
        >
          Получить бесплатный trial
        </Button>

        <Divider>или</Divider>

        <Button
          variant="outline-white"
          size="xl"
          onClick={openTelegramBot}
        >
          Написать в Telegram →
        </Button>
      </FormActions>

      <TrustBadges>
        <Badge icon={<Lock />}>Безопасно</Badge>
        <Badge icon={<Zap />}>Быстро</Badge>
        <Badge icon={<Check />}>Бесплатный trial</Badge>
      </TrustBadges>
    </CTAForm>

    {showSuccess && (
      <SuccessModal>
        <Icon size={64}>✅</Icon>
        <Heading size="display">Заявка отправлена!</Heading>
        <Text>
          Мы отправили вам сообщение в Telegram.
          Проверьте @AIBROBusinessBot.
        </Text>
        <Button onClick={closeSuccessModal}>Закрыть</Button>
      </SuccessModal>
    )}
  </CTAContent>
</CTASection>
`````

---

### 12. FOOTER

**Цель**: Навигация, контакты, legal info

**Структура** (4 колонки на desktop):

**Колонка 1: О компании**

- Logo + tagline
- Краткое описание (1-2 предложения)
- Социальные сети:
  - Telegram Channel: [@aibrotop](https://t.me/aibrotop)
  - Telegram Bot: [@AIBROBusinessBot]
  - Twitter/X (если есть)
  - LinkedIn (если есть)

**Колонка 2: Продукты**

- AI PostMaster
- Conversation Bot
- Booking Bot
- Feedback Bot
- Video Inventory Agent
- Вертикальные пакеты

**Колонка 3: Ресурсы**

- Блог (если есть)
- Документация
- API Docs (для будущего)
- Roadmap
- Pricing
- FAQ

**Колонка 4: Поддержка**

- Связаться с нами
- Telegram Support: @AIBROSupportBot
- Email: support@aibrobusiness.com
- База знаний
- Статус системы (status.aibrobusiness.com)

**Bottom Bar**:

```
Copyright © 2025 AIBRO Business. Все права защищены.
[Политика конфиденциальности] [Условия использования] [Cookie Policy]
[Language: RU ▼] [Theme: 🌙]
```

**Дизайн**:

- **Фон**: neutral.900 (тёмная тема) или neutral.50 (светлая тема)
- **Текст**: Контрастный
- **Links**: Hover → primary.telegram color + underline
- **Social icons**: Круглые, glassmorphism, hover → scale + glow

**Мобильная версия**:

- Accordion для каждой колонки
- Клик → раскрывается список ссылок

**Компоненты**:

```tsx
<Footer>
  <FooterContent>
    <FooterColumn>
      <Logo size="md" />
      <Tagline>AI-автоматизация бизнеса в Telegram</Tagline>
      <Description>
        Экосистема AI-инструментов для малого и среднего бизнеса.
      </Description>
      <SocialLinks>
        <SocialIcon href="https://t.me/aibrotop" icon={<Telegram />} />
        <SocialIcon href="https://t.me/AIBROBusinessBot" icon={<Bot />} />
        <SocialIcon href="#" icon={<Twitter />} />
        <SocialIcon href="#" icon={<LinkedIn />} />
      </SocialLinks>
    </FooterColumn>

    <FooterColumn title="Продукты">
      <FooterLink to="/products/ai-postmaster">AI PostMaster</FooterLink>
      <FooterLink to="/products/conversation-bot">Conversation Bot</FooterLink>
      <FooterLink to="/products/booking-bot">Booking Bot</FooterLink>
      <FooterLink to="/products/feedback-bot">Feedback Bot</FooterLink>
      <FooterLink to="/products/video-inventory">Video Inventory</FooterLink>
      <FooterLink to="/pricing">Вертикальные пакеты</FooterLink>
    </FooterColumn>

    <FooterColumn title="Ресурсы">
      <FooterLink to="/blog">Блог</FooterLink>
      <FooterLink to="/docs">Документация</FooterLink>
      <FooterLink to="/api">API Docs</FooterLink>
      <FooterLink to="/roadmap">Roadmap</FooterLink>
      <FooterLink to="/pricing">Pricing</FooterLink>
      <FooterLink to="/faq">FAQ</FooterLink>
    </FooterColumn>

    <FooterColumn title="Поддержка">
      <FooterLink to="/contact">Связаться с нами</FooterLink>
      <FooterLink href="https://t.me/AIBROSupportBot">
        Telegram Support
      </FooterLink>
      <FooterLink href="mailto:support@aibrobusiness.com">Email</FooterLink>
      <FooterLink to="/help">База знаний</FooterLink>
      <FooterLink href="https://status.aibrobusiness.com">
        Статус системы
      </FooterLink>
    </FooterColumn>
  </FooterContent>

  <FooterBottom>
    <Copyright>© 2025 AIBRO Business. Все права защищены.</Copyright>
    <LegalLinks>
      <Link to="/privacy">Политика конфиденциальности</Link>
      <Link to="/terms">Условия использования</Link>
      <Link to="/cookies">Cookie Policy</Link>
    </LegalLinks>
    <FooterActions>
      <LanguageSwitcher />
      <ThemeToggle />
    </FooterActions>
  </FooterBottom>
</Footer>
```

---

## 🌐 ИНТЕРНАЦИОНАЛИЗАЦИЯ (i18next)

### Настройка

**Файловая структура**:

```
src/
  i18n/
    config.ts          # i18next конфигурация
    locales/
      ru/
        common.json    # Общие переводы
        hero.json      # Hero секция
        products.json  # Продукты
        pricing.json   # Цены
        faq.json       # FAQ
        ...
      en/
        common.json
        hero.json
        products.json
        pricing.json
        faq.json
        ...
```

**config.ts**:

```typescript
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import translations
import ruCommon from "./locales/ru/common.json";
import ruHero from "./locales/ru/hero.json";
import ruProducts from "./locales/ru/products.json";
// ... другие RU

import enCommon from "./locales/en/common.json";
import enHero from "./locales/en/hero.json";
import enProducts from "./locales/en/products.json";
// ... другие EN

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ru: {
        common: ruCommon,
        hero: ruHero,
        products: ruProducts,
        // ...
      },
      en: {
        common: enCommon,
        hero: enHero,
        products: enProducts,
        // ...
      },
    },
    fallbackLng: "ru",
    defaultNS: "common",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;
```

**Примеры переводов**:

**ru/hero.json**:

```json
{
  "title": "AI-автоматизация бизнеса прямо в Telegram",
  "subtitle": "Один мессенджер. Полная экосистема AI-инструментов. Начните с 3,000₽/месяц.",
  "cta": {
    "primary": "Попробовать бесплатно 7 дней",
    "secondary": "Посмотреть демо"
  },
  "stats": {
    "businesses": "бизнесов",
    "posts": "постов создано",
    "rating": "рейтинг"
  }
}
```

**en/hero.json**:

```json
{
  "title": "AI Business Automation. Native in Telegram.",
  "subtitle": "One messenger. Complete AI ecosystem. Start at $30/month.",
  "cta": {
    "primary": "Try Free for 7 Days",
    "secondary": "Watch Demo"
  },
  "stats": {
    "businesses": "businesses",
    "posts": "posts created",
    "rating": "rating"
  }
}
```

**Использование в компонентах**:

```tsx
import { useTranslation } from "react-i18next";

const HeroSection = () => {
  const { t } = useTranslation("hero");

  return (
    <HeroSection>
      <Heading>{t("title")}</Heading>
      <Subheading>{t("subtitle")}</Subheading>
      <Button>{t("cta.primary")}</Button>
    </HeroSection>
  );
};
```

**Language Switcher компонент**:

```tsx
const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng);
  };

  return (
    <LanguageToggle>
      <LanguageButton
        active={i18n.language === "ru"}
        onClick={() => changeLanguage("ru")}
      >
        🇷🇺 RU
      </LanguageButton>
      <LanguageButton
        active={i18n.language === "en"}
        onClick={() => changeLanguage("en")}
      >
        🇬🇧 EN
      </LanguageButton>
    </LanguageToggle>
  );
};
```

---

## 🌓 ТЁМНАЯ/СВЕТЛАЯ ТЕМА

### Реализация через CSS Variables + Context

**theme-config.ts**:

```typescript
export const lightTheme = {
  colors: {
    bg: {
      primary: "#FFFFFF",
      secondary: "#F8FAFC",
      tertiary: "#F1F5F9",
    },
    text: {
      primary: "#0F172A",
      secondary: "#475569",
      tertiary: "#64748B",
    },
    border: "rgba(0, 0, 0, 0.1)",
    shadow: "rgba(0, 0, 0, 0.1)",
    // Primary colors остаются те же
    primary: {
      telegram: "#0088cc",
      electric: "#00D9FF",
      neon: "#7B2FFF",
      mint: "#00FFA3",
    },
  },
};

export const darkTheme = {
  colors: {
    bg: {
      primary: "#0F172A",
      secondary: "#1E293B",
      tertiary: "#334155",
    },
    text: {
      primary: "#F8FAFC",
      secondary: "#CBD5E1",
      tertiary: "#94A3B8",
    },
    border: "rgba(255, 255, 255, 0.1)",
    shadow: "rgba(0, 0, 0, 0.5)",
    // Primary colors чуть ярче для dark mode
    primary: {
      telegram: "#00A0F0",
      electric: "#00E5FF",
      neon: "#9D50FF",
      mint: "#00FFB3",
    },
  },
};
```

**ThemeContext.tsx**:

```tsx
import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("theme");
    return (saved as Theme) || "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};
```

**globals.css**:

```css
:root[data-theme="light"] {
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --bg-tertiary: #f1f5f9;
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-tertiary: #64748b;
  --border: rgba(0, 0, 0, 0.1);
  --shadow: rgba(0, 0, 0, 0.1);

  /* Primary colors */
  --primary-telegram: #0088cc;
  --primary-electric: #00d9ff;
  --primary-neon: #7b2fff;
  --primary-mint: #00ffa3;
}

:root[data-theme="dark"] {
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --bg-tertiary: #334155;
  --text-primary: #f8fafc;
  --text-secondary: #cbd5e1;
  --text-tertiary: #94a3b8;
  --border: rgba(255, 255, 255, 0.1);
  --shadow: rgba(0, 0, 0, 0.5);

  /* Primary colors (чуть ярче) */
  --primary-telegram: #00a0f0;
  --primary-electric: #00e5ff;
  --primary-neon: #9d50ff;
  --primary-mint: #00ffb3;
}

/* Transitions для плавной смены темы */
* {
  transition: background-color 0.3s ease, color 0.3s ease,
    border-color 0.3s ease;
}
```

**Tailwind config для темы**:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "var(--bg-primary)",
          secondary: "var(--bg-secondary)",
          tertiary: "var(--bg-tertiary)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          tertiary: "var(--text-tertiary)",
        },
        primary: {
          telegram: "var(--primary-telegram)",
          electric: "var(--primary-electric)",
          neon: "var(--primary-neon)",
          mint: "var(--primary-mint)",
        },
      },
    },
  },
};
```

**ThemeToggle компонент**:

```tsx
import { useTheme } from "../context/ThemeContext";
import { Sun, Moon } from "lucide-react";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-bg-tertiary hover:bg-bg-secondary transition-colors"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Moon className="w-5 h-5 text-text-primary" />
      ) : (
        <Sun className="w-5 h-5 text-text-primary" />
      )}
    </button>
  );
};
```

---

## 📱 АДАПТИВНОСТЬ

### Breakpoints Strategy

```javascript
breakpoints: {
  'xs': '320px',   // Маленькие телефоны
  'sm': '640px',   // Телефоны
  'md': '768px',   // Таблеты
  'lg': '1024px',  // Маленькие ноутбуки
  'xl': '1280px',  // Большие ноутбуки
  '2xl': '1536px', // Десктопы
}
```

### Responsive Patterns по секциям

**Hero Section**:

- **Desktop (lg+)**: 50/50 split, 3D объект справа
- **Tablet (md-lg)**: 60/40 split, уменьшенный 3D
- **Mobile (< md)**: Stack, 3D под кнопками, меньший размер

**Product Cards**:

- **Desktop (lg+)**: 3 колонки
- **Tablet (md-lg)**: 2 колонки
- **Mobile (< md)**: 1 колонка

**Pricing Cards**:

- **Desktop (lg+)**: 4 карточки в ряд
- **Tablet (md-lg)**: 2x2 grid
- **Mobile (< md)**: Stack

**Navigation**:

- **Desktop**: Horizontal menu
- **Mobile**: Hamburger → full-screen drawer

**Form**:

- **Desktop**: 2 колонки для некоторых полей
- **Mobile**: 1 колонка для всех

**Компонент для адаптивности**:

```tsx
const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState("xl");

  useEffect(() => {
    const checkBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 640) setBreakpoint("xs");
      else if (width < 768) setBreakpoint("sm");
      else if (width < 1024) setBreakpoint("md");
      else if (width < 1280) setBreakpoint("lg");
      else if (width < 1536) setBreakpoint("xl");
      else setBreakpoint("2xl");
    };

    checkBreakpoint();
    window.addEventListener("resize", checkBreakpoint);
    return () => window.removeEventListener("resize", checkBreakpoint);
  }, []);

  return breakpoint;
};
```

---

## 🎨 ВИЗУАЛЬНЫЕ РЕСУРСЫ

### Что нужно создать/найти

**Иконки (3D)**:

- AI мозг (для Hero)
- Telegram logo (стилизованный)
- 💰 Money (Problem: Дорогие специалисты)
- 💬 Chat (Problem: Ручное общение)
- 📅 Calendar (Problem: Хаос с бронированиями)
- 📊 Analytics (Problem: Нет анализа)
- 📱 Phone (How It Works: Step 1)
- ⚙️ Gear (How It Works: Step 2)
- 🚀 Rocket (How It Works: Step 3)
- 🍽️ Restaurant (Pricing: Restaurant Suite)
- 💇 Scissors (Pricing: Beauty Suite)
- 🏋️ Dumbbell (Pricing: Fitness Suite)
- 🛍️ Shopping Bag (Pricing: Retail Suite)

**Mockups**:

- Telegram интерфейс (канал с постами)
- Telegram чат с ботом (onboarding)
- Примеры сгенерированных постов
- Интерфейс Booking Bot
- Dashboard Analytics Pro

**3D Объекты**:

- Hero object (абстрактный AI-brain)
- Floating particles (Telegram-shaped)
- Product icons (3D versions)

**Illustrations**:

- Модульная экосистема (LEGO-style diagram)
- Timeline для "How It Works"
- Comparison table visualizations
- Success metrics infographic

**Где взять**:

- **3D иконки**: Spline (создать custom) или готовые с [icons8.com/icons/3d](https://icons8.com/icons/3d)
- **Mockups**: Figma Community или собственные скриншоты Telegram
- **Illustrations**: [unDraw](https://undraw.co/), [Storyset](https://storyset.com/) или Midjourney
- **3D объекты**: Blender (custom) или [Sketchfab](https://sketchfab.com/)

---

## 🔧 ТЕХНИЧЕСКАЯ РЕАЛИЗАЦИЯ

### Tech Stack

```yaml
Frontend:
  - React 18+
  - TypeScript
  - Vite (build tool)
  - TailwindCSS 3.4
  - Framer Motion (animations)
  - Three.js + React Three Fiber (3D)
  - i18next + react-i18next (i18n)
  - React Hook Form (forms)
  - Zod (validation)
  - React Router DOM (routing)

UI Components:
  - Lucide React (icons)
  - Radix UI (headless components)
  - Lottie React (animations)

Integration:
  - Google reCAPTCHA v3
  - Telegram Bot API (webhooks)
  - Analytics (Google Analytics 4 or Plausible)
```

### Структура проекта

```
aibro-business-landing/
├── public/
│   ├── images/
│   │   ├── icons/
│   │   ├── mockups/
│   │   ├── illustrations/
│   │   └── 3d/
│   ├── videos/ (если будут)
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Textarea.tsx
│   │   │   ├── Checkbox.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Accordion.tsx
│   │   │   └── ...
│   │   ├── sections/
│   │   │   ├── Header.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── ProblemSection.tsx
│   │   │   ├── SolutionSection.tsx
│   │   │   ├── ProductsSection.tsx
│   │   │   ├── HowItWorksSection.tsx
│   │   │   ├── PricingSection.tsx
│   │   │   ├── SuccessMetricsSection.tsx
│   │   │   ├── RoadmapSection.tsx
│   │   │   ├── FAQSection.tsx
│   │   │   ├── CTASection.tsx
│   │   │   └── Footer.tsx
│   │   ├── 3d/
│   │   │   ├── HeroObject3D.tsx
│   │   │   ├── ParticleSystem.tsx
│   │   │   └── ProductIcon3D.tsx
│   │   └── animations/
│   │       ├── CountUp.tsx
│   │       ├── TypeAnimation.tsx
│   │       └── ScrollTrigger.tsx
│   ├── context/
│   │   ├── ThemeContext.tsx
│   │   └── LanguageContext.tsx (если нужен кастомный)
│   ├── hooks/
│   │   ├── useBreakpoint.ts
│   │   ├── useScrollTrigger.ts
│   │   └── useIntersectionObserver.ts
│   ├── lib/
│   │   ├── data/
│   │   │   ├── products.ts
│   │   │   ├── pricing.ts
│   │   │   ├── testimonials.ts
│   │   │   └── faq.ts
│   │   ├── utils.ts
│   │   └── motion-presets.ts
│   ├── i18n/
│   │   ├── config.ts
│   │   └── locales/
│   │       ├── ru/
│   │       └── en/
│   ├── styles/
│   │   ├── globals.css
│   │   └── animations.css
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   └── main.tsx
├── .env.example
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 📝 ПРОМПТ ДЛЯ РЕАЛИЗАЦИИ

````markdown
# ЗАДАНИЕ: Создать landing page для AIBRO Business

## Контекст

AIBRO Business — это экосистема AI-инструментов для автоматизации малого и среднего бизнеса, полностью интегрированная в Telegram. Основной продукт — AI PostMaster (автоматизация создания контента). Дополнительно: Conversation Bot, Booking Bot, Feedback Bot, Video Inventory Agent. Есть вертикальные пакеты для ресторанов, салонов красоты, фитнеса и ритейла.

## Технический стек

- React 18 + TypeScript
- Vite (build tool)
- TailwindCSS 3.4
- Framer Motion (анимации)
- Three.js + React Three Fiber (3D элементы)
- i18next + react-i18next (RU/EN)
- React Hook Form + Zod (формы)
- Lucide React (иконки)
- React Router DOM

## Требования к дизайну

### Цветовая палитра

```javascript
colors: {
  primary: {
    telegram: '#0088cc',
    electric: '#00D9FF',
    neon: '#7B2FFF',
    mint: '#00FFA3',
  },
  accent: {
    coral: '#FF6B6B',
    gold: '#FFD93D',
    violet: '#A855F7',
  },
  // Нейтральные и семантические цвета в дизайн-системе выше
}
```

### Визуальный стиль

- Футуристичный, но теплый
- Glassmorphism для карточек
- Gradient backgrounds с animated shifts
- 3D анимированные иконки
- Floating particles (Telegram-shaped)
- Smooth transitions (0.3s ease)
- Hover effects: scale + glow
- Scroll-triggered animations

### Типографика

- Heading font: 'Inter', sans-serif
- Body font: 'Inter', sans-serif
- Font sizes: hero-xl (72px), hero-lg (56px), display (40px), heading (32px), body (16px)
- Responsive: Уменьшаются на mobile (hero-xl → 40px)

### Анимации

- **Framer Motion variants**:
  - fadeInUp: opacity 0→1, y 60→0
  - scaleIn: opacity 0→1, scale 0.8→1
  - slideInLeft: opacity 0→1, x -100→0
  - floating: continuous y motion + rotation
  - glowPulse: animated box-shadow
- **Stagger animations**: 0.15s delay между элементами
- **Scroll-triggered**: IntersectionObserver, once: true

### 3D элементы

- **Hero Object**: Вращающийся абстрактный объект (TorusKnot или custom mesh)
- **Product Icons**: 3D иконки с rotation on hover
- **Particles**: 100 Telegram-shaped particles, mouse-follow

### Адаптивность

- Breakpoints: xs(320), sm(640), md(768), lg(1024), xl(1280), 2xl(1536)
- Mobile-first approach
- Hamburger menu на mobile
- Stack layouts на mobile
- Grid → columns → stack

## Структура секций

### 1. Header (фиксированный)

- Logo (AIBRO Business)
- Desktop nav: [Продукты | Цены | Кейсы | FAQ]
- Mobile nav: Hamburger → full-screen drawer
- Actions: [Language (RU/EN)] [Theme Toggle] [CTA: "Начать бесплатно"]
- Blur background при скролле

### 2. Hero Section

**Заголовок**: "AI-автоматизация бизнеса прямо в Telegram"
**Подзаголовок**: "Один мессенджер. Полная экосистема AI-инструментов. Начните с 3,000₽/месяц."
**CTA buttons**:

- Primary: "Попробовать бесплатно 7 дней"
- Secondary: "Посмотреть демо"
  **Stats Bar**: [500+ бизнесов] [50K+ постов] [4.8★]
  **Visual**: 3D Hero Object (справа на desktop, под кнопками на mobile)
  **Background**: Gradient mesh + floating particles + grid overlay
  **Scroll indicator**: Анимированная стрелка вниз

### 3. Problem Section

**Заголовок**: "Знакомая боль?"
**4 карточки проблем**:

1. "SMM-менеджер: 58,000₽/месяц" (💰)
2. "3-5 часов/день на ответы" (💬)
3. "Пропущенные звонки = потерянные заказы" (📅)
4. "Работаете вслепую" (📊)
   **Layout**: 2x2 grid (desktop), stack (mobile)
   **Animation**: Stagger fade-in + scale

### 4. Solution Section

**Заголовок**: "AIBRO Business: Ваш AI-отдел в Telegram"
**3 преимущества** (split layout, чередуется):

1. "Telegram-нативность" + mockup интерфейса
2. "Модульная экосистема" + диаграма модулей
3. "AI, который изучает ваш бизнес" + анимация нейросети
   **Comparison table**: AIBRO vs Фрилансер vs Корп. ПО
   **CTA Banner**: "Готовы начать?"

### 5. Products Showcase

**Заголовок**: "Познакомьтесь с экосистемой"
**Featured Card**: AI PostMaster (большая карточка с badge "MOST POPULAR")

- Описание, функции, pricing, CTA
- Mockup Telegram-канала
  **Tier 2 Grid**: 4 карточки (Conversation, Booking, Feedback, Video Inventory)
- Status badges: ✅ Available / 🟡 Coming Soon / 🔴 R&D
- Hover: 3D tilt effect
  **Savings Calculator**: Интерактивный калькулятор экономии

### 6. How It Works

**Заголовок**: "3 шага к автоматизации"
**Timeline** (вертикальная линия):

1. "Найдите @AIBROBusinessBot" (1 мин)
2. "Расскажите о своём бизнесе" (5 мин)
3. "Создайте первый пост" (9 мин)
   **Visual**: Split layout с mockups Telegram
   **Pro Tip Banner**: "Хотите быстрее? Используйте /quickstart"

### 7. Pricing & Packages

**Заголовок**: "Готовые решения для вашей индустрии"
**4 пакета**:

1. Restaurant Suite (9,900₽/мес, save 14%)
2. Beauty & Wellness Suite (9,500₽/мес, save 17%)
3. Fitness Suite (9,900₽/мес, save 14%)
4. Retail Suite (8,900₽/мес, save 15%)
   **Pricing Card**: Industry icon, included products, pricing comparison, bonuses, target audience
   **Badge**: "BEST VALUE" на Beauty Suite
   **Custom Package Builder**: "Собрать свой пакет"

### 8. Success Metrics

**Заголовок**: "Они уже автоматизировали свой бизнес"
**Metrics Bar**: 500+ бизнесов, 50K+ постов, 40+ часов, 4.8★
**Testimonials Carousel**: 6 отзывов (auto-scroll 5s)

- Avatar, цитата, имя, бизнес, результат
  **Logos Bar**: Партнёры (grayscale → color on hover)

### 9. Roadmap

**Заголовок**: "Что дальше?"
**Horizontal timeline**: Q1 2025 → Q2 → Q3 → Q4 → 2026+
**Status icons**: ✅ 🚧 📅 🔮 🚀
**Interactive**: Клик → modal с деталями
**Feature Voting**: "Голосовать за функции"
**Newsletter**: Email input для обновлений

### 10. FAQ

**Заголовок**: "Частые вопросы"
**Search bar**: Live search фильтрация
**Categories tabs**: Общее | Продукты | Цены | Безопасность | Поддержка
**12 вопросов** (accordion):

- Что такое AIBRO Business?
- Почему Telegram?
- Нужны ли технические знания?
- Что входит в AI PostMaster?
- Можно редактировать посты?
- Когда другие продукты?
- Есть ли trial?
- Можно отменить подписку?
- Что если нужно больше/меньше?
- Безопасны ли данные?
- Кто имеет доступ к контенту?
- Как получить помощь?
  **CTA Banner**: "Не нашли ответ? Написать в поддержку"

### 11. CTA Section (Final)

**Заголовок**: "Готовы автоматизировать свой бизнес?"
**Background**: Gradient mesh + particles
**Form** (glassmorphism card):

- Поля: Имя*, Email*, Telegram\*, Название бизнеса, Интересующий продукт (dropdown), Описание (textarea)
- Checkbox: Согласие на обработку данных\*
- reCAPTCHA v3 (invisible)
- Button: "Получить бесплатный trial"
  **Alternative**: Button "Написать в Telegram →" (opens t.me/AIBROBusinessBot)
  **Trust badges**: [🔒 Безопасно] [⚡ Быстро] [💯 Бесплатный trial]

**После отправки**:

- Success modal: "✅ Заявка отправлена! Проверьте @AIBROBusinessBot"
- Отправка в Telegram Bot (ID: 7689714723)
- Отправка в канал (https://t.me/c/3293972627/3)
- Приветственное сообщение пользователю

### 12. Footer

**4 колонки** (accordion на mobile):

1. О компании: Logo, описание, соцсети
2. Продукты: Список всех продуктов + пакеты
3. Ресурсы: Блог, Docs, API, Roadmap, Pricing, FAQ
4. Поддержка: Contact, Telegram Support, Email, База знаний, Status
   **Bottom bar**: Copyright, Legal links (Privacy, Terms, Cookies), Language, Theme

## Интернационализация (i18next)

### Настройка

```typescript
// src/i18n/config.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import локалей
import ruCommon from './locales/ru/common.json';
import ruHero from './locales/ru/hero.json';
// ...все остальные

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ru: { common: ruCommon, hero: ruHero, ... },
      en: { common: enCommon, hero: enHero, ... },
    },
    fallbackLng: 'ru',
    defaultNS: 'common',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });
```

### Структура переводов

```
src/i18n/locales/
  ru/
    common.json    # Кнопки, лейблы
    hero.json      # Hero секция
    products.json  # Продукты
    pricing.json   # Цены
    faq.json       # FAQ
  en/
    common.json
    hero.json
    products.json
    pricing.json
    faq.json
```

### Использование

```tsx
import { useTranslation } from 'react-i18next';

const Component = () => {
  const { t } = useTranslation('hero');
  return {t('title')};
};
```

## Темная/Светлая тема

### Theme Context

```tsx
// src/context/ThemeContext.tsx
type Theme = "light" | "dark";

const ThemeContext = createContext<{
  theme: Theme;
  toggleTheme: () => void;
}>();

// Сохранение в localStorage
// Применение data-theme атрибута на :root
```

### CSS Variables

```css
:root[data-theme="light"] {
  --bg-primary: #ffffff;
  --text-primary: #0f172a;
  --primary-telegram: #0088cc;
  /* ... */
}

:root[data-theme="dark"] {
  --bg-primary: #0f172a;
  --text-primary: #f8fafc;
  --primary-telegram: #00a0f0; /* ярче */
  /* ... */
}

* {
  transition: background-color 0.3s ease, color 0.3s ease;
}
```

### Tailwind config

```javascript
theme: {
  extend: {
    colors: {
      bg: {
        primary: 'var(--bg-primary)',
        secondary: 'var(--bg-secondary)',
      },
      text: {
        primary: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
      },
      /* ... */
    },
  },
}
```

## Форма обратной связи (интеграция с Telegram)

### API endpoint

```typescript
// src/api/telegram.ts
const TELEGRAM_BOT_TOKEN = "7689714723:AAGnAFlL_skB5_HSaH-TXshS38fnGg6QSW0";
const TELEGRAM_CHANNEL_ID = "-1002293972627"; // для канала t.me/c/3293972627/3

export const sendToTelegram = async (formData: FormData) => {
  const message = `
🆕 Новая заявка с Landing Page

👤 Имя: ${formData.name}
📧 Email: ${formData.email}
💬 Telegram: ${formData.telegram}
🏢 Бизнес: ${formData.business || "Не указано"}
🎯 Интерес: ${formData.product}
📝 Описание: ${formData.description}
  `;

  // Отправка в канал
  await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHANNEL_ID,
      text: message,
      parse_mode: "HTML",
    }),
  });

  // Отправка пользователю (если нужно)
  // await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     chat_id: formData.telegram.replace('@', ''), // или через username resolution
  //     text: 'Спасибо за заявку! Мы скоро свяжемся с вами.',
  //   }),
  // });
};
```

### Form validation (Zod)

```typescript
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(2, "Минимум 2 символа"),
  email: z.string().email("Некорректный email"),
  telegram: z.string().regex(/^@[a-zA-Z0-9_]{5,}$/, "Формат: @username"),
  business: z.string().optional(),
  product: z.enum([
    "AI PostMaster",
    "Conversation Bot",
    "Booking Bot",
    "Feedback Bot",
    "Video Inventory",
    "Вертикальный пакет",
    "Не уверен",
  ]),
  description: z.string().min(10, "Минимум 10 символов"),
  consent: z.boolean().refine((val) => val === true, "Необходимо согласие"),
});
```

### reCAPTCHA v3

```typescript
import ReCAPTCHA from "react-google-recaptcha";

const RECAPTCHA_SITE_KEY = "your_site_key";

// При submit
const token = await recaptchaRef.current?.executeAsync();
// Валидация на backend (если есть)
```

## Данные (моковые для начала)

### Products data

```typescript
// src/lib/data/products.ts
export const products = [
  {
    id: "ai-postmaster",
    name: "AI PostMaster",
    tagline: "Ваш AI SMM-менеджер за 3,000₽/месяц",
    icon: "/images/icons/postmaster.png",
    description:
      "Автоматическое создание и публикация контента в Telegram-каналах.",
    features: [
      "Генерация текста (Gemini 2.0 Flash)",
      "Генерация изображений (Imagen 4 Fast)",
      "Умное планирование",
      "Персонализация под бренд",
    ],
    pricing: {
      starter: { price: 3000, features: ["1 канал", "30 постов/мес"] },
      pro: { price: 5000, features: ["1 канал", "Неограниченно", "Аналитика"] },
      business: {
        price: 8000,
        features: ["3 канала", "Неограниченно", "Приоритет"],
      },
    },
    status: "available",
  },
  // ... остальные продукты
];
```

### Pricing packages

```typescript
// src/lib/data/pricing.ts
export const packages = [
  {
    id: "restaurant-suite",
    name: "Restaurant Suite",
    icon: "🍽️",
    tagline: "Полная автоматизация для ресторанов",
    products: [
      "AI PostMaster",
      "Booking Bot",
      "Feedback Bot",
      "Video Inventory",
    ],
    priceOriginal: 11500,
    priceBundle: 9900,
    savings: 1600,
    savingsPercent: 14,
    bonuses: ["Menu Management", "Table Optimization", "Food Waste Tracking"],
    targetAudience: "Рестораны, кафе, кофейни (10-100 мест)",
    badge: null,
  },
  // ... остальные пакеты
];
```

### Testimonials

```typescript
// src/lib/data/testimonials.ts
export const testimonials = [
  {
    id: 1,
    avatar: "/images/avatars/dmitry.jpg",
    name: "Дмитрий Иванов",
    business: "@TastyBitesRest",
    industry: "Ресторан, Санкт-Петербург",
    subscribers: 3500,
    quote:
      "Booking Bot уменьшил no-show на 30%. Теперь столики всегда заполнены.",
    result: "↑ 30% загрузка",
    rating: 5,
  },
  // ... остальные отзывы
];
```

### FAQ

```typescript
// src/lib/data/faq.ts
export const faqs = [
  {
    id: 1,
    category: "general",
    question: "Что такое AIBRO Business?",
    answer:
      "AIBRO Business — это экосистема AI-инструментов для автоматизации малого и среднего бизнеса, полностью интегрированная в Telegram.",
  },
  // ... остальные вопросы
];
```

## Компоненты (примеры)

### Button

```tsx
// src/components/common/Button.tsx
interface ButtonProps {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "gradient-primary"
    | "gradient-cta"
    | "white"
    | "outline-white";
  size?: "sm" | "md" | "lg" | "xl";
  glow?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

const Button: React.FC = ({
  variant = "primary",
  size = "md",
  glow = false,
  loading = false,
  children,
  onClick,
}) => {
  const baseClasses = "font-semibold rounded-lg transition-all duration-300";

  const variantClasses = {
    primary: "bg-primary-telegram text-white hover:bg-primary-electric",
    "gradient-primary":
      "bg-gradient-to-r from-primary-telegram to-primary-electric text-white",
    "gradient-cta":
      "bg-gradient-to-r from-accent-coral to-primary-neon text-white",
    // ... остальные варианты
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "px-10 py-5 text-xl",
  };

  const glowClass = glow ? "shadow-glow animate-glow-pulse" : "";

  return { loading: children };
};
```

### Card

```tsx
// src/components/common/Card.tsx
interface CardProps {
  variant?: "default" | "glass" | "neumorphic";
  hover?: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC = ({
  variant = "default",
  hover = false,
  children,
  className = "",
  onClick,
}) => {
  const baseClasses = "rounded-2xl transition-all duration-300";

  const variantClasses = {
    default: "bg-white dark:bg-neutral-800 shadow-md",
    glass: "bg-white/10 backdrop-blur-xl border border-white/20",
    neumorphic: "bg-neutral-100 shadow-neumorphic",
  };

  const hoverClass = hover ? "hover:scale-105 hover:shadow-xl" : "";

  return { children };
};
```

### CountUp Animation

```tsx
// src/components/animations/CountUp.tsx
import { useEffect, useState } from 'react';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

interface CountUpProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}

const CountUp: React.FC = ({
  end,
  duration = 2000,
  prefix = '',
  suffix = '',
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isInView, end, duration]);

  return (

      {prefix}{count.toLocaleString()}{suffix}

  );
};
```

## Шаги реализации

### Этап 1: Настройка проекта

1. Создать Vite + React + TypeScript проект
2. Установить зависимости:
   - tailwindcss, postcss, autoprefixer
   - framer-motion
   - @react-three/fiber, @react-three/drei, three
   - i18next, react-i18next, i18next-browser-languagedetector
   - react-hook-form, @hookform/resolvers, zod
   - react-router-dom
   - lucide-react
   - react-google-recaptcha
3. Настроить Tailwind config (цвета, fonts, animations)
4. Настроить i18n config
5. Создать ThemeContext

### Этап 2: Базовые компоненты

1. Button (все варианты)
2. Card (glass, neumorphic)
3. Input, Select, Textarea, Checkbox
4. Modal, Accordion
5. Badge, Loader/Spinner
6. CountUp, TypeAnimation

### Этап 3: Layout компоненты

1. Header (desktop + mobile nav)
2. Footer (4 колонки, responsive)
3. LanguageSwitcher
4. ThemeToggle

### Этап 4: Секции (по порядку)

1. HeroSection (+ 3D object, particles)
2. ProblemSection (4 карточки)
3. SolutionSection (3 преимущества, table)
4. ProductsSection (featured + grid)
5. HowItWorksSection (timeline)
6. PricingSection (4 пакета)
7. SuccessMetricsSection (metrics + carousel)
8. RoadmapSection (timeline)
9. FAQSection (accordion + search)
10. CTASection (форма + Telegram integration)

### Этап 5: 3D элементы (Three.js)

1. HeroObject3D (TorusKnot or custom mesh)
2. ParticleSystem (Telegram-shaped)
3. ProductIcon3D (для карточек)

### Этап 6: Интеграции

1. Telegram Bot API (форма → бот/канал)
2. reCAPTCHA v3
3. Google Analytics 4 (опционально)

### Этап 7: Переводы (i18n)

1. Создать JSON файлы для RU
2. Создать JSON файлы для EN
3. Применить useTranslation во всех компонентах

### Этап 8: Темная тема

1. Настроить CSS variables
2. Протестировать все секции в обеих темах
3. Убедиться в контрастности

### Этап 9: Адаптивность

1. Протестировать все breakpoints
2. Исправить overflow/spacing issues
3. Проверить hamburger menu
4. Проверить форму на mobile

### Этап 10: Оптимизация

1. Lazy loading для секций
2. Image optimization (WebP, srcset)
3. Code splitting
4. Performance audit (Lighthouse)
5. Accessibility audit

## Файлы для создания

### Обязательные

- src/App.tsx (main app)
- src/main.tsx (entry point)
- src/index.css (global styles)
- src/components/sections/\* (все 12 секций)
- src/components/common/\* (все базовые компоненты)
- src/i18n/config.ts + locales
- src/context/ThemeContext.tsx
- tailwind.config.js
- vite.config.ts
- .env (для API keys)

### Конфигурация

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

```javascript
// tailwind.config.js
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // Все цвета из дизайн-системы
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      animation: {
        "gradient-shift": "gradient-x 15s ease infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        "gradient-x": {
          "0%, 100%": { "background-position": "0% 50%" },
          "50%": { "background-position": "100% 50%" },
        },
        "glow-pulse": {
          "0%, 100%": { "box-shadow": "0 0 20px rgba(0, 136, 204, 0.5)" },
          "50%": { "box-shadow": "0 0 40px rgba(0, 136, 204, 0.8)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-20px) rotate(5deg)" },
        },
      },
    },
  },
  plugins: [],
};
```

## Критические требования

### Производительность

- ✅ Lazy load секций (React.lazy + Suspense)
- ✅ Optimize images (WebP, lazy loading)
- ✅ Minimize bundle size (code splitting)
- ✅ Lighthouse score >90

### Accessibility

- ✅ Semantic HTML
- ✅ ARIA labels
- ✅ Keyboard navigation
- ✅ Color contrast (WCAG AA)
- ✅ Alt text для изображений

### SEO

- ✅ Meta tags (title, description, OG)
- ✅ Structured data (JSON-LD)
- ✅ Sitemap.xml
- ✅ Robots.txt

### Security

- ✅ HTTPS only
- ✅ CSP headers
- ✅ reCAPTCHA для формы
- ✅ Sanitize user input
- ✅ Env variables для sensitive data

## Дополнительные фичи (nice-to-have)

- [ ] Анимированный cursor trail
- [ ] Parallax scrolling для некоторых элементов
- [ ] Video backgrounds (opt-in)
- [ ] Easter eggs (скрытые анимации)
- [ ] Confetti при успешной отправке формы
- [ ] Dark/Light mode auto-switch (based on time)
- [ ] Smooth scroll anchors
- [ ] Reading progress bar

## Заглушка для личного кабинета

Добавить в Header:

```tsx

  Личный кабинет (скоро)

```

Создать страницу Dashboard с:

```tsx
const Dashboard = () => (


      🚧
      Личный кабинет в разработке
      Скоро здесь можно будет управлять подписками
      <Button onClick={() => navigate('/')}>На главную


);
```
````
