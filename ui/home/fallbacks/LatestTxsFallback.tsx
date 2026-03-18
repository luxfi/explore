import React from 'react';

import { TableBody, TableCell, TableRoot, TableRow } from 'toolkit/chakra/table';
import FallbackBox from 'ui/shared/fallbacks/FallbackBox';
import IconSvg from 'ui/shared/IconSvg';

const LatestTxsFallback = (props: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div { ...props }>
      <div color="text.secondary" textStyle="sm">Failed to load data. Please try again later.</div>
      <TableRoot className="mt-3 border-t border-[var(--color-border-divider)]">
        <TableBody>
          { Array.from({ length: 2 }).map((_, index) => (
            <TableRow key={ index }>
              <TableCell pl={ 0 } className="pr-3 lg:pr-4 w-[220px] lg:w-1/3">
                <div alignItems="stretch">
                  <div className="flex flex-row items-center">
                    <IconSvg name="transactions" boxSize={ 5 } color={{ _light: 'gray.300', _dark: 'whiteAlpha.300' }}/>
                    <FallbackBox w="90px" bgColor={{ _light: 'blue.50', _dark: 'blue.800' }}/>
                    <FallbackBox w="90px" bgColor={{ _light: 'purple.50', _dark: 'purple.800' }}/>
                  </div>
                  <FallbackBox w="100%"/>
                </div>
              </TableCell>
              <TableCell className="px-3 lg:px-4">
                <div alignItems="stretch">
                  <FallbackBox w="100%" my={ 1 }/>
                  <FallbackBox w="100%"/>
                </div>
              </TableCell>
              <TableCell className="pl-3 lg:pl-4 pr-0 lg:pr-2">
                <div alignItems="stretch">
                  <FallbackBox w="100%" my={ 1 }/>
                  <FallbackBox w="100%"/>
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
