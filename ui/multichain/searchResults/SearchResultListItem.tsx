import React from 'react';

import { cn } from 'lib/utils/cn';
import type { LinkProps } from 'toolkit/next/link';
import { Link } from 'toolkit/next/link';

interface Props extends LinkProps {
  children: React.ReactNode;
}

const SearchResultListItem = ({ children, ...rest }: Props) => {
  return (
    <Link
      className={ cn(
        'group flex items-start lg:items-center flex-col lg:flex-row',
        'gap-y-3 lg:gap-y-0 gap-x-3 pl-1 pr-4 py-3',
        'hover:text-[var(--color-hover)]',
        'border-b border-solid border-[var(--color-border-divider)]',
        'last:border-b-0',
      ) }
      variant="plain"
      { ...rest }
    >
      { children }
    </Link>
  );
};

export default React.memo(SearchResultListItem);
