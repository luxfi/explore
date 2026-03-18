import React from 'react';

// Maps Chakra token names to CSS variable names or raw values.
// Covers the patterns used in the codebase for D3/SVG chart rendering.
const COLOR_MAP: Record<string, string> = {
  'black': '#000000',
  'white': '#ffffff',
  'gray.400': 'var(--color-gray-400, #a0aec0)',
  'gray.600': 'var(--color-gray-600, #4a5568)',
  'yellow.300': 'var(--color-yellow-300, #f6e05e)',
  'red.500': 'var(--color-red-500, #e53e3e)',
  'green.500': 'var(--color-green-500, #38a169)',
  'blackAlpha.300': 'rgba(0, 0, 0, 0.16)',
  'blackAlpha.400': 'rgba(0, 0, 0, 0.24)',
  'blackAlpha.600': 'rgba(0, 0, 0, 0.48)',
  'blackAlpha.900': 'rgba(0, 0, 0, 0.92)',
  'whiteAlpha.300': 'rgba(255, 255, 255, 0.16)',
  'whiteAlpha.400': 'rgba(255, 255, 255, 0.24)',
  'whiteAlpha.500': 'rgba(255, 255, 255, 0.36)',
  'border.divider': 'var(--color-border-divider, rgba(0, 0, 0, 0.06))',
  'text.secondary': 'var(--color-text-secondary, #718096)',
  'link.primary': 'var(--color-link-primary, #3182ce)',
};

const FONT_SIZE_MAP: Record<string, string> = {
  'xs': '12px',
  'sm': '14px',
  'md': '16px',
  'lg': '18px',
  'xl': '20px',
};

function resolveToken(category: string, token: string): string {
  if (category === 'colors') {
    return COLOR_MAP[token] ?? `var(--color-${ token.replace(/\./g, '-') })`;
  }
  if (category === 'fontSizes') {
    return FONT_SIZE_MAP[token] ?? token;
  }
  return token;
}

/**
 * Drop-in replacement for color token hook.
 * Returns resolved CSS values for design tokens.
 *
 * Supports:
 *   useToken('colors', 'gray.400') => ['#a0aec0']
 *   useToken('colors', ['gray.400', 'red.500']) => ['#a0aec0', '#e53e3e']
 */
export function useToken(category: string, tokens: string | ReadonlyArray<string>): Array<string> {
  return React.useMemo(() => {
    if (Array.isArray(tokens)) {
      return (tokens as ReadonlyArray<string>).map((t: string) => resolveToken(category, t));
    }
    return [ resolveToken(category, tokens as string) ];
  }, [ category, tokens ]);
}
