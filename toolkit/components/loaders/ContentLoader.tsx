import React from 'react';

import { cn } from 'lib/utils/cn';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  text?: string;
}

export const ContentLoader = React.memo(({ text, className, ...props }: Props) => {
  return (
    <div className={ cn('inline-block', className) } { ...props }>
      <div className="w-full h-[6px] relative">
        <div
          className="absolute w-[60px] h-[6px] rounded-full bg-gray-400 left-0 top-0"
          style={{ animation: 'fromLeftToRight 700ms ease-in-out infinite alternate' }}
        />
      </div>
      <span className="block mt-6 text-[var(--color-text-secondary)]">
        { text || 'Loading data, please wait...' }
      </span>
    </div>
  );
});
