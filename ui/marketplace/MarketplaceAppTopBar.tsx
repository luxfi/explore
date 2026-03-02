import React from 'react';

import type { MarketplaceApp } from 'types/client/marketplace';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import { useAppContext } from 'lib/contexts/app';
import useIsMobile from 'lib/hooks/useIsMobile';
import * as mixpanel from 'lib/mixpanel/index';
import { Link } from 'toolkit/next/link';
import { BackToButton } from 'toolkit/components/buttons/BackToButton';
import { makePrettyLink } from 'toolkit/utils/url';
import RewardsButton from 'ui/rewards/RewardsButton';
import NetworkIcon from 'ui/snippets/networkLogo/NetworkIcon';
import UserProfileDesktop from 'ui/snippets/user/UserProfileDesktop';

import MarketplaceAppInfo from './MarketplaceAppInfo';
import Rating from './Rating/Rating';

type Props = { appId: string; data: MarketplaceApp | undefined; isLoading: boolean };

const MarketplaceAppTopBar = ({ appId, data, isLoading }: Props) => {
  const appProps = useAppContext();
  const isMobile = useIsMobile();
  const goBackUrl = React.useMemo(() => {
    if (appProps.referrer && appProps.referrer.includes('/apps') && !appProps.referrer.includes('/apps/')) {
      return appProps.referrer;
    }
    return route({ pathname: '/apps' });
  }, [ appProps.referrer ]);
  const handleBackToClick = React.useCallback(() => {
    mixpanel.logEvent(mixpanel.EventTypes.BUTTON_CLICK, { Content: 'Back to', Source: mixpanel.PAGE_TYPE_DICT['/apps/[id]'] });
  }, []);

  return (
    <div className="flex flex-wrap items-center mb-3 md:mb-2 gap-y-3 gap-x-2">
      { !isMobile && <NetworkIcon className="mr-4"/> }
      <BackToButton href={ goBackUrl } hint="Back to dApps list" loading={ isLoading } onClick={ handleBackToClick }/>
      <Link external href={ data?.url } variant="underlaid" className="text-sm min-w-0 max-w-[calc(100%-114px)] md:max-w-none flex" loading={ isLoading }>
        <span className="truncate">{ makePrettyLink(data?.url)?.domain }</span>
      </Link>
      <MarketplaceAppInfo data={ data } isLoading={ isLoading }/>
      <Rating appId={ appId } rating={ data?.rating } ratingsTotalCount={ data?.ratingsTotalCount } userRating={ data?.userRating } isLoading={ isLoading } source="App page"/>
      { !isMobile && (
        <div className="flex ml-auto gap-2">
          { config.features.rewards.isEnabled && <RewardsButton size="sm"/> }
          <UserProfileDesktop buttonSize="sm"/>
        </div>
      ) }
    </div>
  );
};

export default MarketplaceAppTopBar;
