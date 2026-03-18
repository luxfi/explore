import React from 'react';

interface Props {
  children: React.ReactNode;
}

const ChainIndicatorsContainer = ({ children }: Props) => {
  return (
    <div
      className="px-3 lg:px-4 py-3 rounded-[var(--radius-base,8px)] gap-x-3 lg:gap-x-4 gap-y-0 basis-1/2 grow flex items-stretch bg-[var(--color-theme-stats-bg-light)] dark:bg-[var(--color-theme-stats-bg-dark)]"
    >
      { children }
    </div>
  );
};

export default React.memo(ChainIndicatorsContainer);
