import React from 'react';

import LogoIcon from 'icons/networks/logo-placeholder.svg';

interface ChartWatermarkProps extends React.SVGAttributes<SVGSVGElement> {}

export const ChartWatermark = React.memo((props: ChartWatermarkProps) => {
  const { className, ...rest } = props;
  return (
    <svg
      className="absolute opacity-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-[var(--chakra-colors-link-primary)] dark:text-white"
      viewBox="0 0 114 20"
      { ...rest }
    >
      <LogoIcon/>
    </svg>
  );
});
