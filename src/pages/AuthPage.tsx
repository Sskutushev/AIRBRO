/**
 * @file Authentication page for user login and registration.
 * @module pages/AuthPage
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Smartphone, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { analytics } from '../lib/analytics';
// import { useAuth } from '../context/AuthContext';
import { useLogin, useRegister } from '../hooks/useAuth';
// import { showToast } from '../lib/toast';
import { loginSchema, registerSchema } from '../lib/validation/auth';
import type { LoginInput, RegisterInput } from '../lib/validation/auth';
import { FormInput } from '../components/forms/FormInput';
import { FormCheckbox } from '../components/forms/FormCheckbox';

/**
 * The authentication page component, allowing users to log in or register.
 * It features tab-based switching between login and registration forms,
 * integrated with React Hook Form and Zod for validation, and React Query hooks for API calls.
 * @returns {JSX.Element} The rendered authentication page.
 */
const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility toggle
  const navigate = useNavigate();
  // const { user } = useAuth(); // Assuming useAuth provides user context

  // React Hook Form setup for Login
  const loginForm = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur', // Enable real-time validation on blur
  });

  // React Hook Form setup for Registration
  const registerForm = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur', // Enable real-time validation on blur
  });

  // Custom React Query hooks for authentication mutations
  const loginMutation = useLogin();
  const registerMutation = useRegister();

  // Destructure login form methods and state
  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors, isSubmitting: isLoginSubmitting },
    setError: setLoginError,
  } = loginForm;

  // Destructure registration form methods and state
  const {
    register: registerRegister,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors, isSubmitting: isRegisterSubmitting },
    setError: setRegisterError,
    watch: registerWatch, // Used to watch password field for strength indicator
  } = registerForm;

  const passwordValue = registerWatch('password'); // Watch password field for strength calculation

  /**
   * Handles the submission of the login form.
   * @param {LoginInput} data - The validated login form data.
   */
  const onLoginSubmit = async (data: LoginInput) => {
    try {
      const result = await loginMutation.mutateAsync(data);
      analytics.trackLogin('email'); // Track login event
      if (result.user?.id) analytics.setUserId(result.user.id); // Set user ID for analytics
      navigate('/account'); // Redirect to account page on success
      // showToast.success is handled within useLogin hook
    } catch (error: any) {
      setLoginError('root', { message: error.message || 'Ошибка входа' });
      // showToast.error is handled within useLogin hook
    }
  };

  /**
   * Handles the submission of the registration form.
   * @param {RegisterInput} data - The validated registration form data.
   */
  const onRegisterSubmit = async (data: RegisterInput) => {
    try {
      const result = await registerMutation.mutateAsync(data);
      analytics.trackSignUp('email'); // Track sign-up event
      if (result.user?.id) analytics.setUserId(result.user.id); // Set user ID for analytics
      navigate('/account'); // Redirect to account page on success
      // showToast.success is handled within useRegister hook
    } catch (error: any) {
      setRegisterError('root', { message: error.message || 'Ошибка регистрации' });
      // showToast.error is handled within useRegister hook
    }
  };

  /**
   * Calculates the strength of a given password based on various criteria.
   * @param {string} password - The password string to evaluate.
   * @returns {{ level: 'none' | 'weak' | 'medium' | 'strong'; text: string; color: string; }} An object indicating password strength.
   */
  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 2) return { level: 'weak', text: 'Слабый', color: 'bg-red-500' };
    if (strength <= 3) return { level: 'medium', text: 'Средний', color: 'bg-yellow-500' };
    if (strength >= 4) return { level: 'strong', text: 'Сильный', color: 'bg-green-500' };
    return { level: 'none', text: '', color: 'bg-gray-300' };
  };

  const passwordStrength = calculatePasswordStrength(passwordValue || '');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 relative">
      {/* Back button */}
      <Link
        to="/"
        className="absolute top-8 left-8 text-gray-700 dark:text-gray-300 bg-white/20 dark:bg-gray-700/50 p-2 rounded-full hover:bg-white/30 dark:hover:bg-gray-700 transition-colors z-10"
      >
        <ArrowLeft className="w-6 h-6" />
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-8 text-center text-white">
            <h1 className="text-3xl font-bold mb-2">
              {isLogin ? 'Вход в аккаунт' : 'Создать аккаунт'}
            </h1>
            <p className="text-white/80">
              {isLogin
                ? 'Войдите в свой аккаунт для управления подписками'
                : 'Создайте аккаунт для начала работы с AIBRO Business'}
            </p>
          </div>

          {/* Auth Tabs */}
          <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg mx-4 mt-6">
            <button
              className={`flex-1 py-2 px-4 rounded-md text-center font-medium transition-colors ${
                isLogin
                  ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
              onClick={() => setIsLogin(true)}
            >
              Войти
            </button>
            <button
              className={`flex-1 py-2 px-4 rounded-md text-center font-medium transition-colors ${
                !isLogin
                  ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
              onClick={() => setIsLogin(false)}
            >
              Регистрация
            </button>
          </div>

          {/* Form */}
          <div className="p-8">
            {isLogin ? (
              <form onSubmit={handleLoginSubmit(onLoginSubmit)} className="space-y-6">
                <FormInput<LoginInput>
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="your@email.com"
                  register={loginRegister}
                  errors={loginErrors}
                  required
                  startIcon={<Mail className="w-4 h-4" />}
                />

                <FormInput<LoginInput>
                  name="password"
                  label="Пароль"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  register={loginRegister}
                  errors={loginErrors}
                  required
                  startIcon={<Lock className="w-4 h-4" />}
                  showPasswordToggle={true}
                  isPasswordShown={showPassword}
                  onPasswordToggle={() => setShowPassword(!showPassword)}
                />

                <div className="flex items-center justify-between">
                  <FormCheckbox<any>
                    name="remember"
                    label="Запомнить меня"
                    register={loginRegister as any}
                    errors={loginErrors}
                  />
                  <a
                    href="/forgot-password"
                    className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Забыли пароль?
                  </a>
                </div>

                {loginErrors.root && (
                  <div className="text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg text-sm">
                    {loginErrors.root.message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoginSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-700 text-white font-bold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center disabled:opacity-70"
                >
                  {isLoginSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Вход...
                    </>
                  ) : (
                    <>
                      Войти в аккаунт
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit(onRegisterSubmit)} className="space-y-6">
                <FormInput<RegisterInput>
                  name="name"
                  label="Имя"
                  type="text"
                  placeholder="Ваше имя"
                  register={registerRegister}
                  errors={registerErrors}
                  required
                  startIcon={<User className="w-4 h-4" />}
                />

                <FormInput<RegisterInput>
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="your@email.com"
                  register={registerRegister}
                  errors={registerErrors}
                  required
                  startIcon={<Mail className="w-4 h-4" />}
                />

                <FormInput<RegisterInput>
                  name="telegram"
                  label="Telegram-аккаунт"
                  type="text"
                  placeholder="@username"
                  register={registerRegister}
                  errors={registerErrors}
                  required
                  startIcon={<Smartphone className="w-4 h-4" />}
                />

                <div className="space-y-2">
                  <FormInput<RegisterInput>
                    name="password"
                    label="Пароль"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    register={registerRegister}
                    errors={registerErrors}
                    required
                    startIcon={<Lock className="w-4 h-4" />}
                    showPasswordToggle={true}
                    isPasswordShown={showPassword}
                    onPasswordToggle={() => setShowPassword(!showPassword)}
                  />

                  {/* Password strength indicator */}
                  {passwordValue && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-700 dark:text-gray-300">
                        <span>Сила пароля:</span>
                        <span className={passwordStrength.color.replace('bg-', 'text-')}>
                          {passwordStrength.text}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${passwordStrength.color} transition-all duration-300`}
                          style={{
                            width: `${passwordStrength.level === 'none' ? 0 : passwordStrength.level === 'weak' ? 33 : passwordStrength.level === 'medium' ? 66 : 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                <FormInput<RegisterInput>
                  name="confirmPassword"
                  label="Подтвердите пароль"
                  type="password"
                  placeholder="••••••••"
                  register={registerRegister}
                  errors={registerErrors}
                  required
                  startIcon={<Lock className="w-4 h-4" />}
                />

                {registerErrors.root && (
                  <div className="text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg text-sm">
                    {registerErrors.root.message}
                  </div>
                )}

                <FormCheckbox<RegisterInput>
                  name="agreement"
                  label=""
                  register={registerRegister}
                  errors={registerErrors}
                  required
                />

                <button
                  type="submit"
                  disabled={isRegisterSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-700 text-white font-bold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center disabled:opacity-70"
                >
                  {isRegisterSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Регистрация...
                    </>
                  ) : (
                    <>
                      Создать аккаунт
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </button>
              </form>
            )}

            <div className="mt-6 text-center">
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-blue-600 hover:underline font-medium ml-1 dark:text-blue-400"
                >
                  {isLogin ? 'Зарегистрироваться' : 'Войти'}
                </button>
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Нажимая кнопку, вы соглашаетесь с условиями{' '}
                <a href="/terms" className="text-blue-600 hover:underline dark:text-blue-400">
                  пользования
                </a>{' '}
                и{' '}
                <a href="/privacy" className="text-blue-600 hover:underline dark:text-blue-400">
                  политикой конфиденциальности
                </a>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
