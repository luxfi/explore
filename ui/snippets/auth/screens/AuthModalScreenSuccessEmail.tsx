import React from 'react';

import type { Screen } from '../types';
import type { UserInfo } from 'types/api/account';

import config from 'configs/app';
import { Button } from 'toolkit/chakra/button';

interface Props {
  email: string;
  onConnectWallet: (screen: Screen) => void;
  onClose: () => void;
  isAuth?: boolean;
  profile: UserInfo | undefined;
}

const AuthModalScreenSuccessEmail = ({ email, onConnectWallet, onClose, isAuth, profile }: Props) => {
  const handleConnectWalletClick = React.useCallback(() => {
    onConnectWallet({ type: 'connect_wallet', isAuth: true, loginToRewards: true });
  }, [ onConnectWallet ]);

  if (isAuth) {
    return (
      <div>
        <p>
          Your account was linked to{ ' ' }
          <span className="font-bold">{ email }</span>{ ' ' }
          email. Use for the next login.
        </p>
        <Button
          className="mt-6"
          variant="outline"
          onClick={ onClose }
        >
          Got it!
        </Button>
      </div>
    );
  }

  return (
    <div>
      <p>
        <span className="font-bold">{ email }</span>{ ' ' }
        email has been successfully used to log in to your Lux account.
      </p>
      { !profile?.address_hash && config.features.blockchainInteraction.isEnabled ? (
        <>
          <p className="mt-6">Add your web3 wallet to safely interact with smart contracts and dapps inside the explorer.</p>
          <Button className="mt-6" onClick={ handleConnectWalletClick }>Connect wallet</Button>
        </>
      ) : (
        <Button
          variant="outline"
          className="mt-6"
          onClick={ onClose }
        >
          Got it!
        </Button>
      ) }
    </div>
  );
};

export default React.memo(AuthModalScreenSuccessEmail);
