/**
 * @file Integration tests for the AccountPage component.
 * @module pages/__tests__/AccountPage.test
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../test/utils'; // Custom render with providers
import AccountPage from '../AccountPage';
import { useAuth } from '../../context/AuthContext';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../../lib/queryClient';

// Mock react-router-dom's useNavigate and Link
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
      <a href={to}>{children}</a>
    ),
  };
});

// Mock useAuth hook and AuthProvider
vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>, // Mock AuthProvider
}));

describe('AccountPage', () => {
  const mockUser = {
    id: 'user123',
    name: 'Test User',
    email: 'test@example.com',
    telegram: '@testuser',
  };
  const mockLogout = vi.fn();

  beforeEach(() => {
    mockNavigate.mockClear();
    mockLogout.mockClear();
    (useAuth as vi.Mock).mockReturnValue({ user: mockUser, logout: mockLogout });
    // Mock window.location.href for logout test
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { href: 'http://localhost/' },
    });
  });

  it('should redirect to auth page if user is not logged in', () => {
    (useAuth as vi.Mock).mockReturnValue({ user: null, logout: mockLogout });
    render(<AccountPage />);

    expect(screen.getByRole('heading', { name: /Доступ запрещен/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Войти в аккаунт/i })).toHaveAttribute('href', '/auth');
  });

  it('should display user information when logged in', () => {
    render(<AccountPage />);

    expect(screen.getByRole('heading', { name: /Личный кабинет/i })).toBeInTheDocument();
    expect(screen.getByText(`Добро пожаловать, ${mockUser.name}`)).toBeInTheDocument();
    expect(screen.getByText(mockUser.email)).toBeInTheDocument();
    expect(screen.getByText(mockUser.telegram)).toBeInTheDocument();
  });

  it('should display navigation tabs', () => {
    render(<AccountPage />);

    expect(screen.getByRole('button', { name: /Обзор/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Подписки/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Платежи/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Интеграции/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Настройки/i })).toBeInTheDocument();
  });

  it('should display stats cards', () => {
    render(<AccountPage />);

    expect(screen.getByRole('heading', { name: /Активные продукты/i })).toBeInTheDocument();
    expect(screen.getByText('Подписка до')).toBeInTheDocument();
    expect(screen.getAllByText('След. платеж')[0]).toBeInTheDocument();
  });

  it('should display active products', () => {
    render(<AccountPage />);

    expect(screen.getByRole('heading', { name: /Активные продукты/i })).toBeInTheDocument();
    expect(screen.getByText('AI PostMaster')).toBeInTheDocument();
    expect(screen.getByText('Conversation Bot')).toBeInTheDocument();
  });

  it('should display quick actions', () => {
    render(<AccountPage />);

    expect(screen.getByRole('heading', { name: /Быстрые действия/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Управление подписками/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Добавить Telegram-канал/i })).toBeInTheDocument();
  });

  it('should display billing information', () => {
    render(<AccountPage />);

    expect(screen.getByRole('heading', { name: /Платежная информация/i })).toBeInTheDocument();
    expect(screen.getByText('Текущий план')).toBeInTheDocument();
    expect(screen.getByText('Starter')).toBeInTheDocument();
  });

  it('should call logout and redirect on "Выйти из аккаунта" click', () => {
    render(<AccountPage />);
    const logoutButton = screen.getByRole('button', { name: /Выйти из аккаунта/i });
    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(window.location.href).toBe('/'); // Check if href was reset to root
  });
});
