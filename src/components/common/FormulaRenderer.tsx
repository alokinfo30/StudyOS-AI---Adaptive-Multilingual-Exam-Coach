import React from 'react';

interface FormulaRendererProps {
  formula: string;
  className?: string;
}

/**
 * FormulaRenderer: Formats mathematical and scientific formulas nicely with standard notation
 */
export const FormulaRenderer: React.FC<FormulaRendererProps> = ({ formula, className = '' }) => {
  // Convert standard LaTeX-like tokens into clean readable math spans
  const formatFormula = (raw: string) => {
    let text = raw;
    text = text.replace(/\\quad/g, '   ');
    text = text.replace(/\\cdot/g, ' · ');
    text = text.replace(/\\times/g, ' × ');
    text = text.replace(/\\pm/g, ' ± ');
    text = text.replace(/\\varepsilon_0/g, 'ε₀');
    text = text.replace(/\\pi/g, 'π');
    text = text.replace(/\\rho/g, 'ρ');
    text = text.replace(/\\text\{([^}]+)\}/g, '$1');
    text = text.replace(/\\sum/g, '∑');
    text = text.replace(/\\sqrt\{([^}]+)\}/g, '√($1)');
    text = text.replace(/\\sqrt/g, '√');
    text = text.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1 / $2)');
    text = text.replace(/\^2/g, '²');
    text = text.replace(/\^3/g, '³');
    text = text.replace(/\^6/g, '⁶');
    text = text.replace(/\_eq/g, '_eq');
    return text;
  };

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 text-amber-300 font-mono text-sm border border-zinc-800 tracking-wide select-all ${className}`}
    >
      <span className="text-zinc-500 font-sans font-bold text-xs uppercase select-none">Formula</span>
      <span className="font-semibold">{formatFormula(formula)}</span>
    </div>
  );
};
