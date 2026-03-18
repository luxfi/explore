import React from 'react';

import { cn } from 'lib/utils/cn';
import { Skeleton } from 'toolkit/chakra/skeleton';

interface ContainerProps {
  className?: string;
  animation?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const Container = (({ animation, children, className, style }: ContainerProps) => {
  return (
    <div
      className={ cn('grid items-start gap-x-2 gap-y-2 w-full text-sm border-t border-[var(--color-border-divider)] py-4', className) }
      style={{ gridTemplateColumns: '86px auto', ...style }}
    >
      { children }
    </div>
  );
});

interface LabelProps {
  className?: string;
  children: React.ReactNode;
  isLoading?: boolean;
}

const Label = (({ children, className, isLoading }: LabelProps) => {
  return (
    <Skeleton
      className={ cn('font-medium self-start', className) }
      loading={ isLoading }
      style={{ marginTop: '5px', marginBottom: '5px' }}
    >
      { children }
    </Skeleton>
  );
});

interface ValueProps {
  className?: string;
  children: React.ReactNode;
}

const Value = (({ children, className }: ValueProps) => {
  return (
    <div className={ cn('py-[5px] text-[var(--color-text-secondary)] overflow-hidden', className) }>
      { children }
    </div>
  );
});

const ListItemMobileGrid = {
  Container,
  Label,
  Value,
};

export default ListItemMobileGrid;
