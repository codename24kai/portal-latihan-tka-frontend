import React from 'react';
import { InlineMath } from 'react-katex';

/**
 * Reusable component to parse text and render math formulas.
 * Supports $...$ delimiters for inline math.
 */
export default function MathText({ text = '' }) {
  if (!text) return null;

  // Split text by $ delimiters
  const parts = text.split(/(\$[^$]+\$)/g);

  return (
    <span>
      {parts.map((part, index) => {
        if (part.startsWith('$') && part.endsWith('$')) {
          // Extract math content without the $ symbols
          const math = part.slice(1, -1);
          return <InlineMath key={index} math={math} />;
        }
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
}
