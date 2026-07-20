export default function getNetworkUtilizationParams(value: number) {
  const load = (() => {
    if (value > 80) {
      return 'high';
    }

    if (value > 50) {
      return 'medium';
    }

    return 'low';
  })();

  // Semantic status vars (styles/tokens.css, both light + dark). The previous
  // Chakra dot-tokens (red.600 etc.) had no matching --color-*-600 var, so they
  // rendered as invalid CSS and the % inherited white-on-white. These shades
  // clear 4.5:1 on the #FAFAFA card background.
  const colors = {
    high: 'var(--color-status-bad)',
    medium: 'var(--color-status-warn)',
    low: 'var(--color-status-good)',
  };
  const color = colors[load];

  return {
    load,
    color,
  };
}
