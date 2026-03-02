import React from 'react';

import { Button } from '@luxfi/ui/button';
import { PopoverCloseTriggerWrapper } from '@luxfi/ui/popover';

type Props = {
  title: string;
  isFilled?: boolean;
  isTouched?: boolean;
  hasReset?: boolean;
  onFilter: () => void;
  onReset?: () => void;
  children: React.ReactNode;
};

const TableColumnFilter = ({ title, isFilled, isTouched, hasReset, onFilter, onReset, children }: Props) => {
  const onFilterClick = React.useCallback(() => {
    onFilter();
  }, [ onFilter ]);
  return (
    <>
      <div className="flex items-center justify-between gap-x-6">
        <span className="text-[var(--color-text-secondary)] font-semibold">{ title }</span>
        { hasReset && (
          <Button
            variant="link"
            onClick={ onReset }
            disabled={ !isFilled }
            className="text-sm"
          >
            Reset
          </Button>
        ) }
      </div>
      { children }
      <PopoverCloseTriggerWrapper>
        <Button
          disabled={ !isTouched }
          onClick={ onFilterClick }
          className="w-fit"
        >
          Filter
        </Button>
      </PopoverCloseTriggerWrapper>
    </>
  );
};

export default TableColumnFilter;
