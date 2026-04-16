import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

/**
 * MathRenderer - Custom KaTeX renderer for React 19+.
 * 
 * Logic:
 * 1. Safely parse string for $ (inline) and $$ (block) math.
 * 2. Convert math parts to HTML using pure KaTeX.
 * 3. Escape normal text parts to prevent XSS.
 * 4. Render using dangerouslySetInnerHTML.
 * 
 * Anti-Crash: Using throwOnError: false for KaTeX.
 */
const MathRenderer = ({ text }) => {
  // Safe Fallback: Handle null, undefined, or non-string inputs
  if (!text || typeof text !== 'string') {
    return null;
  }

  // Split text by math delimiters while keeping the delimiters in the output
  const parts = text.split(/(\$\$.*?\$\$|\$.*?\$)/g);

  const finalHtml = parts
    .map((part) => {
      if (!part) return '';

      // Block Math ($$ ... $$)
      if (part.startsWith('$$') && part.endsWith('$$')) {
        try {
          const math = part.slice(2, -2);
          return katex.renderToString(math.trim(), {
            displayMode: true,
            throwOnError: false,
          });
        } catch (e) {
          return `<span class="text-rose-500">${part}</span>`;
        }
      }

      // Inline Math ($ ... $)
      if (part.startsWith('$') && part.endsWith('$')) {
        try {
          const math = part.slice(1, -1);
          return katex.renderToString(math.trim(), {
            displayMode: false,
            throwOnError: false,
          });
        } catch (e) {
          return `<span class="text-rose-500">${part}</span>`;
        }
      }

      // Normal Text - Escape HTML entities
      return part
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    })
    .join('');

  return (
    <span
      className="math-renderer-wrap inline-block w-full"
      dangerouslySetInnerHTML={{ __html: finalHtml }}
    />
  );
};

export default MathRenderer;
