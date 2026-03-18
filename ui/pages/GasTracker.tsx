import React from 'react';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import { HOMEPAGE_STATS } from 'stubs/stats';
import { Alert } from 'toolkit/chakra/alert';
import { Heading } from 'toolkit/chakra/heading';
import { Skeleton } from 'toolkit/chakra/skeleton';
import GasTrackerChart from 'ui/gasTracker/GasTrackerChart';
import GasTrackerFaq from 'ui/gasTracker/GasTrackerFaq';
import GasTrackerNetworkUtilization from 'ui/gasTracker/GasTrackerNetworkUtilization';
import GasTrackerPrices from 'ui/gasTracker/GasTrackerPrices';
import GasInfoUpdateTimer from 'ui/shared/gas/GasInfoUpdateTimer';
import NativeTokenIcon from 'ui/shared/NativeTokenIcon';
import PageTitle from 'ui/shared/Page/PageTitle';
import Time from 'ui/shared/time/Time';

const GasTracker = () => {
  const { data, isPlaceholderData, isError, error, dataUpdatedAt } = useApiQuery('general:stats', {
    queryOptions: {
      placeholderData: HOMEPAGE_STATS,
      refetchOnMount: false,
    },
  });

  if (isError) {
    throw new Error(undefined, { cause: error });
  }

  const isLoading = isPlaceholderData;

  const titleSecondRow = (
    <div className="flex font-heading text-lg w-full gap-x-3 gap-y-1 font-medium items-start lg:items-center flex-col lg:flex-row">
      { typeof data?.network_utilization_percentage === 'number' &&
        <GasTrackerNetworkUtilization percentage={ data.network_utilization_percentage } isLoading={ isLoading }/> }
      { data?.gas_price_updated_at && (
        <Skeleton loading={ isLoading } whiteSpace="pre" display="flex" alignItems="center">
          <span>Last updated </span>
          <Time timestamp={ data.gas_price_updated_at } format="DD MMM, HH:mm:ss" color="text.secondary"/>
          { data.gas_prices_update_in !== 0 && (
            <GasInfoUpdateTimer
              key={ dataUpdatedAt }
              startTime={ dataUpdatedAt }
              duration={ data.gas_prices_update_in }
              className="ml-2"
            />
          ) }
        </Skeleton>
      ) }
      { data?.coin_price && (
        <Skeleton loading={ isLoading } ml={ 0 } display="flex" alignItems="center" className="lg:ml-auto whitespace-pre">
          <NativeTokenIcon className="mr-2 size-6"/>
          <span className="text-[var(--color-text-secondary)]">{ config.chain.currency.symbol }</span>
          <span> ${ Number(data.coin_price).toLocaleString(undefined, { maximumFractionDigits: 2 }) }</span>
        </Skeleton>
      ) }
    </div>
  );

  const snippets = (() => {
    if (!isPlaceholderData && data?.gas_prices?.slow === null && data?.gas_prices.average === null && data.gas_prices.fast === null) {
      return <Alert status="warning">No recent data available</Alert>;
    }

    return data?.gas_prices ? <GasTrackerPrices prices={ data.gas_prices } isLoading={ isLoading }/> : null;
  })();

  const faq = config.meta.seo.enhancedDataEnabled ? <GasTrackerFaq/> : null;

  return (
    <>
      <PageTitle
        title={ config.meta.seo.enhancedDataEnabled ? `${ config.chain.name } gas tracker` : 'Gas tracker' }
        secondRow={ titleSecondRow }
        withTextAd
      />
      <Heading level="2" className="mt-8 mb-4">{ `Track ${ config.chain.name } gas fees` }</Heading>
      { snippets }
      { config.features.stats.isEnabled && (
        <div className="mt-12">
          <GasTrackerChart/>
        </div>
      ) }
      { faq }
    </>
  );
};

export default GasTracker;
