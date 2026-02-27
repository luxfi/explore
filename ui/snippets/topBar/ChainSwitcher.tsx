import { Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';

import { getCurrentChain, getCurrentNetwork, getChainsForNetwork } from 'configs/app/chainRegistry';
import { Link } from 'toolkit/chakra/link';
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from 'toolkit/chakra/popover';

const ChainSwitcher = () => {
  const [ open, setOpen ] = React.useState(false);

  const handleOpenChange = React.useCallback(({ open: isOpen }: { open: boolean }) => {
    setOpen(isOpen);
  }, []);

  const handleToggle = React.useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const current = getCurrentChain();
  const network = getCurrentNetwork();
  const chains = getChainsForNetwork(network.network);

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
          border="1px solid"
          borderColor="border.divider"
          fontSize="xs"
          fontWeight={ 500 }
          color="text.primary"
          bg="transparent"
          _hover={{ bg: { _light: 'blackAlpha.50', _dark: 'whiteAlpha.50' } }}
          transition="all 0.15s"
          onClick={ handleToggle }
          flexShrink={ 0 }
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="14" height="14" style={{ flexShrink: 0 }}>
            <path d={ current.branding.logoSvg } fill="currentColor"/>
          </svg>
          { current.name }
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="12" height="12">
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </Box>
      </PopoverTrigger>
      <PopoverContent w="240px">
        <PopoverBody p={ 1 }>
          <Box px={ 2 } py={ 1.5 }>
            <Text fontSize="xs" fontWeight={ 600 } color="text.secondary" textTransform="uppercase" letterSpacing="wider">
              Switch Chain
            </Text>
          </Box>
          { chains.map((chain) => {
            const isCurrent = chain.name === current.name && chain.network === current.network;
            return (
              <Box
                key={ `${ chain.network }-${ chain.name }` }
                as={ isCurrent ? 'div' : 'a' }
                { ...(!isCurrent ? { href: chain.explorerUrl } : {}) }
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                px={ 2.5 }
                py={ 2 }
                borderRadius="sm"
                cursor={ isCurrent ? 'default' : 'pointer' }
                bg={ isCurrent ? { _light: 'blackAlpha.50', _dark: 'whiteAlpha.50' } : 'transparent' }
                _hover={ isCurrent ? {} : { bg: { _light: 'blackAlpha.50', _dark: 'whiteAlpha.50' } } }
                transition="background 0.15s"
                textDecoration="none"
              >
                <Flex alignItems="center" gap={ 2 }>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="16" height="16" style={{ flexShrink: 0 }}>
                    <path d={ chain.branding.logoSvg } fill="currentColor"/>
                  </svg>
                  <Flex direction="column">
                    <Text fontSize="sm" fontWeight={ isCurrent ? 600 : 400 } color="text.primary">
                      { chain.branding.brandName }
                    </Text>
                    <Text fontSize="xs" color="text.secondary">
                      { chain.label }
                    </Text>
                  </Flex>
                </Flex>
                <Box
                  bgColor={{ _light: 'blackAlpha.50', _dark: 'whiteAlpha.100' }}
                  color="text.secondary"
                  borderRadius="sm"
                  px={ 1.5 }
                  py={ 0.5 }
                  fontSize="2xs"
                  fontFamily="mono"
                >
                  { chain.vm }
                </Box>
              </Box>
            );
          }) }
          <Box px={ 2 } py={ 1.5 } borderTop="1px solid" borderColor="border.divider" mt={ 1 }>
            <Link href="/chains" textStyle="xs" color="text.secondary" _hover={{ color: 'text.primary' }}>
              View all chains
            </Link>
          </Box>
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
};

export default React.memo(ChainSwitcher);
