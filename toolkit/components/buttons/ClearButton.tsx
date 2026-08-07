import type { CloseButtonProps } from '@luxfi/ui/close-button';
import { CloseButton } from '@luxfi/ui/close-button';
import React from 'react';

import { cn } from 'lib/utils/cn';

export interface ClearButtonProps extends CloseButtonProps {
  visible?: boolean;
}

// `className` is merged rather than spread over the visibility classes: a caller
// passing one used to clobber `invisible`, which is why the header search showed
// a clear button on an empty field.
export const ClearButton = ({ disabled, visible = true, className, ...rest }: ClearButtonProps) => {
  return (
    <CloseButton
      disabled={ disabled || !visible }
      aria-label="Clear"
      title="Clear"
      className={ cn(visible ? 'opacity-100' : 'opacity-0 invisible', className) }
      style={{ color: 'var(--color-text-secondary)' }}
      { ...rest }
    />
  );
};
