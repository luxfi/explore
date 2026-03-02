import React from 'react';

import type { ButtonProps } from '@luxfi/ui/button';
import { Button } from '@luxfi/ui/button';
import { Skeleton } from '@luxfi/ui/skeleton';
import IconSvg from 'ui/shared/IconSvg';

interface Props extends ButtonProps {
  isLoading?: boolean;
  appliedFiltersNum?: number;
}

const FilterButton = ({ isLoading, appliedFiltersNum, ...rest }: Props, ref: React.ForwardedRef<HTMLButtonElement>) => {
  if (isLoading) {
    return <Skeleton loading w="78px" h="32px" borderRadius="base" className="shrink-0 max-lg:w-9"/>;
  }

  const numElement = appliedFiltersNum ? (
    <span
      className="AppliedFiltersNum flex items-center justify-center size-5 rounded-full bg-[var(--color-selected-control-text)] text-white dark:text-black group-hover:bg-[var(--color-hover)] group-data-[expanded]:bg-[var(--color-hover)]"
    >
      { appliedFiltersNum }
    </span>
  ) : null;

  return (
    <Button
      ref={ ref }
      size="sm"
      variant="dropdown"
      selected={ Boolean(appliedFiltersNum) }
      className="shrink-0 pointer-events-auto font-medium gap-1 max-lg:px-1 lg:px-3"
      { ...rest }
    >
      <IconSvg name="filter" className="size-5"/>
      <span className="hidden lg:block">Filter</span>
      { numElement }
    </Button>
  );
};

export default React.forwardRef(FilterButton);
