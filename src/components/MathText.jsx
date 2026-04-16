import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';

/**
 * Reusable component to parse text and render math formulas.
 * Supports $...$ for inline math and $$...$$ for block math.
 * Prevents raw LaTeX from appearing alongside rendered components.
 */
export default function MathText({ text }) {
  // Safety check: handle null, undefined or non-string inputs
  if (!text || typeof text !== 'string') {
    return <span>{text || ''}</span>;
  }

  // Regex to match $$...$$ and $...$
  // We use non-greedy matching to avoid capturing everything between distant $ symbols
  const parts = text.split(/(\$\$.*?\$\$|\$.*?\$)/g);

  return (
    <span>
      {parts.map((part, index) => {
        if (!part) return null;

        // Check for double dollar (block math)
        if (part.startsWith('$$') && part.endsWith('$$')) {
          const math = part.slice(2, -2);
          return math.trim() ? <BlockMath key={index} math={math} /> : null;
        }
        
        // Check for single dollar (inline math)
        if (part.startsWith('$') && part.endsWith('$')) {
          const math = part.slice(1, -1);
          return math.trim() ? <InlineMath key={index} math={math} /> : null;
        }

        // Normal text
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
}
