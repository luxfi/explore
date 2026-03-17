import React from 'react';

import { cn } from 'lib/utils/cn';
import type { LinkProps } from 'toolkit/chakra/link';
import { Link } from 'toolkit/chakra/link';

interface Props extends LinkProps {};

const SearchBarSuggestItemLink = React.forwardRef<HTMLAnchorElement, Props>(({ children, className, ...rest }, ref) => {
  return (
    <Link
      ref={ ref }
      className={ cn(
        'py-3 px-0 lg:px-1 flex flex-col items-stretch text-sm',
        'border-b border-[var(--color-border-divider)]',
        'last:border-b-0',
        'hover:bg-[var(--color-gray-100)] dark:hover:bg-[var(--color-gray-800)]',
        'first:mt-2',
        'gap-y-2',
        className,
      ) }
      variant="plain"
      { ...rest }
    >
      { children }
    </Link>
  );
});

export default SearchBarSuggestItemLink;
