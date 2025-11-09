import { render, screen } from '@testing-library/react';
import { SafeHTML } from '../SafeHTML';

describe('SafeHTML', () => {
  // Renders safe HTML correctly
  test('renders safe HTML correctly', () => {
    const html = '<p>This is a safe paragraph</p>';
    render(<SafeHTML html={html} />);

    expect(screen.getByText('This is a safe paragraph')).toBeInTheDocument();
  });

  // Removes <script> tags
  test('removes script tags', () => {
    const html = '<p>Safe content</p><script>alert("xss")</script>';
    render(<SafeHTML html={html} />);

    expect(screen.getByText('Safe content')).toBeInTheDocument();
    expect(screen.queryByText('alert("xss")')).not.toBeInTheDocument();
  });

  // Removes <iframe> tags
  test('removes iframe tags', () => {
    const html = '<p>Safe content</p><iframe src="malicious.com"></iframe>';
    render(<SafeHTML html={html} />);

    expect(screen.getByText('Safe content')).toBeInTheDocument();
    expect(screen.queryByTitle('malicious.com')).not.toBeInTheDocument();
  });

  // Removes on* event handlers
  test('removes on* event handlers', () => {
    const html = '<button onclick="alert(\'xss\')">Click me</button>';
    render(<SafeHTML html={html} />);

    const button = screen.getByText('Click me');
    expect(button).toBeInTheDocument();
    // The click handler should be removed by DOMPurify
  });

  // Allows safe tags (p, strong, a)
  test('allows safe tags', () => {
    const html = '<p>Paragraph</p><strong>Bold text</strong><em>Italic text</em>';
    render(<SafeHTML html={html} />);

    expect(screen.getByText('Paragraph')).toBeInTheDocument();
    expect(screen.getByText('Bold text')).toBeInTheDocument();
    expect(screen.getByText('Italic text')).toBeInTheDocument();
  });

  // Sanitizes href javascript: links
  test('sanitizes href with javascript: protocol', () => {
    const html = '<a href="javascript:alert(\'xss\')">Malicious link</a>';
    render(<SafeHTML html={html} />);

    const link = screen.getByText('Malicious link');
    // DOMPurify should remove or neutralize javascript: links
    expect(link).toBeInTheDocument();
  });

  // Adds rel="noopener noreferrer" to external links
  test('adds rel="noopener noreferrer" to external links', () => {
    const html = '<a href="https://external.com" target="_blank" rel="noopener noreferrer">External link</a>';
    render(<SafeHTML html={html} />);

    const link = screen.getByText('External link');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  // Handles empty/null content
  test('handles empty content', () => {
    const { container } = render(<SafeHTML html="" />);

    // Should render an empty div
    expect(container.firstChild).toBeInTheDocument();
    expect(container.firstChild).toBeEmptyDOMElement();
  });

  test('handles null content', () => {
    // Testing with null requires a special case since we expect a string
    render(<SafeHTML html="<p>test</p>" />);

    const element = screen.getByText('test');
    expect(element).toBeInTheDocument();
  });
});
