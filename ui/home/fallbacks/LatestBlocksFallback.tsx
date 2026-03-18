import React from 'react';

import FallbackBox from 'ui/shared/fallbacks/FallbackBox';
import IconSvg from 'ui/shared/IconSvg';

const LatestBlocksFallback = () => {
  return (
    <div>
      <div className="text-[var(--chakra-colors-text-secondary)] text-sm">Failed to load data. Please try again later.</div>
      <div className="flex flex-col gap-y-3 mt-3">
        { Array.from({ length: 2 }).map((_, index) => (
          <div key={ index } className="w-full p-3 rounded-md border border-[var(--color-border-divider)]">
            <div className="flex items-center w-full">
              <IconSvg name="block" className="w-5 h-5 text-gray-300 dark:text-white/30"/>
              <FallbackBox className="w-[100px] bg-blue-50 dark:bg-blue-800 ml-2"/>
              <FallbackBox className="w-[50px] ml-auto"/>
            </div>
            <FallbackBox className="w-full mt-2"/>
            <FallbackBox className="w-full mt-1"/>
          </div>
        )) }
      </div>
    </div>
  );
};

export default React.memo(LatestBlocksFallback);
