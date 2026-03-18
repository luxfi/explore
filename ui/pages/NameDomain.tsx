import { useRouter } from 'next/router';
import React from 'react';

import type { TabItemRegular } from 'toolkit/components/AdaptiveTabs/types';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import throwOnResourceLoadError from 'lib/errors/throwOnResourceLoadError';
import getQueryParamString from 'lib/router/getQueryParamString';
import { ENS_DOMAIN } from 'stubs/ENS';
import { Link } from 'toolkit/chakra/link';
import { Tooltip } from 'toolkit/chakra/tooltip';
import RoutedTabs from 'toolkit/components/RoutedTabs/RoutedTabs';
import NameDomainDetails from 'ui/nameDomain/NameDomainDetails';
import NameDomainHistory from 'ui/nameDomain/NameDomainHistory';
import TextAd from 'ui/shared/ad/TextAd';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import EnsEntity from 'ui/shared/entities/ens/EnsEntity';
import IconSvg from 'ui/shared/IconSvg';
import PageTitle from 'ui/shared/Page/PageTitle';

const feature = config.features.nameServices;
const availableProtocols = feature.isEnabled && feature.ens.isEnabled ? feature.ens.protocols : [];

const NameDomain = () => {
  const router = useRouter();
  const domainName = getQueryParamString(router.query.name);
  const protocolId = getQueryParamString(router.query.protocol_id) || availableProtocols[0];

  const infoQuery = useApiQuery('bens:domain_info', {
    pathParams: { name: domainName },
    queryParams: {
      protocol_id: protocolId,
    },
    queryOptions: {
      placeholderData: ENS_DOMAIN,
    },
  });

  const tabs: Array<TabItemRegular> = [
    { id: 'details', title: 'Details', component: <NameDomainDetails query={ infoQuery }/> },
    { id: 'history', title: 'History', component: <NameDomainHistory domain={ infoQuery.data }/> },
  ];

  throwOnResourceLoadError(infoQuery);

  const isLoading = infoQuery.isPlaceholderData;

  const titleSecondRow = (
    <div className="flex items-center w-full gap-x-3 gap-y-3 flex-wrap lg:flex-nowrap">
      <EnsEntity
        domain={ domainName }
        protocol={ infoQuery.data?.protocol }
        isLoading={ isLoading }
        noLink
        className={ infoQuery.data?.resolved_address ? 'lg:max-w-[300px]' : 'lg:max-w-max' }
        variant="subheading"
      />
      { infoQuery.data?.resolved_address && (
        <div className="flex items-center max-w-full gap-x-2">
          <AddressEntity
            address={ infoQuery.data?.resolved_address }
            isLoading={ isLoading }
            variant="subheading"
          />
          <Tooltip content="Lookup for related domain names">
            <Link
              className="shrink-0 inline-flex"
              href={ route({
                pathname: '/name-services',
                query: { tab: 'domains', owned_by: 'true', resolved_to: 'true', address: infoQuery.data?.resolved_address?.hash },
              }) }
            >
              <IconSvg name="search" className="size-5" isLoading={ isLoading }/>
            </Link>
          </Tooltip>
        </div>
      ) }
    </div>
  );

  return (
    <>
      <TextAd className="mb-6"/>
      <PageTitle title="Name details" secondRow={ titleSecondRow }/>
      <RoutedTabs tabs={ tabs } isLoading={ infoQuery.isPlaceholderData }/>
    </>
  );
};

export default NameDomain;
