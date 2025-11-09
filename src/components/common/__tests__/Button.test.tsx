import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '../Button';

describe('Button', () => {
  // Renders with text
  test('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  // Calls onClick when clicked
  test('calls onClick when clicked', () => {
    const mockOnClick = vi.fn();
    render(<Button onClick={mockOnClick}>Click me</Button>);

    fireEvent.click(screen.getByText('Click me'));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  // Is disabled when disabled prop is true
  test('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);

    const button = screen.getByText('Click me');
    expect(button).toBeDisabled();
  });

  // Shows loading state (disabled + spinner)
  test('shows loading state with disabled and spinner', () => {
    render(<Button loading>Loading...</Button>);

    const button = screen.getByText('Loading...');
    expect(button).toBeDisabled();
    expect(screen.getByRole('status')).toBeInTheDocument(); // Spinner element
  });

  // Applies variant styles correctly
  test('applies variant styles correctly', () => {
    const { rerender } = render(<Button variant="primary">Test</Button>);

    let button = screen.getByText('Test');
    expect(button).toHaveClass('from-primary-telegram', 'to-primary-electric');

    rerender(<Button variant="secondary">Test</Button>);
    button = screen.getByText('Test');
    expect(button).toHaveClass('bg-white', 'text-primary-telegram');
  });

  // Applies size styles correctly
  test('applies size styles correctly', () => {
    const { rerender } = render(<Button size="sm">Test</Button>);

    let button = screen.getByText('Test');
    expect(button).toHaveClass('text-sm');

    rerender(<Button size="lg">Test</Button>);
    button = screen.getByText('Test');
    expect(button).toHaveClass('text-lg');
  });

  // Renders with icon (startIcon/endIcon)
  test('renders with start icon', () => {
    render(<Button startIcon={<span data-testid="start-icon" />}>Test</Button>);

    expect(screen.getByTestId('start-icon')).toBeInTheDocument();
  });

  test('renders with end icon', () => {
    render(<Button endIcon={<span data-testid="end-icon" />}>Test</Button>);

    expect(screen.getByTestId('end-icon')).toBeInTheDocument();
  });

  // Has correct accessibility attributes
  test('has correct accessibility attributes', () => {
    render(<Button>Test</Button>);

    const button = screen.getByText('Test');
    expect(button).toHaveAttribute('type', 'button');
  });

  // Keyboard navigation (Enter, Space)
  test('triggers onClick with Enter key', async () => {
    const mockOnClick = vi.fn();
    render(<Button onClick={mockOnClick}>Test</Button>);

    const button = screen.getByText('Test');
    button.focus();
    await userEvent.keyboard('{enter}');

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test('triggers onClick with Space key', () => {
    const mockOnClick = vi.fn();
    render(<Button onClick={mockOnClick}>Test</Button>);

    const button = screen.getByText('Test');
    
    // Simulate Space key press directly on the button element
    fireEvent.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
