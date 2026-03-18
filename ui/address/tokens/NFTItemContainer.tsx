import React from 'react';

import { cn } from 'lib/utils/cn';

type Props = {
  children: React.ReactNode;
  className?: string;
};

const NFTItemContainer = ({ children, className }: Props) => {
  return (
    <div
      className={ cn(
        'w-full lg:w-[210px] border border-solid border-[var(--chakra-colors-border-divider)]',
        'rounded-[12px] p-[10px] text-sm font-medium leading-[20px]',
        className,
      ) }
    >
      { children }
    </div>
  );
};

export default NFTItemContainer;
