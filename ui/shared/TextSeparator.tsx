import React from 'react';

import { cn } from 'lib/utils/cn';

const TextSeparator = ({ id, className, ...props }: React.HTMLAttributes<HTMLSpanElement> & { id?: string }) => {
  return (
    <span
      className={ cn('mx-2 lg:mx-3 text-[var(--color-border-divider)]', className) }
      id={ id }
      { ...props }
    >
      |
    </span>
  );
};

export default React.memo(TextSeparator);
