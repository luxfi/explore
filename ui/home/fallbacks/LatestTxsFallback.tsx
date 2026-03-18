import React from 'react';

import { TableBody, TableCell, TableRoot, TableRow } from 'toolkit/chakra/table';
import FallbackBox from 'ui/shared/fallbacks/FallbackBox';
import IconSvg from 'ui/shared/IconSvg';

const LatestTxsFallback = (props: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div { ...props }>
      <div className="text-[var(--chakra-colors-text-secondary)] text-sm">Failed to load data. Please try again later.</div>
      <TableRoot className="mt-3 border-t border-[var(--color-border-divider)]">
        <TableBody>
          { Array.from({ length: 2 }).map((_, index) => (
            <TableRow key={ index }>
              <TableCell className="pl-0 pr-3 lg:pr-4 w-[220px] lg:w-1/3">
                <div className="flex flex-col items-stretch">
                  <div className="flex flex-row items-center">
                    <IconSvg name="transactions" className="w-5 h-5 text-gray-300 dark:text-white/30"/>
                    <FallbackBox className="w-[90px] bg-blue-50 dark:bg-blue-800"/>
                    <FallbackBox className="w-[90px] bg-purple-50 dark:bg-purple-800"/>
                  </div>
                  <FallbackBox className="w-full"/>
                </div>
              </TableCell>
              <TableCell className="px-3 lg:px-4">
                <div className="flex flex-col items-stretch">
                  <FallbackBox className="w-full my-1"/>
                  <FallbackBox className="w-full"/>
                </div>
              </TableCell>
              <TableCell className="pl-3 lg:pl-4 pr-0 lg:pr-2">
                <div className="flex flex-col items-stretch">
                  <FallbackBox className="w-full my-1"/>
                  <FallbackBox className="w-full"/>
                </div>
              </TableCell>
            </TableRow>
          )) }
        </TableBody>
      </TableRoot>
    </div>
  );
};

export default React.memo(LatestTxsFallback);
