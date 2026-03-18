import React from 'react';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import dayjs from 'lib/date/dayjs';
import useIsMobile from 'lib/hooks/useIsMobile';
import { HOMEPAGE_STATS } from 'stubs/stats';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import GasInfoTooltip from 'ui/shared/gas/GasInfoTooltip';
import GasPrice from 'ui/shared/gas/GasPrice';
import TextSeparator from 'ui/shared/TextSeparator';

import GetGasButton from './GetGasButton';

const TopBarStats = () => {
  const isMobile = useIsMobile();

  const { data, isPlaceholderData, isError, refetch, dataUpdatedAt } = useApiQuery('general:stats', {
    queryOptions: {
      placeholderData: HOMEPAGE_STATS,
      refetchOnMount: false,
    },
  });

  React.useEffect(() => {
    if (isPlaceholderData || !data?.gas_price_updated_at) {
      return;
    }

    const endDate = dayjs(dataUpdatedAt).add(data.gas_prices_update_in, 'ms');
    const timeout = endDate.diff(dayjs(), 'ms');

    if (timeout <= 0) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      refetch();
    }, timeout);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [ isPlaceholderData, data?.gas_price_updated_at, dataUpdatedAt, data?.gas_prices_update_in, refetch ]);

  if (isError) {
    return <div/>;
  }

  const hasNativeCoinPrice = data?.coin_price && !config.UI.nativeCoinPrice.isHidden;
  const hasSecondaryCoinPrice = data?.secondary_coin_price && config.chain.secondaryCoin.symbol && (hasNativeCoinPrice ? !isMobile : true);
  const hasGasInfo = data?.gas_prices && data.gas_prices.average !== null && config.features.gasTracker.isEnabled && !isMobile;

  return (
    <>
      { Boolean(config.UI.featuredNetworks.items) && <TextSeparator/> }
      <div className="flex items-center font-medium">
        { hasNativeCoinPrice && (
          <div className="flex gap-x-1">
            <Skeleton loading={ isPlaceholderData }>
              <span className="text-[var(--color-text-secondary)]">{ config.chain.currency.symbol } </span>
              <span>${ Number(data.coin_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 }) }</span>
            </Skeleton>
            { data.coin_price_change_percentage && !(isMobile && Boolean(config.UI.featuredNetworks.items)) && (
              <Skeleton loading={ isPlaceholderData }>
                <span className={ Number(data.coin_price_change_percentage) >= 0 ? 'text-green-500' : 'text-red-500' }>
                  { Number(data.coin_price_change_percentage).toFixed(2) }%
                </span>
              </Skeleton>
            ) }
          </div>
        ) }
        { hasSecondaryCoinPrice && (
          <div className={ `flex gap-x-1${ data?.coin_price ? ' ml-3' : '' }` }>
            <Skeleton loading={ isPlaceholderData }>
              <span className="text-[var(--color-text-secondary)]">{ config.chain.secondaryCoin.symbol } </span>
              <span>${ Number(data.secondary_coin_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 }) }</span>
            </Skeleton>
          </div>
        ) }
        { (hasNativeCoinPrice || hasSecondaryCoinPrice) && hasGasInfo && <TextSeparator/> }
        { hasGasInfo && (
          <>
            <Skeleton loading={ isPlaceholderData } whiteSpace="pre-wrap">
              <span className="text-[var(--color-text-secondary)]">Gas </span>
              <GasInfoTooltip data={ data } dataUpdatedAt={ dataUpdatedAt } placement={ !data?.coin_price ? 'bottom' : undefined }>
                <Link>
                  <GasPrice data={ data.gas_prices?.average ?? null }/>
                </Link>
              </GasInfoTooltip>
            </Skeleton>
            { !isPlaceholderData && <GetGasButton/> }
          </>
        ) }
      </div>
    </>
  );
};

export default React.memo(TopBarStats);
