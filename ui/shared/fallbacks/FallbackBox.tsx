import React from 'react';

import { cn } from 'lib/utils/cn';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const FallbackBox = ({ className, ...props }: Props) => {
  return <div className={ cn('h-3 bg-[var(--color-blackAlpha-50)] dark:bg-[var(--color-whiteAlpha-100)] rounded-sm', className) } { ...props }/>;
};

export default React.memo(FallbackBox);
