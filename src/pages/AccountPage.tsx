import React from 'react';
import { motion } from 'framer-motion';
import { User, CreditCard, TrendingUp, Package, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const AccountPage: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-bg-secondary py-12 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-text-primary mb-4">Доступ запрещен</h1>
          <p className="text-text-secondary mb-8">
            Пожалуйста, войдите в свой аккаунт для доступа к личному кабинету
          </p>
          <Link
            to="/auth"
            className="inline-block bg-gradient-to-r from-primary-electric to-primary-violet text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Войти в аккаунт
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-secondary py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-electric to-primary-violet p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold">Личный кабинет</h1>
                  <p className="text-white/80">Добро пожаловать, {user.name}</p>
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <User className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                <button className="py-4 px-2 border-b-2 border-primary-electric text-primary-electric font-medium">
                  Обзор
                </button>
                <button className="py-4 px-2 text-text-secondary hover:text-text-primary font-medium">
                  Подписки
                </button>
                <button className="py-4 px-2 text-text-secondary hover:text-text-primary font-medium">
                  Платежи
                </button>
                <button className="py-4 px-2 text-text-secondary hover:text-text-primary font-medium">
                  Интеграции
                </button>
                <button className="py-4 px-2 text-text-secondary hover:text-text-primary font-medium">
                  Настройки
                </button>
              </nav>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-primary-electric/10 to-primary-electric/5 p-5 rounded-xl">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary-electric/20 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-primary-electric" />
                      </div>
                      <div className="ml-4">
                        <p className="text-text-secondary text-sm">Активные продукты</p>
                        <p className="text-2xl font-bold text-text-primary">2</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-primary-violet/10 to-primary-violet/5 p-5 rounded-xl">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary-violet/20 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-primary-violet" />
                      </div>
                      <div className="ml-4">
                        <p className="text-text-secondary text-sm">Подписка до</p>
                        <p className="text-2xl font-bold text-text-primary">05.12.2025</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-primary-coral/10 to-primary-coral/5 p-5 rounded-xl">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary-coral/20 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-primary-coral" />
                      </div>
                      <div className="ml-4">
                        <p className="text-text-secondary text-sm">След. платеж</p>
                        <p className="text-2xl font-bold text-text-primary">5,000 ₽</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Active Products */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h2 className="text-xl font-bold text-text-primary mb-4">Активные продукты</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-bg-primary rounded-lg">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-primary-electric/10 rounded-lg flex items-center justify-center mr-4">
                          <TrendingUp className="w-6 h-6 text-primary-electric" />
                        </div>
                        <div>
                          <h3 className="font-bold text-text-primary">AI PostMaster</h3>
                          <p className="text-text-secondary text-sm">Основной продукт</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-text-primary">3,000 ₽/мес</p>
                        <p className="text-text-secondary text-sm">Активна до 05.12.2025</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-bg-primary rounded-lg">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-primary-violet/10 rounded-lg flex items-center justify-center mr-4">
                          <User className="w-6 h-6 text-primary-violet" />
                        </div>
                        <div>
                          <h3 className="font-bold text-text-primary">Conversation Bot</h3>
                          <p className="text-text-secondary text-sm">Горизонтальный продукт</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-text-primary">2,000 ₽/мес</p>
                        <p className="text-text-secondary text-sm">Активна до 05.12.2025</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h2 className="text-lg font-bold text-text-primary mb-4">Быстрые действия</h2>
                  <div className="space-y-3">
                    <button className="w-full text-left p-3 bg-bg-primary hover:bg-bg-secondary rounded-lg transition-colors">
                      Управление подписками
                    </button>
                    <button className="w-full text-left p-3 bg-bg-primary hover:bg-bg-secondary rounded-lg transition-colors">
                      Добавить Telegram-канал
                    </button>
                    <button className="w-full text-left p-3 bg-bg-primary hover:bg-bg-secondary rounded-lg transition-colors">
                      Настроить AI-ассистента
                    </button>
                    <button className="w-full text-left p-3 bg-bg-primary hover:bg-bg-secondary rounded-lg transition-colors">
                      Скачать отчет
                    </button>
                  </div>
                </div>

                {/* Billing */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h2 className="text-lg font-bold text-text-primary mb-4">Платежная информация</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Email</span>
                      <span className="font-medium">{user.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Telegram</span>
                      <span className="font-medium">{user.telegram}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Текущий план</span>
                      <span className="font-medium">Starter</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">След. платеж</span>
                      <span className="font-medium">05.12.2025</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Сумма</span>
                      <span className="font-medium">5,000 ₽/мес</span>
                    </div>
                  </div>
                  <button className="w-full mt-4 py-2 bg-gradient-to-r from-primary-electric to-primary-violet text-white rounded-lg font-medium">
                    Обновить платежную информацию
                  </button>
                </div>

                {/* Logout */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <button
                    onClick={() => {
                      logout();
                      window.location.href = '/';
                    }}
                    className="w-full flex items-center justify-center py-3 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors"
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    Выйти из аккаунта
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AccountPage;
