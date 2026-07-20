import tsconfigPaths from 'vite-tsconfig-paths';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    tsconfigPaths({
      ignoreConfigErrors: true,
    }),
  ],
  test: {
    globalSetup: [ './vitest/global-setup.ts' ],
    setupFiles: [ './vitest/setup.ts' ],
    include: [ '**/*.spec.ts', '**/*.spec.tsx' ],
    // tests/e2e/** holds Playwright live-infra E2E specs (import '@playwright/test',
    // hit live explorer URLs). They run under the Playwright runner (pnpm test:pw*),
    // not vitest — exclude them from the unit suite.
    exclude: [ '**/node_modules/**', '**/node_modules_linux/**', '**/tests/e2e/**' ],
  },
});
