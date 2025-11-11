/**
 * @file Integration tests for the SolutionsPage component.
 * @module pages/__tests__/SolutionsPage.test
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'; // Custom render with providers
import SolutionsPage from '../SolutionsPage';
import { solutionsData } from '../../lib/solutionsData'; // Mock solutionsData
import SolutionDetailModal from '../../components/sections/SolutionDetailModal'; // Mock SolutionDetailModal

// Mock react-router-dom's useLocation and Link
const mockUseLocation = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useLocation: () => mockUseLocation(),
    Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
      <a href={to}>{children}</a>
    ),
  };
});

// Mock solutionsData
vi.mock('../../lib/solutionsData', () => ({
  solutionsData: [
    {
      id: 'solution1',
      name: 'Solution One',
      icon: '/images/icon1.png',
      category: 'Category A',
      problem: 'Problem A',
      solution: 'Solution A',
      result: 'Result A',
      metric: 'Metric A',
      description: 'Description A',
      solutionDetails: 'Details A',
      benefits: ['Benefit 1', 'Benefit 2'],
    },
    {
      id: 'solution2',
      name: 'Solution Two',
      icon: '/images/icon2.png',
      category: 'Category B',
      problem: 'Problem B',
      solution: 'Solution B',
      result: 'Result B',
      metric: 'Metric B',
      description: 'Description B',
      solutionDetails: 'Details B',
      benefits: ['Benefit 3', 'Benefit 4'],
    },
  ],
}));

// Mock SolutionDetailModal
vi.mock('../../components/sections/SolutionDetailModal', () => ({
  default: vi.fn(({ solution, isOpen, onClose }) =>
    isOpen ? (
      <div data-testid="solution-modal">
        <h2>{solution.name}</h2>
        <p>{solution.description}</p>
        <button onClick={onClose}>Close</button>
      </div>
    ) : null
  ),
}));

describe('SolutionsPage', () => {
  const originalScrollTo = window.scrollTo;

  beforeEach(() => {
    mockUseLocation.mockReturnValue({
      pathname: '/',
      search: '',
      hash: '',
      state: null,
      key: 'default',
    });
    window.scrollTo = vi.fn(); // Mock window.scrollTo
    (SolutionDetailModal as any).mockClear();
  });

  afterEach(() => {
    window.scrollTo = originalScrollTo; // Restore original window.scrollTo
  });

  it('should scroll to top on initial render', () => {
    render(<SolutionsPage />);
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it('should display page title and description', () => {
    render(<SolutionsPage />);
    expect(screen.getByRole('heading', { name: /Our Solutions/i })).toBeInTheDocument();
    expect(
      screen.getByText(/Specialized AI agents for solving specific business tasks/i)
    ).toBeInTheDocument();
  });

  it('should render solution cards from solutionsData', () => {
    render(<SolutionsPage />);
    expect(screen.getByText('Solution One')).toBeInTheDocument();
    expect(screen.getByText('Solution Two')).toBeInTheDocument();
    expect(screen.getByText('Problem A')).toBeInTheDocument();
    expect(screen.getByText('Solution B')).toBeInTheDocument();
  });

  it('should open SolutionDetailModal when a card is clicked', async () => {
    render(<SolutionsPage />);
    const solutionCard = screen.getByText('Solution One').closest('.cursor-pointer');
    fireEvent.click(solutionCard!);

    await waitFor(() => {
      expect(SolutionDetailModal).toHaveBeenCalledWith(
        expect.objectContaining({
          solution: solutionsData[0],
          isOpen: true,
          onClose: expect.any(Function),
        }),
        undefined
      );
      expect(screen.getByTestId('solution-modal')).toBeInTheDocument();
      expect(screen.getByTestId('solution-modal')).toBeInTheDocument();
      const modal = screen.getByTestId('solution-modal');
      expect(within(modal).getByRole('heading', { name: /Solution One/i })).toBeInTheDocument();
    });
  });

  it('should close SolutionDetailModal when onClose is called', async () => {
    render(<SolutionsPage />);
    const solutionCard = screen.getByText('Solution One').closest('.cursor-pointer');
    fireEvent.click(solutionCard!);

    await waitFor(() => {
      expect(screen.getByTestId('solution-modal')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /Close/i }));

    await waitFor(() => {
      expect(screen.queryByTestId('solution-modal')).not.toBeInTheDocument();
    });
  });

  it('should have a link back to #products section', () => {
    render(<SolutionsPage />);
    const backLink = screen.getByRole('link', { name: /Back to Solutions/i });
    expect(backLink).toHaveAttribute('href', '/#products');
  });
});
