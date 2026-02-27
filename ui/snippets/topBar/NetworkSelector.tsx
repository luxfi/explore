import { Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';

import { Button } from 'toolkit/chakra/button';
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from 'toolkit/chakra/popover';
import IconSvg from 'ui/shared/IconSvg';

interface NetworkItem {
  readonly name: string;
  readonly label: string;
  readonly url: string;
  readonly isCurrent: boolean;
}

const NETWORKS: ReadonlyArray<NetworkItem> = [
  { name: 'Mainnet', label: 'Production network', url: 'https://explore.lux.network', isCurrent: true },
  { name: 'Testnet', label: 'Test network', url: 'https://explore.lux-test.network', isCurrent: false },
  { name: 'Devnet', label: 'Development network', url: 'https://explore.lux-dev.network', isCurrent: false },
];

const NetworkSelector = () => {
  const [ open, setOpen ] = React.useState(false);

  const handleOpenChange = React.useCallback(({ open: isOpen }: { open: boolean }) => {
    setOpen(isOpen);
  }, []);

  const handleToggle = React.useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const current = NETWORKS.find((n) => n.isCurrent);

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
          px={ 2.5 }
        >
          <Box boxSize="6px" borderRadius="full" bgColor="green.400" flexShrink={ 0 }/>
          <span>{ current?.name ?? 'Mainnet' }</span>
          <IconSvg name="arrows/east-mini" boxSize={ 4 } transform="rotate(-90deg)"/>
        </Button>
      </PopoverTrigger>
      <PopoverContent w="240px">
        <PopoverBody p={ 0 }>
          <Box px={ 3 } py={ 2 } borderBottom="1px solid" borderColor="border.divider">
            <Text fontSize="xs" fontWeight={ 600 } color="text.secondary" textTransform="uppercase" letterSpacing="wider">
              Network
            </Text>
          </Box>
          { NETWORKS.map((network) => (
            <Box
              key={ network.name }
              as={ network.isCurrent ? 'div' : 'a' }
              { ...(!network.isCurrent ? { href: network.url } : {}) }
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              px={ 3 }
              py={ 2.5 }
              cursor={ network.isCurrent ? 'default' : 'pointer' }
              _hover={ network.isCurrent ? {} : { bg: { _light: 'blackAlpha.50', _dark: 'whiteAlpha.50' } } }
              transition="background 0.15s"
              borderBottom="1px solid"
              borderColor="border.divider"
              _last={{ borderBottom: 'none' }}
              textDecoration="none"
            >
              <Flex direction="column">
                <Flex align="center" gap={ 2 }>
                  <Text fontSize="sm" fontWeight={ 500 } color="text.primary">
                    { network.name }
                  </Text>
                  { network.isCurrent && (
                    <Box boxSize="6px" borderRadius="full" bgColor="green.400"/>
                  ) }
                </Flex>
                <Text fontSize="xs" color="text.secondary">
                  { network.label }
                </Text>
              </Flex>
            </Box>
          )) }
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
};

export default React.memo(NetworkSelector);
