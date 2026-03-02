import React from 'react';

import InfoIcon from 'icons/info.svg';

import type { IconButtonProps } from '@luxfi/ui/icon-button';
import { IconButton } from '@luxfi/ui/icon-button';
import type { TooltipProps } from '@luxfi/ui/tooltip';
import { Tooltip } from '@luxfi/ui/tooltip';

export interface HintProps extends Omit<IconButtonProps, 'color'> {
  label: string | React.ReactNode;
  tooltipProps?: Partial<TooltipProps>;
  isLoading?: boolean;
  as?: React.ElementType;
  color?: string;
}

export const Hint = React.memo(({ label, tooltipProps, isLoading, boxSize = 5, color: _color, ...rest }: HintProps) => {
  return (
    <Tooltip
      content={ label }
      positioning={{ placement: 'top' }}
      { ...tooltipProps }
    >
      <IconButton
        aria-label="hint"
        boxSize={ boxSize }
        loadingSkeleton={ isLoading }
        borderRadius="sm"
        variant="icon_secondary"
        color={ _color }
        { ...rest }
      >
        <InfoIcon className="w-5 h-5"/>
      </IconButton>
    </Tooltip>
  );
});
