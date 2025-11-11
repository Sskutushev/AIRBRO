/**
 * @file Integration tests for the AccountPage component.
 * @module pages/__tests__/AccountPage.test
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '../../test/utils'; // Custom render with providers
import AccountPage from '../AccountPage';
import { useAuth } from '../../context/AuthContext';

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
    (useAuth as any).mockReturnValue({ user: mockUser, logout: mockLogout });
    // Mock window.location.href for logout test
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { href: 'http://localhost/' },
    });
  });

  it('should redirect to auth page if user is not logged in', () => {
    (useAuth as any).mockReturnValue({ user: null, logout: mockLogout });
    render(<AccountPage />);

    expect(screen.getByRole('heading', { name: /Access Denied/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Log In/i })).toHaveAttribute('href', '/auth');
  });

  it('should display user information when logged in', () => {
    render(<AccountPage />);

    expect(screen.getByRole('heading', { name: /Account Dashboard/i })).toBeInTheDocument();
    expect(screen.getByText(`Welcome, ${mockUser.name}`)).toBeInTheDocument();
    expect(screen.getByText(mockUser.email)).toBeInTheDocument();
    expect(screen.getByText(mockUser.telegram)).toBeInTheDocument();
  });

  it('should display navigation tabs', () => {
    render(<AccountPage />);

    expect(screen.getByRole('button', { name: /Overview/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Subscriptions/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Payments/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Integrations/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Settings/i })).toBeInTheDocument();
  });

  it('should display stats cards', () => {
    render(<AccountPage />);

    expect(screen.getByRole('heading', { name: /Active Products/i })).toBeInTheDocument();
    expect(screen.getByText(/Subscription until/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Next payment/i)[0]).toBeInTheDocument();
  });

  it('should display active products', () => {
    render(<AccountPage />);

    expect(screen.getByRole('heading', { name: /Active Products/i })).toBeInTheDocument();
    expect(screen.getByText('AI PostMaster')).toBeInTheDocument();
    expect(screen.getByText('Conversation Bot')).toBeInTheDocument();
  });

  it('should display quick actions', () => {
    render(<AccountPage />);

    expect(screen.getByRole('heading', { name: /Quick Actions/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Subscription Management/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Telegram Channel/i })).toBeInTheDocument();
  });

  it('should display billing information', () => {
    render(<AccountPage />);

    expect(screen.getByRole('heading', { name: /Billing Information/i })).toBeInTheDocument();
    expect(screen.getByText(/Current Plan/i)).toBeInTheDocument();
    expect(screen.getByText('Starter')).toBeInTheDocument();
  });

  it('should call logout and redirect on "Log Out" click', () => {
    render(<AccountPage />);
    const logoutButton = screen.getByRole('button', { name: /Log Out/i });
    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(window.location.href).toBe('/'); // Check if href was reset to root
  });
});
