import React from 'react';

import { Skeleton } from 'toolkit/chakra/skeleton';

interface ContainerProps {
  className?: string;
  animation?: string;
  children: React.ReactNode;
}

const Container = (({ animation, children, className }: ContainerProps) => {
  return (
    <div className="grid items-start gap-x-2 gap-y-2 w-full text-sm border-t border-[var(--color-border-divider)] py-4" style={{ gridTemplateColumns: '86px auto' }}
      className={ className }
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
      className={ className }
      loading={ isLoading }
      fontWeight={ 500 }
      alignSelf="start"
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
    <div       className={ className }
      py="5px" className="text-[var(--color-text-secondary)]" className="overflow-hidden"
    >
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
