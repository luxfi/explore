import React from 'react';

import config from 'configs/app';
import useNavItems, { isGroupItem } from 'lib/hooks/useNavItems';
import { Separator } from 'toolkit/chakra/separator';
import RewardsButton from 'ui/rewards/RewardsButton';
import { CONTENT_MAX_WIDTH } from 'ui/shared/layout/utils';
import useIsAuth from 'ui/snippets/auth/useIsAuth';
import NetworkLogo from 'ui/snippets/networkLogo/NetworkLogo';
import UserProfileDesktop from 'ui/snippets/user/UserProfileDesktop';

import NavigationPromoBanner from '../promoBanner/NavigationPromoBanner';
import RollupStageBadge from '../RollupStageBadge';
import TestnetBadge from '../TestnetBadge';
import NavLink from './NavLink';
import NavLinkGroup from './NavLinkGroup';

const accountFeature = config.features.account;

const NavigationDesktop = () => {
  const { mainNavItems, accountNavItems } = useNavItems();
  const isAuth = useIsAuth();

  const accountNavGroup = React.useMemo(() => {
    if (accountFeature.isEnabled && accountFeature.authProvider === 'dynamic' && isAuth) {
      return {
        text: 'Account',
        subItems: accountNavItems,
      };
    }
  }, [ accountNavItems, isAuth ]);

  return (
    <div className="border-b border-[var(--color-border-divider)]">
      <div
        className="hidden lg:flex items-center px-6 py-2 mx-auto"
        style={{ maxWidth: `${ CONTENT_MAX_WIDTH }px` }}
      >
        <NetworkLogo/>
        <TestnetBadge className="ml-3"/>
        <RollupStageBadge className="ml-3"/>
        <nav className="ml-auto">
          <ul className="flex gap-x-2 items-center">
            { mainNavItems.map((item) => {
              if (isGroupItem(item)) {
                return <NavLinkGroup key={ item.text } item={ item }/>;
              } else {
                return <NavLink key={ item.text } item={ item } noIcon className="py-1.5 w-fit"/>;
              }
            }) }
            { accountNavGroup && (
              <>
                <Separator orientation="vertical" className="mx-0 h-4"/>
                <NavLinkGroup key={ accountNavGroup.text } item={ accountNavGroup }/>
              </>
            ) }
          </ul>
        </nav>
        <div className="flex gap-2 ml-8">
          <NavigationPromoBanner/>
          { config.features.rewards.isEnabled && <RewardsButton size="sm"/> }
          <UserProfileDesktop buttonSize="sm"/>
        </div>
      </div>
    </div>
  );
};

export default React.memo(NavigationDesktop);
