import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { SubscriptionProvider } from './context/SubscriptionContext';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/sections/Header';
import HeroSection from './components/sections/HeroSection';
import ProblemSection from './components/sections/ProblemSection';
import SolutionSection from './components/sections/SolutionSection';
import ProductsSection from './components/sections/ProductsSection';
import HowItWorksSection from './components/sections/HowItWorksSection';
import PricingSection from './components/sections/PricingSection';
import SuccessMetricsSection from './components/sections/SuccessMetricsSection';
import RoadmapSection from './components/sections/RoadmapSection';
import FAQSection from './components/sections/FAQSection';
import CTASection from './components/sections/CTASection';
import Footer from './components/sections/Footer';
import AccountPage from './pages/AccountPage';
import PaymentPage from './pages/PaymentPage';
import AuthPage from './pages/AuthPage';
import './i18n/config'; // Импортируем конфигурацию i18n

// Компонент для обработки якорных ссылок
function ScrollToAnchor() {
  const location = useLocation();

  useEffect(() => {
    // Если есть хэш в URL, прокручиваем к элементу
    if (location.hash) {
      const element = document.getElementById(location.hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    // Если нет хэша, не меняем позицию прокрутки
  }, [location]);

  return null;
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SubscriptionProvider>
          <Router>
            <div className="min-h-screen flex flex-col App">
              <div className="flex-1">
                <Routes>
                  <Route path="/" element={
                    <>
                      <Header />
                      <ScrollToAnchor />
                      <HeroSection />
                      <ProblemSection />
                      <SolutionSection />
                      <ProductsSection />
                      <HowItWorksSection />
                      <PricingSection />
                      <SuccessMetricsSection />
                      <RoadmapSection />
                      <FAQSection />
                      <CTASection />
                    </>
                  } />
                  <Route path="/account" element={<AccountPage />} />
                  <Route path="/payment" element={<PaymentPage />} />
                  <Route path="/auth" element={<AuthPage />} />
                </Routes>
              </div>
              <Footer />
            </div>
          </Router>
        </SubscriptionProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;