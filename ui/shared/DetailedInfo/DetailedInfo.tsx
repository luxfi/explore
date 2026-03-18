import React from 'react';

import { cn } from 'lib/utils/cn';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Hint } from 'toolkit/components/Hint/Hint';
import * as ContainerWithScrollY from 'ui/shared/ContainerWithScrollY';

export const ITEM_VALUE_LINE_HEIGHT = { base: '30px', lg: '32px' };

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export const Container = ({ children, className }: ContainerProps) => {
  return (
    <div className={ cn('grid gap-x-8 gap-y-0 lg:gap-y-3 grid-cols-1 lg:grid-cols-[max-content_minmax(728px,auto)] text-sm lg:text-base', className) }>
      { children }
    </div>
  );
};

interface ItemLabelProps {
  hint?: React.ReactNode;
  children: React.ReactNode;
  isLoading?: boolean;
  id?: string;
  hasScroll?: boolean;
  className?: string;
}

const ItemLabelScrollText = () => (
  <span className="font-medium text-[var(--color-text-secondary)] text-xs note text-right">
    Scroll to see more
  </span>
);

export const ItemLabel = ({ hint, children, isLoading, id, hasScroll, className }: ItemLabelProps) => {
  return (
    <div
      id={ id }
      className={ cn('min-h-[30px] lg:min-h-[32px] [&:not(:first-child)]:mt-3 lg:[&:not(:first-child)]:mt-0', className) }
    >
      <div className="flex gap-x-1 lg:gap-x-2 items-start w-full">
        { hint && <Hint label={ hint } isLoading={ isLoading } className="my-[5px] lg:my-[6px]"/> }
        <Skeleton loading={ isLoading } className="font-bold lg:font-medium py-[5px] lg:py-1 grow">
          { children }
          { hasScroll && <ItemLabelScrollText/> }
        </Skeleton>
      </div>
    </div>
  );
};

interface ItemValueProps {
  children: React.ReactNode;
  multiRow?: boolean;
  className?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export const ItemValue = ({ children, multiRow = false, className }: ItemValueProps) => {
  return (
    <div
      className={ cn(
        'flex items-center pl-6 lg:pl-0 min-h-[30px] lg:min-h-[32px] whitespace-nowrap',
        multiRow && 'flex-wrap leading-[30px] lg:leading-[32px]',
        className,
      ) }
    >
      { children }
    </div>
  );
};

export const ItemValueWithScroll = ({ children, gradientHeight, onScrollVisibilityChange, className }: ContainerWithScrollY.Props) => {
  return (
    <ItemValue className="relative">
      <ContainerWithScrollY.default
        className={ className }
        gradientHeight={ gradientHeight }
        onScrollVisibilityChange={ onScrollVisibilityChange }
      >
        { children }
      </ContainerWithScrollY.default>
    </ItemValue>
  );
};

interface ItemDividerProps {
  className?: string;
}

export const ItemDivider = ({ className }: ItemDividerProps) => {
  return (
    <div
      className={ cn('col-span-1 lg:col-span-2 mt-2 lg:mt-3 mb-0 lg:mb-3 border-b border-[var(--color-border-divider)]', className) }
    />
  );
};
