import { Separator } from '@luxfi/ui/separator';
import React from 'react';

import type { NavLink } from './types';
import type { UserInfo } from 'types/api/account';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import { useMarketplaceContext } from 'lib/contexts/marketplace';
import shortenString from 'lib/shortenString';
import { Button } from '@luxfi/ui/button';
import { Link } from 'toolkit/chakra/link';
import { Hint } from 'toolkit/components/Hint/Hint';
import { TruncatedText } from 'toolkit/components/truncation/TruncatedText';
import useLogout from 'ui/snippets/auth/useLogout';

import UserWalletAutoConnectAlert from '../../UserWalletAutoConnectAlert';
import UserProfileContentWallet from '../common/UserProfileContentWallet';
import UserProfileContentNavLink from './UserProfileContentNavLink';

const navLinks: Array<NavLink> = [
  {
    text: 'My profile',
    href: route({ pathname: '/auth/profile' }),
    icon: 'profile' as const,
  },
  {
    text: 'Watch list',
    href: route({ pathname: '/account/watchlist' }),
    icon: 'star_outline' as const,
  },
  {
    text: 'Private tags',
    href: route({ pathname: '/account/tag-address' }),
    icon: 'private_tags' as const,
  },
  {
    text: 'API keys',
    href: route({ pathname: '/account/api-key' }),
    icon: 'API' as const,
  },
  {
    text: 'Custom ABI',
    href: route({ pathname: '/account/custom-abi' }),
    icon: 'ABI' as const,
  },
  config.features.addressVerification.isEnabled && {
    text: 'Verified addrs',
    href: route({ pathname: '/account/verified-addresses' }),
    icon: 'verified' as const,
  },
].filter(Boolean);

interface Props {
  data: UserInfo | undefined;
  onClose: () => void;
  onLogin: () => void;
  onAddEmail: () => void;
  onAddAddress: () => void;
}

const UserProfileContent = ({ data, onClose, onLogin, onAddEmail, onAddAddress }: Props) => {
  const { isAutoConnectDisabled } = useMarketplaceContext();
  const logout = useLogout();

  const handleLogoutClick = React.useCallback(() => {
    logout();
    onClose();
  }, [ logout, onClose ]);

  if (!data) {
    return (
      <div>
        { isAutoConnectDisabled && <UserWalletAutoConnectAlert/> }
        { config.features.blockchainInteraction.isEnabled && <UserProfileContentWallet onClose={ onClose }/> }
        <Button className="mt-3 w-full" onClick={ onLogin } size="sm">Log in</Button>
      </div>
    );
  }

  return (
    <div>
      { isAutoConnectDisabled && <UserWalletAutoConnectAlert/> }

      <div>Account</div>
      <div
       
      >
        { config.features.blockchainInteraction.isEnabled && (
          <div>
            <div>Address</div>
            <Hint
              label={ `This wallet address is linked to your Lux account. It can be used to login ${ config.features.rewards.isEnabled ? 'and is used for Merits Program participation' : '' }` } // eslint-disable-line max-len
              className="ml-1"
            />
            { data?.address_hash ?
              <div>{ shortenString(data?.address_hash) }</div> : <Link className="ml-auto" onClick={ onAddAddress }>Add address</Link> }
          </div>
        ) }
        <div>
          <div>Email</div>
          { data?.email ?
            <TruncatedText text={ data.email }/> : <Link onClick={ onAddEmail }>Add email</Link> }
        </div>
      </div>

      { config.features.blockchainInteraction.isEnabled && <UserProfileContentWallet onClose={ onClose }/> }

      <ul className="flex flex-col gap-0 items-start overflow-hidden mt-4">
        { navLinks.map((item) => (
          <UserProfileContentNavLink
            key={ item.text }
            { ...item }
            onClick={ onClose }
          />
        )) }
      </ul>

      <Separator/>

      <UserProfileContentNavLink
        text="Sign out"
        icon="sign_out"
        onClick={ handleLogoutClick }
      />
    </div>
  );
};

export default React.memo(UserProfileContent);
