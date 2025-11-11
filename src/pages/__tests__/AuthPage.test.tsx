/**
 * @file Integration tests for the AuthPage component.
 * @module pages/__tests__/AuthPage.test
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../test/utils'; // Custom render with providers
import AuthPage from '../AuthPage';
import { useLogin, useRegister } from '../../hooks/useAuth';
import { showToast } from '../../lib/toast';

// Mock react-router-dom's useNavigate
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

// Mock useLogin and useRegister hooks
vi.mock('../../hooks/useAuth', () => ({
  useLogin: vi.fn(),
  useRegister: vi.fn(),
}));

// Mock showToast
vi.mock('../../lib/toast', () => ({
  showToast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('AuthPage', () => {
  const mockLoginMutation = {
    mutateAsync: vi.fn(),
    isPending: false,
  };
  const mockRegisterMutation = {
    mutateAsync: vi.fn(),
    isPending: false,
  };

  beforeEach(() => {
    mockNavigate.mockClear();
    mockLoginMutation.mutateAsync.mockClear();
    mockRegisterMutation.mutateAsync.mockClear();
    (useLogin as any).mockReturnValue(mockLoginMutation);
    (useRegister as any).mockReturnValue(mockRegisterMutation);
    (showToast.success as any).mockClear();
    (showToast.error as any).mockClear();
  });

  it('should render login form by default', () => {
    render(<AuthPage />);
    expect(screen.getByRole('heading', { name: /Log In to Account/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Log In to Account/i })).toBeInTheDocument();
  });

  it('should switch to registration form when "Регистрация" tab is clicked', () => {
    render(<AuthPage />);
    fireEvent.click(screen.getByRole('button', { name: /Register/i }));
    expect(screen.getByRole('heading', { name: /Create Account/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Telegram Account/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Account/i })).toBeInTheDocument();
  });

  it('should show validation errors for login form', async () => {
    render(<AuthPage />);
    fireEvent.click(screen.getByRole('button', { name: /Log In to Account/i }));

    await waitFor(() => {
      expect(screen.getByText('Email обязателен')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });
  });

  it('should call login mutation on valid login submission', async () => {
    mockLoginMutation.mutateAsync.mockResolvedValue({ user: { id: '123' }, token: 'abc' });
    render(<AuthPage />);

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Пароль/i), { target: { value: 'Password123!' } });
    fireEvent.click(screen.getByRole('button', { name: /Log In to Account/i }));

    await waitFor(() => {
      expect(mockLoginMutation.mutateAsync).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'Password123!',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/account');
      // showToast.success is called inside useLogin hook, so we don't expect it here directly
    });
  });

  it('should display login error message from mutation', async () => {
    mockLoginMutation.mutateAsync.mockRejectedValue(new Error('Invalid credentials'));
    render(<AuthPage />);

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Пароль/i), { target: { value: 'Password123!' } });
    fireEvent.click(screen.getByRole('button', { name: /Log In to Account/i }));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
      // showToast.error is called inside useLogin hook, so we don't expect it here directly
    });
  });

  it('should show validation errors for registration form', async () => {
    render(<AuthPage />);
    fireEvent.click(screen.getByRole('button', { name: /Register/i }));
    fireEvent.click(screen.getByRole('button', { name: /Создать аккаунт/i }));

    expect(await screen.findByText('Name is required')).toBeInTheDocument();
    expect(await screen.findByText('Email is required')).toBeInTheDocument();
    expect(await screen.findByText('Telegram account is required')).toBeInTheDocument();
    expect(await screen.findByText('Password must be at least 8 characters')).toBeInTheDocument();
    expect(await screen.findByText('Confirm password is required')).toBeInTheDocument();
  });

  it('should call register mutation on valid registration submission', async () => {
    mockRegisterMutation.mutateAsync.mockResolvedValue({ user: { id: '456' }, token: 'def' });
    render(<AuthPage />);
    fireEvent.click(screen.getByRole('button', { name: /Register/i }));

    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/Telegram Account/i), { target: { value: '@johndoe' } });
    fireEvent.change(screen.getByLabelText(/Password/i, { selector: 'input[name="password"]' }), {
      target: { value: 'StrongPass123!' },
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: 'StrongPass123!' },
    });
    // Check the agreement checkbox - it should be present as a checkbox now
    const agreementCheckbox = screen.getByRole('checkbox');
    fireEvent.click(agreementCheckbox);
    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

    await waitFor(() => {
      expect(mockRegisterMutation.mutateAsync).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        telegram: '@johndoe',
        password: 'StrongPass123!',
        confirmPassword: 'StrongPass123!',
        agreement: true,
      });
      expect(mockNavigate).toHaveBeenCalledWith('/account');
      // showToast.success is called inside useRegister hook
    });
  });

  it('should display registration error message from mutation', async () => {
    mockRegisterMutation.mutateAsync.mockRejectedValue(new Error('Email already registered'));
    render(<AuthPage />);
    fireEvent.click(screen.getByRole('button', { name: /Register/i }));

    fireEvent.change(screen.getByLabelText(/Имя/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/Telegram Account/i), { target: { value: '@johndoe' } });
    fireEvent.change(screen.getByLabelText(/Password/i, { selector: 'input[name="password"]' }), {
      target: { value: 'StrongPass123!' },
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: 'StrongPass123!' },
    });
    // Check the agreement checkbox
    const agreementCheckbox = screen.getByRole('checkbox');
    fireEvent.click(agreementCheckbox);
    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

    await waitFor(() => {
      expect(screen.getByText('Email already registered')).toBeInTheDocument();
      // showToast.error is called inside useRegister hook
    });
  });

  it('should toggle password visibility', async () => {
    render(<AuthPage />);
    const passwordInput = screen.getByLabelText(/Password/i, {
      selector: 'input[name="password"]',
    });
    // The toggle button is inside the password input component and uses an aria-label
    const toggleButton = screen.getByRole('button', { name: 'Show password' });

    expect(passwordInput).toHaveAttribute('type', 'password');
    fireEvent.click(toggleButton);
    await waitFor(() => {
      expect(passwordInput).toHaveAttribute('type', 'text');
      expect(screen.getByRole('button', { name: 'Hide password' })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: 'Hide password' }));
    await waitFor(() => {
      expect(passwordInput).toHaveAttribute('type', 'password');
    });
  });

  it('should display password strength indicator for registration form', async () => {
    render(<AuthPage />);
    fireEvent.click(screen.getByRole('button', { name: /Register/i }));

    const passwordInput = screen.getByLabelText(/Password/i, {
      selector: 'input[name="password"]',
    });

    fireEvent.change(passwordInput, { target: { value: 'weak' } });
    await waitFor(() => {
      expect(screen.getByText('Weak')).toBeInTheDocument();
    });

    fireEvent.change(passwordInput, { target: { value: 'Medium1' } });
    await waitFor(() => {
      expect(screen.getByText('Medium')).toBeInTheDocument();
    });

    fireEvent.change(passwordInput, { target: { value: 'StrongPass1!' } });
    await waitFor(() => {
      expect(screen.getByText('Strong')).toBeInTheDocument();
    });
  });
});
