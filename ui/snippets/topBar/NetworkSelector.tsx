import { Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';

import { NETWORKS, getCurrentNetwork } from 'configs/app/chainRegistry';
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from 'toolkit/chakra/popover';

const NetworkSelector = () => {
  const [ open, setOpen ] = React.useState(false);

  const handleOpenChange = React.useCallback(({ open: isOpen }: { open: boolean }) => {
    setOpen(isOpen);
  }, []);

  const handleToggle = React.useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const current = getCurrentNetwork();

  return (
    <PopoverRoot
      positioning={{ placement: 'bottom-end', offset: { mainAxis: 8 } }}
      lazyMount
      open={ open }
      onOpenChange={ handleOpenChange }
    >
      <PopoverTrigger>
        <Box
          as="button"
          display="flex"
          alignItems="center"
          gap={ 1.5 }
          px={ 2 }
          py={ 1 }
          borderRadius="sm"
          cursor="pointer"
          bg="transparent"
          border="none"
          fontSize="xs"
          fontWeight={ 500 }
          color="text.secondary"
          _hover={{ color: 'text.primary', bg: { _light: 'blackAlpha.50', _dark: 'whiteAlpha.50' } }}
          transition="all 0.15s"
          onClick={ handleToggle }
          flexShrink={ 0 }
        >
          <Box boxSize="6px" borderRadius="full" bgColor="green.400" flexShrink={ 0 }/>
          { current.name }
        </Box>
      </PopoverTrigger>
      <PopoverContent w="200px">
        <PopoverBody p={ 1 }>
          { NETWORKS.map((network) => {
            const isCurrent = network.network === current.network;
            return (
              <Box
                key={ network.network }
                as={ isCurrent ? 'div' : 'a' }
                { ...(!isCurrent ? { href: network.explorerUrl } : {}) }
                display="flex"
                alignItems="center"
                gap={ 2 }
                px={ 2.5 }
                py={ 2 }
                borderRadius="sm"
                cursor={ isCurrent ? 'default' : 'pointer' }
                bg={ isCurrent ? { _light: 'blackAlpha.50', _dark: 'whiteAlpha.50' } : 'transparent' }
                _hover={ isCurrent ? {} : { bg: { _light: 'blackAlpha.50', _dark: 'whiteAlpha.50' } } }
                transition="background 0.15s"
                textDecoration="none"
              >
                <Box
                  boxSize="6px"
                  borderRadius="full"
                  bgColor={ isCurrent ? 'green.400' : 'text.secondary' }
                  flexShrink={ 0 }
                  opacity={ isCurrent ? 1 : 0.4 }
                />
                <Flex direction="column">
                  <Text fontSize="sm" fontWeight={ isCurrent ? 600 : 400 } color="text.primary">
                    { network.name }
                  </Text>
                  <Text fontSize="xs" color="text.secondary">
                    { network.label }
                  </Text>
                </Flex>
              </Box>
            );
          }) }
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
};

export default React.memo(NetworkSelector);
