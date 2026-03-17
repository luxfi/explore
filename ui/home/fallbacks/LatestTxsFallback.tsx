import type { BoxProps } from '@chakra-ui/react';
import { Box, HStack, VStack } from '@chakra-ui/react';
import React from 'react';

import { TableBody, TableCell, TableRoot, TableRow } from 'toolkit/chakra/table';
import FallbackBox from 'ui/shared/fallbacks/FallbackBox';
import IconSvg from 'ui/shared/IconSvg';

const LatestTxsFallback = (props: BoxProps) => {
  return (
    <Box { ...props }>
      <Box color="text.secondary" textStyle="sm">Failed to load data. Please try again later.</Box>
      <TableRoot className="mt-3 border-t border-[var(--color-border-divider)]">
        <TableBody>
          { Array.from({ length: 2 }).map((_, index) => (
            <TableRow key={ index }>
              <TableCell pl={ 0 } className="pr-3 lg:pr-4 w-[220px] lg:w-1/3">
                <VStack alignItems="stretch">
                  <HStack>
                    <IconSvg name="transactions" boxSize={ 5 } color={{ _light: 'gray.300', _dark: 'whiteAlpha.300' }}/>
                    <FallbackBox w="90px" bgColor={{ _light: 'blue.50', _dark: 'blue.800' }}/>
                    <FallbackBox w="90px" bgColor={{ _light: 'purple.50', _dark: 'purple.800' }}/>
                  </HStack>
                  <FallbackBox w="100%"/>
                </VStack>
              </TableCell>
              <TableCell className="px-3 lg:px-4">
                <VStack alignItems="stretch">
                  <FallbackBox w="100%" my={ 1 }/>
                  <FallbackBox w="100%"/>
                </VStack>
              </TableCell>
              <TableCell className="pl-3 lg:pl-4 pr-0 lg:pr-2">
                <VStack alignItems="stretch">
                  <FallbackBox w="100%" my={ 1 }/>
                  <FallbackBox w="100%"/>
                </VStack>
              </TableCell>
            </TableRow>
          )) }
        </TableBody>
      </TableRoot>
    </Box>
  );
};

export default React.memo(LatestTxsFallback);
