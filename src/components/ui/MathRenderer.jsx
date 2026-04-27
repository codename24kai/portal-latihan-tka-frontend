import React, { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

/**
 * MathRenderer: A reusable component to render LaTeX strings using KaTeX.
 * Logic:
 * 1. Parses strings for $ (inline) and $$ (display) delimiters.
 * 2. Uses katex.renderToString for fast, secure rendering.
 * 3. Handles multi-line math and escapes HTML in plain text.
 */
export default function MathRenderer({ text, className = '' }) {
  const renderedContent = useMemo(() => {
    if (!text || typeof text !== 'string') return text;
    
    // Split text by $...$ and $$...$$ delimiters
    // [\s\S] matches any character including newlines
    // The +? is non-greedy
    const parts = text.split(/(\$\$[\s\S]+?\$\$|\$[\s\S]+?\$)/g);
    
    return parts.map((part) => {
      if (!part) return '';

      // Display Mode Math ($$ ... $$)
      if (part.startsWith('$$') && part.endsWith('$$')) {
        const formula = part.slice(2, -2).trim();
        try {
          return katex.renderToString(formula, { 
            displayMode: true, 
            throwOnError: false,
            strict: false
          });
        } catch (e) {
          console.error("KaTeX Display Error:", e);
          return `<span class="text-rose-500 font-mono text-[10px]">[Math Error: ${part}]</span>`;
        }
      } 
      
      // Inline Mode Math ($ ... $)
      if (part.startsWith('$') && part.endsWith('$')) {
        const formula = part.slice(1, -1).trim();
        try {
          return katex.renderToString(formula, { 
            displayMode: false, 
            throwOnError: false,
            strict: false
          });
        } catch (e) {
          console.error("KaTeX Inline Error:", e);
          return `<span class="text-rose-500 font-mono text-[10px]">[Math Error: ${part}]</span>`;
        }
      }

      // Plain text: Escape HTML to prevent XSS while allowing KaTeX HTML
      return part
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }).join('');
  }, [text]);

  return (
    <span 
      className={`math-renderer-wrap inline-block w-full ${className}`}
      dangerouslySetInnerHTML={{ __html: renderedContent }} 
    />
  );
}
