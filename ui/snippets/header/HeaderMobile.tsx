import dynamic from 'next/dynamic';
import React from 'react';

import config from 'configs/app';
import { useIsSticky } from 'toolkit/hooks/useIsSticky';
import RewardsButton from 'ui/rewards/RewardsButton';
import NetworkIcon from 'ui/snippets/networkLogo/NetworkIcon';
import UserProfileAuth0 from 'ui/snippets/user/profile/auth0/UserProfileMobile';
import UserProfileOidc from 'ui/snippets/user/profile/oidc/UserProfileDesktop';
import UserWalletMobile from 'ui/snippets/user/wallet/UserWalletMobile';

import RollupStageBadge from '../navigation/RollupStageBadge';
import TestnetBadge from '../navigation/TestnetBadge';
import SearchBarMobile from '../searchBar/SearchBarMobile';
import Burger from './Burger';

const UserProfileDynamic = dynamic(() => import('ui/snippets/user/profile/dynamic/UserProfile'), { ssr: false });

type Props = {
  hideSearchButton?: boolean;
  onGoToSearchResults?: (searchTerm: string) => void;
};

const HeaderMobile = ({ hideSearchButton, onGoToSearchResults }: Props) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const isSticky = useIsSticky(ref, 5);

  const userProfile = (() => {
    const accountFeature = config.features.account;
    if (accountFeature.isEnabled) {
      switch (accountFeature.authProvider) {
        case 'auth0':
          return <UserProfileAuth0/>;
        case 'dynamic':
          return <UserProfileDynamic/>;
        case 'oidc':
          return <UserProfileOidc/>;
        default:
          break;
      }
    }
    // Always render wallet/settings menu
    return <UserWalletMobile/>;
  })();

  return (
    <div
      ref={ ref }
      className="block lg:hidden sticky top-[-1px] left-0 z-[var(--zIndex-sticky2)] pt-[1px] h-[56px]"
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
    >
      <header
        className="flex px-3 py-2 w-full items-center transition-shadow duration-[var(--duration-slow)]"
        style={{
          backgroundColor: 'var(--color-bg-primary)',
          boxShadow: isSticky ? 'var(--shadow-md)' : 'none',
        }}
      >
        <Burger/>
        <div className="flex items-center grow mx-2">
          <NetworkIcon/>
          <TestnetBadge className="ml-2"/>
          <RollupStageBadge className="ml-2"/>
        </div>
        <div className="flex gap-x-2">
          { !hideSearchButton && <SearchBarMobile onGoToSearchResults={ onGoToSearchResults }/> }
          { config.features.rewards.isEnabled && <RewardsButton/> }
          { userProfile }
        </div>
      </header>
    </div>
  );
};

export default React.memo(HeaderMobile);
