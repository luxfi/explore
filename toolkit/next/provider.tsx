'use client';

import { useAppearance } from '@hanzo/appearance';
import React from 'react';

import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from './color-mode';

/*
 * Two independent readings of the same page, kept apart on purpose.
 *
 * COLOUR MODE is light or dark. It is one bit, it is what the OS already has an
 * opinion about, and next-themes owns it — the class on <html> that the token
 * sheet switches on.
 *
 * APPEARANCE is everything else a reader gets to say: how big the type runs, how
 * far apart its rungs sit, how tight the spacing is, which face, how wide the
 * measure, and the accent. Those are numbers, not a bit, and they multiply ramps
 * rather than swapping palettes.
 *
 * Folding them together is the mistake to avoid. A colour-mode toggle that also
 * carried type size would make one control answer two questions, and the axes do
 * not even share a storage shape: the mode is per-origin device state, while the
 * appearance belongs to the PERSON and follows them across origins once signed
 * in (@hanzo/appearance/account).
 *
 * The head script in _document has already applied the stored preference before
 * this mounts. This hook exists for what a script that must run before any
 * bundle cannot do — validate an accent colour, and keep the document in step
 * when the reader changes a setting.
 */
function ApplyAppearance() {
  useAppearance();
  return null;
}

export interface ProviderProps extends ColorModeProviderProps {}

export function Provider({ children, ...props }: ProviderProps) {
  return (
    <ColorModeProvider { ...props }>
      <ApplyAppearance/>
      { children }
    </ColorModeProvider>
  );
}
