import type { Feature } from './types';

import { getEnvValue } from '../utils';

const title = 'AI assistant';

// The browser only learns whether to offer the assistant; the credential that
// makes it answer is server-side (pages/api/ai.ts) and never reaches a bundle.
// Enabled but without a key is a real state, and the dialog says so — see
// SearchBarAssistant — rather than failing silently.
const config: Feature<{ model: string }> = (() => {
  if (getEnvValue('NEXT_PUBLIC_AI_ASSISTANT_ENABLED') === 'true') {
    return Object.freeze({
      title,
      isEnabled: true,
      model: getEnvValue('NEXT_PUBLIC_AI_ASSISTANT_MODEL') || 'best',
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
