import React from 'react';

import delay from 'lib/delay';
import useWeb3AccountWithDomain from 'lib/web3/useAccountWithDomain';
import useWeb3Wallet from 'lib/web3/useWallet';
import { Button } from '@luxfi/ui/button';
import { IconButton } from '@luxfi/ui/icon-button';
import { Hint } from 'toolkit/components/Hint/Hint';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  onClose?: () => void;
  className?: string;
}

const UserProfileContentWallet = ({ onClose, className }: Props) => {
  const web3Wallet = useWeb3Wallet({ source: 'Profile dropdown' });

  const web3AccountWithDomain = useWeb3AccountWithDomain(true);

  const handleConnectWalletClick = React.useCallback(async() => {
    web3Wallet.openModal();
    await delay(300);
    onClose?.();
  }, [ web3Wallet, onClose ]);

  const handleOpenWalletClick = React.useCallback(async() => {
    web3Wallet.openModal();
    await delay(300);
    onClose?.();
  }, [ web3Wallet, onClose ]);

  const handleAddressClick = React.useCallback(() => {
    onClose?.();
  }, [ onClose ]);

  const content = (() => {
    if (web3Wallet.isConnected && web3AccountWithDomain.address) {
      return (
        <div
        >
          <AddressEntity
            address={{ hash: web3AccountWithDomain.address, ens_domain_name: web3AccountWithDomain.domain }}
            isLoading={ web3AccountWithDomain.isLoading }
            truncation="dynamic"
            noAltHash
            onClick={ handleAddressClick }
          />
          { web3Wallet.isReconnecting ? <div className="animate-spin rounded-full border-2 border-current border-t-transparent h-4 w-4 m-[2px] shrink-0"/> : (
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
    }

    return (
      <Button
        size="sm"
        onClick={ handleConnectWalletClick }
        loading={ web3Wallet.isOpen }
        loadingText="Connect Wallet"
        className="w-full"
      >
        Connect
      </Button>
    );
  })();

  return (
    <div className={ className }>
      <div>
        <span>Connected wallet</span>
        <Hint
          label={
            web3Wallet.isConnected ?
              'This wallet is currently connected to the explorer and used for interacting with apps and smart contracts' :
              'This wallet is used for interacting with apps and smart contracts'
          }
        />
      </div>
      { content }
    </div>
  );
};

export default React.memo(UserProfileContentWallet);
