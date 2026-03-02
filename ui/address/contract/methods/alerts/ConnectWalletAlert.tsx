import React from 'react';

import config from 'configs/app';
import useIsMobile from 'lib/hooks/useIsMobile';
import useWeb3Wallet from 'lib/web3/useWallet';
import { Alert } from '@luxfi/ui/alert';
import { Button } from '@luxfi/ui/button';
import { IconButton } from '@luxfi/ui/icon-button';
import { Skeleton } from '@luxfi/ui/skeleton';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  isLoading?: boolean;
}

const ConnectWalletAlert = ({ isLoading }: Props) => {
  const web3Wallet = useWeb3Wallet({ source: 'Smart contracts' });
  const isMobile = useIsMobile();

  const handleOpenWalletClick = React.useCallback(() => {
    web3Wallet.openModal();
  }, [ web3Wallet ]);

  const content = (() => {
    if (!web3Wallet.isConnected) {
      return (
        <div className="flex items-center flex-wrap gap-x-3 gap-y-2">
          <span>To interact with the contract, please</span>
          <Button
            onClick={ web3Wallet.connect }
            size="sm"
            loading={ web3Wallet.isOpen }
            loadingText="Connect your wallet"
          >
            Connect your wallet
          </Button>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-x-2">
        <span>Connected to </span>
        <AddressEntity
          address={{ hash: web3Wallet.address || '' }}
          truncation={ isMobile ? 'constant' : 'dynamic' }
          className="font-semibold"
          noAltHash
          noLink
          noCopy
        />
        { web3Wallet.isReconnecting ? <div className="animate-spin rounded-full border-2 border-current border-t-transparent h-5 w-5 shrink-0 m-[2px]"/> : (
          <IconButton
            aria-label="Open wallet"
            variant="icon_secondary"
            size="2xs"
            onClick={ handleOpenWalletClick }
            loading={ web3Wallet.isOpen }
          >
            <IconSvg name="gear"/>
          </IconButton>
        ) }
      </div>
    );
  })();

  return (
    <Skeleton loading={ isLoading }>
      <Alert status="info" descriptionProps={{ alignItems: 'center' }}>
        { content }
      </Alert>
    </Skeleton>
  );
};

const Fallback = () => null;

export default config.features.blockchainInteraction.isEnabled ? ConnectWalletAlert : Fallback;
