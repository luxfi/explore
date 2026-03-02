import React from 'react';

import type { CloseButtonProps } from '@luxfi/ui/close-button';
import { CloseButton } from '@luxfi/ui/close-button';

export interface ClearButtonProps extends CloseButtonProps {
  visible?: boolean;
}

export const ClearButton = ({ disabled, visible = true, ...rest }: ClearButtonProps) => {
  return (
    <CloseButton
      disabled={ disabled || !visible }
      aria-label="Clear"
      title="Clear"
      className={ visible ? 'opacity-100' : 'opacity-0 invisible' }
      style={{ color: 'var(--color-text-secondary)' }}
      { ...rest }
    />
  );
};
