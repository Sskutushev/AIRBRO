import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from './lib/toast';
import { AuthProvider } from './context/AuthContext';
import { SubscriptionProvider } from './context/SubscriptionContext';
import { ThemeProvider } from './context/ThemeContext';
import { ErrorProvider } from './context/ErrorContext';
import { queryClient } from './lib/queryClient';
import { analytics } from './lib/analytics';
import Header from './components/sections/Header';
import HeroSection from './components/sections/HeroSection';
import Footer from './components/sections/Footer';
// Lazy load sections
const ProblemSection = lazy(() => import('./components/sections/ProblemSection'));
const SolutionSection = lazy(() => import('./components/sections/SolutionSection'));
const ProductsSection = lazy(() => import('./components/sections/ProductsSection'));
const HowItWorksSection = lazy(() => import('./components/sections/HowItWorksSection'));
const PricingSection = lazy(() => import('./components/sections/PricingSection'));
const SuccessMetricsSection = lazy(() => import('./components/sections/SuccessMetricsSection'));
const RoadmapSection = lazy(() => import('./components/sections/RoadmapSection'));
const FAQSection = lazy(() => import('./components/sections/FAQSection'));
const CTASection = lazy(() => import('./components/sections/CTASection'));
// import AccountPage from './pages/AccountPage'; // Lazy loaded
// import PaymentPage from './pages/PaymentPage'; // Lazy loaded
// import AuthPage from './pages/AuthPage';     // Lazy loaded
import './i18n/config'; // Init i18n config
import GlobalApiErrorBoundary from './components/GlobalApiErrorBoundary'; // Use the new GlobalApiErrorBoundary

// Lazy load pages
const AccountPage = lazy(() => import('./pages/AccountPage'));
const PaymentPage = lazy(() => import('./pages/PaymentPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));

// Loader component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

// Handle anchor links
function ScrollToAnchor() {
  const location = useLocation();

  useEffect(() => {
    // Scroll to element if hash exists
    if (location.hash) {
      const element = document.getElementById(location.hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    // Don't change scroll if no hash
  }, [location]);

  return null;
}

// Track page views
function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    analytics.init();
  }, []);

  useEffect(() => {
    analytics.trackPageView(location.pathname);
  }, [location]);

  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GlobalApiErrorBoundary>
        {' '}
        {/* Use GlobalApiErrorBoundary here */}
        <ErrorProvider>
          <ThemeProvider>
            <AuthProvider>
              <SubscriptionProvider>
                <Router>
                  <div className="min-h-screen flex flex-col App">
                    <div className="flex-1">
                      <Suspense fallback={<PageLoader />}>
                        <Routes>
                          <Route
                            path="/"
                            element={
                              <>
                                <AnalyticsTracker />
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
                            }
                          />
                          <Route
                            path="/account"
                            element={
                              <>
                                <AnalyticsTracker />
                                <AccountPage />
                              </>
                            }
                          />
                          <Route
                            path="/payment"
                            element={
                              <>
                                <AnalyticsTracker />
                                <PaymentPage />
                              </>
                            }
                          />
                          <Route
                            path="/auth"
                            element={
                              <>
                                <AnalyticsTracker />
                                <AuthPage />
                              </>
                            }
                          />
                        </Routes>
                      </Suspense>
                    </div>
                    <Footer />
                  </div>
                </Router>
              </SubscriptionProvider>
            </AuthProvider>
          </ThemeProvider>
        </ErrorProvider>
        <Toaster />
      </GlobalApiErrorBoundary>{' '}
      {/* Close GlobalApiErrorBoundary */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
