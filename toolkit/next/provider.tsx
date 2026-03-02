'use client';

import React from 'react';

import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from './color-mode';

// own test harness wrapper.
export function Provider(props: ColorModeProviderProps) {
  return (
    <ColorModeProvider { ...props }/>
  );
}
