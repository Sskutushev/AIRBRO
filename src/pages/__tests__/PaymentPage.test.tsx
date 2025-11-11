/**
 * @file Integration tests for the PaymentPage component.
 * @module pages/__tests__/PaymentPage.test
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../test/utils'; // Custom render with providers
import PaymentPage from '../PaymentPage';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../context/SubscriptionContext';
import * as paymentService from '../../services/paymentService'; // Import all from paymentService

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

// Mock useSubscription hook
vi.mock('../../context/SubscriptionContext', () => ({
  useSubscription: vi.fn(),
}));

// Mock paymentService functions
vi.mock('../../services/paymentService', () => ({
  createPaymentIntent: vi.fn(),
  confirmPayment: vi.fn(),
  createTelegramPayment: vi.fn(),
}));

describe('PaymentPage', () => {
  const mockUser = {
    id: 'user123',
    name: 'Test User',
    email: 'test@example.com',
    telegram: '@testuser',
  };
  const mockPlan = {
    id: 'pro',
    name: 'Pro Plan',
    price: 5000,
    description: 'Pro plan description',
    features: ['Feature 1', 'Feature 2'],
  };
  const mockSubscriptionPlans = [mockPlan];
  const mockSubscribeToPlan = vi.fn();

  beforeEach(() => {
    mockNavigate.mockClear();
    mockSubscribeToPlan.mockClear();
    (useAuth as any).mockReturnValue({ user: mockUser });
    (useSubscription as any).mockReturnValue({
      subscriptionPlans: mockSubscriptionPlans,
      subscribeToPlan: mockSubscribeToPlan,
    });
    (paymentService.createPaymentIntent as any).mockClear();
    (paymentService.confirmPayment as any).mockClear();
    (paymentService.createTelegramPayment as any).mockClear();
    // Mock window.location.href for Telegram payment redirect
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { href: 'http://localhost/' },
    });
  });

  it('should redirect to auth page if user is not logged in', () => {
    (useAuth as any).mockReturnValue({ user: null });
    render(<PaymentPage />);
    expect(mockNavigate).toHaveBeenCalledWith('/auth');
  });

  it('should display access denied message if user is not logged in and plan is not found', () => {
    (useAuth as any).mockReturnValue({ user: null });
    (useSubscription as any).mockReturnValue({
      subscriptionPlans: [], // No plans
      subscribeToPlan: mockSubscribeToPlan,
    });
    render(<PaymentPage />);
    expect(screen.getByRole('heading', { name: /Access Denied/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Log In/i })).toHaveAttribute('href', '/auth');
  });

  it('should display selected plan details', () => {
    render(<PaymentPage />);
    expect(screen.getByText(/Selected Plan/i)).toBeInTheDocument();
    expect(screen.getByText(mockPlan.name)).toBeInTheDocument();
    expect(screen.getByText('Pro Plan')).toBeInTheDocument();
    // Find element by content and class at the same time
    const priceElement = screen.getByText((content, element) => {
      const hasPrice = content.includes('5') && content.includes('000');
      const hasCurrency = element?.textContent?.includes('₽');
      const hasCorrectClass = element?.classList.contains('text-2xl');
      return Boolean(hasPrice && hasCurrency && hasCorrectClass);
    });
    expect(priceElement).toBeInTheDocument();
  });

  it('should switch payment methods', () => {
    render(<PaymentPage />);
    expect(screen.getByRole('button', { name: /Bank Card/i })).toHaveClass('border-b-2');
    expect(screen.getByLabelText(/Card Number/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Telegram Pay/i }));
    expect(screen.getByRole('button', { name: /Telegram Pay/i })).toHaveClass('border-b-2');
    expect(screen.getByRole('heading', { name: /Telegram Payment/i })).toBeInTheDocument();
  });

  describe('Card Payment', () => {
    it('should process card payment successfully', async () => {
      (paymentService.createPaymentIntent as any).mockResolvedValue({
        success: true,
        paymentIntent: { id: 'pi_123' },
      });
      (paymentService.confirmPayment as any).mockResolvedValue({ success: true });
      render(<PaymentPage />);

      fireEvent.change(screen.getByLabelText(/Card Number/i), {
        target: { value: '1111222233334444' },
      });
      fireEvent.change(screen.getByLabelText(/Expiration Date/i), { target: { value: '12/25' } });
      fireEvent.change(screen.getByLabelText(/CVV/i), { target: { value: '123' } });
      fireEvent.change(screen.getByLabelText(/Cardholder Name/i), {
        target: { value: 'Test User' },
      });

      fireEvent.click(screen.getByRole('button', { name: /Pay.*₽/i }));

      await waitFor(() => {
        expect(paymentService.createPaymentIntent).toHaveBeenCalledWith(
          mockPlan.price,
          'RUB',
          'card'
        );
        expect(paymentService.confirmPayment).toHaveBeenCalledWith('pi_123', 'card');
        expect(mockSubscribeToPlan).toHaveBeenCalledWith(mockPlan.id);
        expect(
          screen.getByRole('heading', { name: /Payment Processed Successfully!/i })
        ).toBeInTheDocument();
      });
    });

    it('should show error message if card payment fails', async () => {
      (paymentService.createPaymentIntent as any).mockResolvedValue({
        success: true,
        paymentIntent: { id: 'pi_123' },
      });
      (paymentService.confirmPayment as any).mockResolvedValue({
        success: false,
        error: 'Card declined',
      });

      render(<PaymentPage />);

      fireEvent.change(screen.getByLabelText(/Card Number/i), {
        target: { value: '1111222233334444' },
      });
      fireEvent.change(screen.getByLabelText(/Expiration Date/i), { target: { value: '12/25' } });
      fireEvent.change(screen.getByLabelText(/CVV/i), { target: { value: '123' } });
      fireEvent.change(screen.getByLabelText(/Cardholder Name/i), {
        target: { value: 'Test User' },
      });

      fireEvent.click(screen.getByRole('button', { name: /Pay.*₽/i }));

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /Payment Error/i })).toBeInTheDocument();
        expect(screen.getByText('Card declined')).toBeInTheDocument();
      });
    });
  });

  describe('Telegram Payment', () => {
    it('should initiate Telegram payment and redirect', async () => {
      (paymentService.createTelegramPayment as any).mockResolvedValue({
        success: true,
        redirectUrl: 'https://t.me/bot?start=payload',
      });

      render(<PaymentPage />);
      fireEvent.click(screen.getByRole('button', { name: /Telegram Pay/i }));
      fireEvent.click(screen.getByRole('button', { name: /Proceed to Payment/i }));

      await waitFor(() => {
        expect(window.location.href).toBe('https://t.me/bot?start=payload');
        // The success message might not be visible immediately after redirect
        // Let's check if the service was called
        expect(paymentService.createTelegramPayment).toHaveBeenCalled();
      });
    });

    it('should show error message if Telegram payment fails', async () => {
      (paymentService.createTelegramPayment as any).mockResolvedValue({
        success: false,
        error: 'Telegram payment failed',
      });

      render(<PaymentPage />);
      fireEvent.click(screen.getByRole('button', { name: /Telegram Pay/i }));
      fireEvent.click(screen.getByRole('button', { name: /Proceed to Payment/i }));

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /Payment Error/i })).toBeInTheDocument();
        expect(screen.getByText('Telegram payment failed')).toBeInTheDocument();
      });
    });
  });

  it('should allow retrying payment after an error', async () => {
    (paymentService.createPaymentIntent as any).mockResolvedValue({
      success: true,
      paymentIntent: { id: 'pi_123' },
    });
    (paymentService.confirmPayment as any).mockResolvedValue({
      success: false,
      error: 'Card declined',
    });

    render(<PaymentPage />);

    fireEvent.change(screen.getByLabelText(/Card Number/i), {
      target: { value: '1111222233334444' },
    });
    fireEvent.change(screen.getByLabelText(/Expiration Date/i), { target: { value: '12/25' } });
    fireEvent.change(screen.getByLabelText(/CVV/i), { target: { value: '123' } });
    fireEvent.change(screen.getByLabelText(/Cardholder Name/i), { target: { value: 'Test User' } });

    fireEvent.click(screen.getByRole('button', { name: /Pay.*₽/i }));

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Payment Error/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /Try Again/i }));
    expect(screen.queryByRole('heading', { name: /Payment Error/i })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Subscribe/i })).toBeInTheDocument();
  });
});
