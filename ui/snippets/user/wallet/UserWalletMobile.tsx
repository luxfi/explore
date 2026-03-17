import React from 'react';

import config from 'configs/app';
import { useMarketplaceContext } from 'lib/contexts/marketplace';
import useWeb3AccountWithDomain from 'lib/web3/useAccountWithDomain';
import useWeb3Wallet from 'lib/web3/useWallet';
import { DrawerTrigger, DrawerRoot, DrawerContent, DrawerBody } from 'toolkit/chakra/drawer';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';

import UserWalletButton from './UserWalletButton';
import UserWalletMenuContent from './UserWalletMenuContent';

const isWalletEnabled = config.features.blockchainInteraction.isEnabled;

const UserWalletMobile = () => {
  const walletMenu = useDisclosure();

  const web3Wallet = useWeb3Wallet({ source: 'Header' });
  const web3AccountWithDomain = useWeb3AccountWithDomain(isWalletEnabled && web3Wallet.isConnected);
  const { isAutoConnectDisabled } = useMarketplaceContext();

  const isPending = isWalletEnabled && (
    (web3Wallet.isConnected && web3AccountWithDomain.isLoading) ||
    (!web3Wallet.isConnected && web3Wallet.isOpen)
  );

  const handleOpenWalletClick = React.useCallback(() => {
    web3Wallet.openModal();
    walletMenu.onClose();
  }, [ web3Wallet, walletMenu ]);

  const handleDisconnectClick = React.useCallback(() => {
    web3Wallet.disconnect();
    walletMenu.onClose();
  }, [ web3Wallet, walletMenu ]);

  const handleOpenChange = React.useCallback(({ open }: { open: boolean }) => {
    if (open) {
      walletMenu.onOpen();
    } else {
      walletMenu.onClose();
    }
  }, [ walletMenu ]);

  return (
    <DrawerRoot
      open={ walletMenu.open }
      onOpenChange={ handleOpenChange }
    >
      <DrawerTrigger>
        <UserWalletButton
          variant="header"
          address={ isWalletEnabled ? web3AccountWithDomain.address : undefined }
          domain={ isWalletEnabled ? web3AccountWithDomain.domain : undefined }
          isPending={ isPending }
        />
      </DrawerTrigger>
      <DrawerContent className="max-w-[300px]">
        <DrawerBody className="p-6">
          <UserWalletMenuContent
            address={ isWalletEnabled ? web3AccountWithDomain.address : undefined }
            domain={ isWalletEnabled ? web3AccountWithDomain.domain : undefined }
            isAutoConnectDisabled={ isAutoConnectDisabled }
            isReconnecting={ isWalletEnabled ? web3Wallet.isReconnecting : false }
            isWalletEnabled={ isWalletEnabled }
            onOpenWallet={ handleOpenWalletClick }
            onDisconnect={ handleDisconnectClick }
            onCloseMenu={ walletMenu.onClose }
          />
        </DrawerBody>
      </DrawerContent>
    </DrawerRoot>
  );
};

export default React.memo(UserWalletMobile);
