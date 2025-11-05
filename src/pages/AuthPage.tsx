import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Smartphone, ArrowRight, CheckCircle } from 'lucide-react';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    telegram: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Здесь будет логика авторизации/регистрации
    console.log(isLogin ? 'Login' : 'Register', formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-primary to-bg-secondary flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-electric to-primary-violet p-8 text-center text-white">
            <h1 className="text-3xl font-bold mb-2">
              {isLogin ? 'Вход в аккаунт' : 'Создать аккаунт'}
            </h1>
            <p className="text-white/80">
              {isLogin 
                ? 'Войдите в свой аккаунт для управления подписками' 
                : 'Создайте аккаунт для начала работы с AIBRO Business'}
            </p>
          </div>
          
          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div>
                  <label className="block text-text-secondary font-medium mb-2 flex items-center">
                    <User className="w-4 h-4 mr-2 text-primary-electric" /> Имя
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ваше имя"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-electric focus:border-transparent"
                    required={!isLogin}
                  />
                </div>
              )}
              
              <div>
                <label className="block text-text-secondary font-medium mb-2 flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-primary-electric" /> Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-electric focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-text-secondary font-medium mb-2 flex items-center">
                  <Lock className="w-4 h-4 mr-2 text-primary-electric" /> Пароль
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-electric focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-text-secondary font-medium mb-2 flex items-center">
                  <Smartphone className="w-4 h-4 mr-2 text-primary-violet" /> Telegram-аккаунт
                </label>
                <input
                  type="text"
                  name="telegram"
                  value={formData.telegram}
                  onChange={handleChange}
                  placeholder="@username"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-violet focus:border-transparent"
                  required
                />
              </div>
              
              {isLogin ? (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    className="w-5 h-5 text-primary-electric rounded focus:ring-primary-electric"
                  />
                  <label htmlFor="remember" className="ml-2 text-text-secondary text-sm">
                    Запомнить меня
                  </label>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-text-secondary text-sm">Безопасная передача данных</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-text-secondary text-sm">72-часовой пробный период</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-text-secondary text-sm">Можно отменить в любой момент</span>
                  </div>
                </div>
              )}
              
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-primary-electric to-primary-violet text-white font-bold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center"
              >
                {isLogin ? 'Войти в аккаунт' : 'Создать аккаунт'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary-electric hover:underline font-medium"
              >
                {isLogin 
                  ? 'Нет аккаунта? Зарегистрироваться' 
                  : 'Уже есть аккаунт? Войти'}
              </button>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-text-secondary text-sm">
                Нажимая кнопку, вы соглашаетесь с условиями{' '}
                <a href="/terms" className="text-primary-electric hover:underline">пользования</a>{' '}
                и <a href="/privacy" className="text-primary-electric hover:underline">политикой конфиденциальности</a>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;