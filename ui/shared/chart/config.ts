import React from 'react';

import type { ChartConfig } from 'toolkit/components/charts/types';

import useIsMobile from 'lib/hooks/useIsMobile';
import { useColorModeValue } from 'toolkit/next/color-mode';

export function useChartsConfig(): Array<ChartConfig> {
  const lineColor = useDefaultLineColor();
  const gradient = useDefaultGradient();
  const isMobile = useIsMobile();

  return React.useMemo(() => [
    {
      type: 'line',
      color: lineColor,
      strokeWidth: isMobile ? 1 : 2,
    },
    {
      type: 'area',
      gradient,
    },
  ], [ lineColor, isMobile, gradient ]);
}

export function useDefaultLineColor() {
  const lineColor = useColorModeValue(
    'var(--color-theme-graph-line-light, #4299E1)',
    'var(--color-theme-graph-line-dark, #63B3ED)',
  );
  return React.useMemo(() => lineColor, [ lineColor ]);
}

export function useDefaultGradient() {
  const startColor = useColorModeValue(
    'var(--color-theme-graph-gradient-start-light, #4299E1)',
    'var(--color-theme-graph-gradient-start-dark, #63B3ED)',
  );
  const stopColor = useColorModeValue(
    'var(--color-theme-graph-gradient-stop-light, #fff)',
    'var(--color-theme-graph-gradient-stop-dark, #1A202C)',
  );
  return React.useMemo(() => ({ startColor, stopColor }), [ startColor, stopColor ]);
}
