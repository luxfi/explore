import React from 'react';

import { cn } from 'lib/utils/cn';

interface Props {
  children: React.ReactNode;
  className?: string;
}

const Container = ({ children, className }: Props) => {
  return (
    <div className={ cn('min-w-[100vw] lg:min-w-[fit-content] mx-auto bg-[var(--color-bg-primary)]', className) }>
      { children }
    </div>
  );
};

export default React.memo(Container);
