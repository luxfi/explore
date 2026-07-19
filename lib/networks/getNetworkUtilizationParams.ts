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

  // Theme CSS vars (defined in styles/tokens.css for both light + dark). The
  // previous Chakra dot-tokens (red.600 etc.) had no matching --color-*-600 var,
  // so they rendered as invalid CSS and the % inherited white-on-white. The
  // "bright" badge foregrounds are the darkest semantic status shades and clear
  // 4.5:1 on the light card background.
  const colors = {
    high: 'var(--color-badge-bright-red-fg)',
    medium: 'var(--color-badge-bright-orange-fg)',
    low: 'var(--color-badge-bright-green-fg)',
  };
  const color = colors[load];

  return {
    load,
    color,
  };
}
