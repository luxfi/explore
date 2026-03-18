import React from 'react';

import type { Screen } from '../types';
import type { UserInfo } from 'types/api/account';

import config from 'configs/app';
import shortenString from 'lib/shortenString';
import { Button } from 'toolkit/chakra/button';
import { apos } from 'toolkit/utils/htmlEntities';

interface Props {
  address: string;
  onAddEmail: (screen: Screen) => void;
  onClose: () => void;
  isAuth?: boolean;
  profile: UserInfo | undefined;
  rewardsToken?: string;
}

const AuthModalScreenSuccessWallet = ({ address, onAddEmail, onClose, isAuth, profile, rewardsToken }: Props) => {
  const handleAddEmailClick = React.useCallback(() => {
    onAddEmail({ type: 'email', isAuth: true });
  }, [ onAddEmail ]);

  if (isAuth) {
    return (
      <div>
        <p>
          Your account was linked to{ ' ' }
          <span className="font-bold">{ shortenString(address) }</span>{ ' ' }
          wallet. Use for the next login.
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
        Wallet{ ' ' }
        <span className="font-bold">{ shortenString(address) }</span>{ ' ' }
        has been successfully used to log in to your Lux account
        { Boolean(rewardsToken) && ` and Merits Program` }.
      </p>
      { !profile?.email ? (
        <>
          <p className="mt-6">
            Add your email to receive exclusive updates about { config.chain.name || '' } Explorer { config.features.rewards.isEnabled ? 'Merits ' : ' ' }
            and notifications about addresses in your watch list.
          </p>
          <div className="flex mt-6 gap-6">
            <Button onClick={ handleAddEmailClick }>Add email</Button>
            <Button variant="link" onClick={ onClose }>I{ apos }ll do it later</Button>
          </div>
        </>
      ) : (
        <Button
          className="mt-6"
          variant="outline"
          onClick={ onClose }
        >
          Got it!
        </Button>
      ) }
    </div>
  );
};

export default React.memo(AuthModalScreenSuccessWallet);
