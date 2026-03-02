import React from 'react';

import { cn } from 'lib/utils/cn';

interface Props {
  className?: string;
  children: React.ReactNode;
}

const Content = ({ children, className }: Props) => {
  return (
    <main className={ cn('pt-0 lg:pt-6 grow', className) }>
      { children }
    </main>
  );
};

export default React.memo(Content);
