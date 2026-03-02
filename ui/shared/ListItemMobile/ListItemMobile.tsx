import React from 'react';

import { cn } from 'lib/utils/cn';

interface Props {
  children: React.ReactNode;
  className?: string;
  animation?: string;
}

const ListItemMobile = ({ children, className }: Props) => {
  return (
    <div className={ cn(
      'flex items-start flex-col gap-y-6 text-[16px] leading-[20px] border-t border-[var(--color-border-divider)] py-6',
      className,
    ) }>
      { children }
    </div>
  );
};

export default ListItemMobile;
