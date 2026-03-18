// Theme system is now pure CSS (styles/tokens.css + Tailwind v4).
// This file kept only for the provider.tsx import — will be removed
// once ChakraProvider is fully stripped.
import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

import breakpoints from './foundations/breakpoints';
import colors from './foundations/colors';
import semanticTokens from './foundations/semanticTokens';
import zIndex from './foundations/zIndex';

export const customConfig = defineConfig({
  theme: {
    breakpoints,
    semanticTokens,
    tokens: {
      colors,
      zIndex,
      fontWeights: {
        normal: { value: '400' },
        medium: { value: '500' },
        semibold: { value: '600' },
        bold: { value: '700' },
      },
    },
  },
});

export default createSystem(defaultConfig, customConfig);
