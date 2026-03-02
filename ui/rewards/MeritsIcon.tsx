import React from 'react';

// This icon doesn't work properly when it is in the sprite
// Probably because of the gradient
// eslint-disable-next-line no-restricted-imports
import MeritsIconColored from 'icons/merits_colored.svg';

import { cn } from 'lib/utils/cn';

type Props = {
  className?: string;
};

const MeritsIcon = ({ className }: Props) => {
  return (
    <span
      className={ cn('inline-flex items-center justify-center shrink-0', className) }
      style={{ filter: 'drop-shadow(0px 4px 2px rgba(141, 179, 204, 0.25))' }}
    >
      <MeritsIconColored/>
    </span>
  );
};

export default MeritsIcon;
