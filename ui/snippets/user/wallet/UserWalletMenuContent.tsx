import { Box, Flex, Separator, Spinner, Text, VStack } from '@chakra-ui/react';
import React from 'react';

import delay from 'lib/delay';
import { Button } from 'toolkit/chakra/button';
import { IconButton } from 'toolkit/chakra/icon-button';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import IconSvg from 'ui/shared/IconSvg';
import SettingsAddressFormat from 'ui/snippets/topBar/settings/SettingsAddressFormat';
import SettingsColorTheme from 'ui/snippets/topBar/settings/SettingsColorTheme';
import SettingsIdentIcon from 'ui/snippets/topBar/settings/SettingsIdentIcon';
import SettingsLocalTime from 'ui/snippets/topBar/settings/SettingsLocalTime';
import SettingsScamTokens from 'ui/snippets/topBar/settings/SettingsScamTokens';

import UserWalletAutoConnectAlert from '../UserWalletAutoConnectAlert';

interface Props {
  address?: string;
  domain?: string;
  isAutoConnectDisabled?: boolean;
  isReconnecting?: boolean;
  isWalletEnabled?: boolean;
  onDisconnect: () => void;
  onOpenWallet: () => void;
  onCloseMenu: () => void;
}

const UserWalletMenuContent = ({
  isAutoConnectDisabled,
  address,
  domain,
  isReconnecting,
  isWalletEnabled,
  onDisconnect,
  onOpenWallet,
  onCloseMenu,
}: Props) => {

  const handleOpenWalletClick = React.useCallback(async() => {
    await delay(100);
    onOpenWallet();
  }, [ onOpenWallet ]);

  const handleConnectClick = React.useCallback(() => {
    onCloseMenu();
    onOpenWallet();
  }, [ onCloseMenu, onOpenWallet ]);

  return (
    <Box>
      { /* Wallet section */ }
      { isWalletEnabled && address && (
        <>
          { isAutoConnectDisabled && <UserWalletAutoConnectAlert/> }
          <Text fontSize="sm" fontWeight={ 600 } mb={ 1 }>My wallet</Text>
          <Flex alignItems="center" columnGap={ 2 } justifyContent="space-between">
            <AddressEntity
              address={{ hash: address, ens_domain_name: domain }}
              truncation="dynamic"
              fontSize="sm"
              fontWeight={ 700 }
            />
            { isReconnecting ? <Spinner size="sm" m="2px" flexShrink={ 0 }/> : (
              <IconButton
                aria-label="Open wallet"
                variant="icon_secondary"
                size="2xs"
                onClick={ handleOpenWalletClick }
              >
                <IconSvg name="gear"/>
              </IconButton>
            ) }
          </Flex>
          <Button size="sm" width="full" variant="outline" onClick={ onDisconnect } mt={ 3 }>
            Disconnect
          </Button>
          <Separator my={ 3 }/>
        </>
      ) }
      { isWalletEnabled && !address && (
        <>
          <Button size="sm" width="full" variant="outline" onClick={ handleConnectClick }>
            Connect wallet
          </Button>
          <Separator my={ 3 }/>
        </>
      ) }
      { /* Settings section */ }
      <SettingsColorTheme onSelect={ onCloseMenu }/>
      <Separator my={ 3 }/>
      <SettingsIdentIcon/>
      <SettingsAddressFormat/>
      <Separator my={ 3 }/>
      <VStack gap={ 1 }>
        <SettingsScamTokens/>
        <SettingsLocalTime/>
      </VStack>
    </Box>
  );
};

export default React.memo(UserWalletMenuContent);
