/**
 * @file SafeHTML component for securely rendering HTML content.
 * @module components/common/SafeHTML
 */

import React from 'react';
import DOMPurify from 'dompurify';
import type { Config } from 'dompurify';

/**
 * Props for the SafeHTML component.
 */
interface SafeHTMLProps {
  /** The HTML string to be sanitized and rendered. */
  html: string;
  /** Optional CSS class names to apply to the wrapper div. */
  className?: string;
  /** Optional array of allowed HTML tags, overriding the default configuration. */
  allowedTags?: string[];
}

/**
 * A React component that securely renders HTML content using DOMPurify.
 * It sanitizes the input HTML to prevent XSS attacks and automatically
 * adds `target="_blank"` and `rel="noopener noreferrer"` to external links.
 *
 * @param {SafeHTMLProps} props - The properties for the component.
 * @returns {JSX.Element} A div element with the sanitized HTML.
 */
export const SafeHTML: React.FC<SafeHTMLProps> = ({ html, className, allowedTags }) => {
  // Configure DOMPurify with default safe settings
  const purifyConfig: Config = {
    USE_PROFILES: { html: true }, // Use default HTML profile
    ALLOWED_TAGS: allowedTags || [
      'b',
      'i',
      'em',
      'strong',
      'a',
      'p',
      'br',
      'ul',
      'ol',
      'li',
      'span',
      'div',
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'style'], // Allow common attributes
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'style', 'link', 'meta'],
    FORBID_ATTR: ['on*'], // Forbid all event handlers
    ADD_ATTR: ['target', 'rel'], // Ensure target and rel are added to links
    ADD_TAGS: ['a'], // Ensure 'a' tags are processed
  };

  // First sanitize the HTML content
  const sanitizedHtml = DOMPurify.sanitize(html, purifyConfig);
  
  // Then manually add target="_blank" and rel="noopener noreferrer" to external links
  const processedHtml = sanitizedHtml.replace(
    /<a\s+([^>]*?)href="(https?:\/\/[^"]+)"([^>]*)>/gi,
    '<a $1href="$2" target="_blank" rel="noopener noreferrer"$3>'
  );

  return <div className={className} dangerouslySetInnerHTML={{ __html: processedHtml }} />;
};
