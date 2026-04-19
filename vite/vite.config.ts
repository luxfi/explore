import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

// Mirror the Next.js alias root so we can reuse existing source folders as the
// migration progresses. Each alias points at ../<dir>, not vite/src/<dir>.
const aliasRoot = path.resolve(__dirname, '..');

export default defineConfig({
  plugins: [ react(), svgr() ],
  resolve: {
    alias: {
      configs: path.join(aliasRoot, 'configs'),
      lib: path.join(aliasRoot, 'lib'),
      mocks: path.join(aliasRoot, 'mocks'),
      nextjs: path.join(aliasRoot, 'nextjs'),
      stubs: path.join(aliasRoot, 'stubs'),
      toolkit: path.join(aliasRoot, 'toolkit'),
      tools: path.join(aliasRoot, 'tools'),
      types: path.join(aliasRoot, 'types'),
      ui: path.join(aliasRoot, 'ui'),
      icons: path.join(aliasRoot, 'icons'),
      'public': path.join(aliasRoot, 'public'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2022',
    sourcemap: false,
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
});
