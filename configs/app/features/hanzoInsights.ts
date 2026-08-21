import type { Feature } from './types';

import app from '../app';
import { getEnvValue } from '../utils';

// Publishable ingest key for this explorer. It is write-only — it attributes a
// write and never mints a reading principal — so it belongs in the browser
// bundle. NEXT_PUBLIC_PUBLISHABLE_KEY is the fleet's one spelling for this
// value and overrides the default when a deploy supplies it.
const ingestKey = getEnvValue('NEXT_PUBLIC_PUBLISHABLE_KEY') || 'pk-gUZp6ZVfhJzSwK-rb4oLbVkpCnMBx5uSCpxf_5yEhQk';

const title = 'Hanzo Insights';

const config: Feature<{ ingestKey: string }> = (() => {
  if (!app.isPrivateMode && ingestKey) {
    return Object.freeze({
      title,
      isEnabled: true,
      ingestKey,
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
