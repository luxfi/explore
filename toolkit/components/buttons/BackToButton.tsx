import React from 'react';

import ArrowIcon from 'icons/arrows/east.svg';

import type { IconButtonProps } from '@luxfi/ui/icon-button';
import { IconButton } from '@luxfi/ui/icon-button';
import { Link } from '@luxfi/ui/link';
import { Tooltip } from '@luxfi/ui/tooltip';

export interface BackToButtonProps extends IconButtonProps {
  href?: string;
  hint?: string;
}

export const BackToButton = ({ href, hint, boxSize = 6, ...rest }: BackToButtonProps) => {

  const button = (
    <IconButton { ...rest } boxSize={ boxSize } variant="icon_secondary">
      <ArrowIcon className="w-6 h-6 rotate-180"/>
    </IconButton>
  );

  return (
    <Tooltip content={ hint } disabled={ !hint }>
      { href ? <Link href={ href }>{ button }</Link> : button }
    </Tooltip>
  );
};
