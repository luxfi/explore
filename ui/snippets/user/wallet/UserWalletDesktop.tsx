import type { ButtonProps } from '@luxfi/ui/button';
import React from 'react';

import config from 'configs/app';
import { useMarketplaceContext } from 'lib/contexts/marketplace';
import useWeb3AccountWithDomain from 'lib/web3/useAccountWithDomain';
import useWeb3Wallet from 'lib/web3/useWallet';
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from '@luxfi/ui/popover';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';

import UserWalletButton from './UserWalletButton';
import UserWalletMenuContent from './UserWalletMenuContent';

interface Props {
  buttonSize?: ButtonProps['size'];
  buttonVariant?: ButtonProps['variant'];
}

const isWalletEnabled = config.features.blockchainInteraction.isEnabled;

const UserWalletDesktop = ({ buttonSize, buttonVariant = 'header' }: Props) => {
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
    <PopoverRoot positioning={{ placement: 'bottom-end' }} lazyMount={ false } open={ walletMenu.open } onOpenChange={ handleOpenChange }>
      <PopoverTrigger>
        <UserWalletButton
          size={ buttonSize }
          variant={ buttonVariant }
          address={ isWalletEnabled ? web3AccountWithDomain.address : undefined }
          domain={ isWalletEnabled ? web3AccountWithDomain.domain : undefined }
          isPending={ isPending }
          isAutoConnectDisabled={ isAutoConnectDisabled }
        />
      </PopoverTrigger>
      <PopoverContent className="w-[280px]">
        <PopoverBody>
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
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
};

export default React.memo(UserWalletDesktop);
