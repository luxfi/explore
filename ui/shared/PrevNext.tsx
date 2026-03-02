import React from 'react';

import { cn } from 'lib/utils/cn';
import { IconButton } from '@luxfi/ui/icon-button';
import { Skeleton } from '@luxfi/ui/skeleton';
import { Tooltip } from '@luxfi/ui/tooltip';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  className?: string;
  onClick: (direction: 'prev' | 'next') => void;
  prevLabel?: string;
  nextLabel?: string;
  isPrevDisabled?: boolean;
  isNextDisabled?: boolean;
  isLoading?: boolean;
}

const PrevNext = ({ className, onClick, prevLabel, nextLabel, isPrevDisabled, isNextDisabled, isLoading }: Props) => {
  const handelPrevClick = React.useCallback(() => {
    onClick('prev');
  }, [ onClick ]);

  const handelNextClick = React.useCallback(() => {
    onClick('next');
  }, [ onClick ]);

  if (isLoading) {
    return (
      <div className={ cn('flex gap-x-[10px]', className) }>
        <Skeleton loading={ true } className="size-6 rounded-sm"/>
        <Skeleton loading={ true } className="size-6 rounded-sm"/>
      </div>
    );
  }

  return (
    <div className={ cn('flex', className) }>
      <Tooltip content={ prevLabel }>
        <IconButton
          aria-label="prev"
          variant="icon_background"
          className="size-6 rounded-sm"
          onClick={ handelPrevClick }
          disabled={ isPrevDisabled }
        >
          <IconSvg name="arrows/east-mini"/>
        </IconButton>
      </Tooltip>
      <Tooltip content={ nextLabel }>
        <IconButton
          aria-label="next"
          variant="icon_background"
          className="size-6 rounded-sm ml-[10px]"
          onClick={ handelNextClick }
          disabled={ isNextDisabled }
        >
          <IconSvg name="arrows/east-mini" className="rotate-180"/>
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default PrevNext;
