import type CspDev from 'csp-dev';

import config from 'configs/app';

export function hanzoInsights(): CspDev.DirectiveDescriptor {
  if (!config.features.hanzoInsights.isEnabled) {
    return {};
  }

  return {
    'connect-src': [
      'https://api.hanzo.ai',
    ],
  };
}
