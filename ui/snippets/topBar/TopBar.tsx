import { Flex, Box, HStack } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import { CONTENT_MAX_WIDTH } from 'ui/shared/layout/utils';

import ChainSwitcher from './ChainSwitcher';
import DeFiDropdown from './DeFiDropdown';
import NetworkMenu from './NetworkMenu';

const TopBar = () => {
  const hasDeFiDropdown = Boolean(config.features.deFiDropdown.isEnabled);

  return (
    // not ideal if scrollbar is visible, but better than having a horizontal scroll
    <Box bgColor={{ _light: 'theme.topbar.bg._light', _dark: 'theme.topbar.bg._dark' }} position="sticky" left={ 0 } width="100%" maxWidth="100vw">
      <Flex
        py={ 2 }
        px={{ base: 3, lg: 6 }}
        m="0 auto"
        justifyContent="space-between"
        alignItems="center"
        maxW={ `${ CONTENT_MAX_WIDTH }px` }
      >
        <HStack gap={ 2 } fontSize="xs">
          { Boolean(config.UI.featuredNetworks.items) && <NetworkMenu/> }
          <ChainSwitcher/>
        </HStack>
        <HStack alignItems="center" gap={ 2 }>
          { hasDeFiDropdown && <DeFiDropdown/> }
        </HStack>
      </Flex>
    </Box>
  );
};

export default React.memo(TopBar);
