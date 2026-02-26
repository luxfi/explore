// Chain switcher dropdown for the top bar.
// Shows all Lux chains with links to their respective explorer instances.

import { Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';

import { Button } from 'toolkit/chakra/button';
import { Link } from 'toolkit/chakra/link';
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from 'toolkit/chakra/popover';
import IconSvg from 'ui/shared/IconSvg';

interface ChainItem {
  readonly name: string;
  readonly label: string;
  readonly vm: string;
  readonly url: string | undefined;
  readonly isCurrent: boolean;
}

const CHAINS: ReadonlyArray<ChainItem> = [
  { name: 'C-Chain', label: 'Contract Chain', vm: 'EVM', url: 'https://explore.lux.network', isCurrent: true },
  { name: 'Zoo', label: 'Zoo Chain', vm: 'Subnet EVM', url: 'https://explore-zoo.lux.network', isCurrent: false },
  { name: 'Hanzo', label: 'Hanzo AI', vm: 'Subnet EVM', url: 'https://explore-hanzo.lux.network', isCurrent: false },
  { name: 'SPC', label: 'SPC Chain', vm: 'Subnet EVM', url: 'https://explore-spc.lux.network', isCurrent: false },
  { name: 'Pars', label: 'Pars Chain', vm: 'Subnet EVM', url: 'https://explore-pars.lux.network', isCurrent: false },
];

const ChainSwitcher = () => {
  const [ open, setOpen ] = React.useState(false);

  const handleOpenChange = React.useCallback(({ open: isOpen }: { open: boolean }) => {
    setOpen(isOpen);
  }, []);

  const handleToggle = React.useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  return (
    <PopoverRoot
      positioning={{ placement: 'bottom-end', offset: { mainAxis: 6 } }}
      lazyMount
      open={ open }
      onOpenChange={ handleOpenChange }
    >
      <PopoverTrigger>
        <Button
          variant="outline"
          size="2xs"
          fontWeight={ 500 }
          onClick={ handleToggle }
          borderColor="border.divider"
          px={ 3 }
        >
          <IconSvg name="networks" boxSize="14px"/>
          <span>C-Chain</span>
          <IconSvg name="arrows/east-mini" boxSize={ 4 } transform="rotate(-90deg)"/>
        </Button>
      </PopoverTrigger>
      <PopoverContent w="280px">
        <PopoverBody p={ 0 }>
          <Box px={ 3 } py={ 2 } borderBottom="1px solid" borderColor="border.divider">
            <Text fontSize="xs" fontWeight={ 600 } color="text.secondary" textTransform="uppercase" letterSpacing="wider">
              Switch Chain
            </Text>
          </Box>
          { CHAINS.map((chain) => (
            <Box
              key={ chain.name }
              as={ chain.url && !chain.isCurrent ? 'a' : 'div' }
              { ...(chain.url && !chain.isCurrent ? { href: chain.url } : {}) }
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              px={ 3 }
              py={ 2.5 }
              cursor={ chain.isCurrent ? 'default' : 'pointer' }
              _hover={ chain.isCurrent ? {} : { bg: { _light: 'gray.50', _dark: 'whiteAlpha.50' } } }
              transition="background 0.15s"
              borderBottom="1px solid"
              borderColor="border.divider"
              _last={{ borderBottom: 'none' }}
              textDecoration="none"
            >
              <Flex direction="column">
                <Flex align="center" gap={ 2 }>
                  <Text fontSize="sm" fontWeight={ 500 } color="text.primary">
                    { chain.name }
                  </Text>
                  { chain.isCurrent && (
                    <Box
                      bgColor="green.400"
                      borderRadius="full"
                      boxSize="6px"
                    />
                  ) }
                </Flex>
                <Text fontSize="xs" color="text.secondary">
                  { chain.label }
                </Text>
              </Flex>
              <Box
                bgColor={{ _light: 'gray.100', _dark: 'whiteAlpha.100' }}
                color="text.secondary"
                borderRadius="sm"
                px={ 1.5 }
                py={ 0.5 }
                fontSize="xs"
                fontFamily="mono"
              >
                { chain.vm }
              </Box>
            </Box>
          )) }
          <Flex justify="center" py={ 2 } borderTop="1px solid" borderColor="border.divider">
            <Link
              href="/chains"
              textStyle="xs"
            >
              View all chains
            </Link>
          </Flex>
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
};

export default React.memo(ChainSwitcher);
