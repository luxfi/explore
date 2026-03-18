'use client';

import React from 'react';

import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from './color-mode';

// ChakraProvider removed — zero production files import from @chakra-ui/react.
// Only Playwright test files (.pw.tsx) still reference Chakra; they use their
// own test harness wrapper.
export function Provider(props: ColorModeProviderProps) {
  return (
    <ColorModeProvider { ...props }/>
  );
}
