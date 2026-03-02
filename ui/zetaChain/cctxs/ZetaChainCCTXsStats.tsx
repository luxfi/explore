import React from 'react';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import getStatsLabelFromTitle from 'lib/stats/getStatsLabelFromTitle';
import { TXS_STATS_MICROSERVICE } from 'stubs/tx';
import StatsWidget from 'ui/shared/stats/StatsWidget';

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

const ZetaChainCCTXsStats = (props: Props) => {
  const isStatsFeatureEnabled = config.features.stats.isEnabled;

  const txsStatsQuery = useApiQuery('stats:pages_transactions', {
    queryOptions: {
      enabled: isStatsFeatureEnabled,
      placeholderData: isStatsFeatureEnabled ? TXS_STATS_MICROSERVICE : undefined,
    },
  });

  if (!txsStatsQuery.data) {
    return null;
  }

  const isLoading = txsStatsQuery.isPlaceholderData;

  const cctxCountTotal = txsStatsQuery.data?.total_zetachain_cross_chain_txns;
  const cctxPendingCountTotal = txsStatsQuery.data?.pending_zetachain_cross_chain_txns;
  const cctxCount24h = txsStatsQuery.data?.new_zetachain_cross_chain_txns_24h;

  const itemsCount = [
    cctxCountTotal,
    cctxPendingCountTotal,
    cctxCount24h,
  ].filter(item => item !== null && item !== undefined).length;

  return (
    <div
      className="grid gap-3 mb-6"
      style={{ gridTemplateColumns: `repeat(${ itemsCount }, minmax(0, 1fr))` }}
      { ...props }
    >
      { cctxCountTotal && (
        <StatsWidget
          label={ getStatsLabelFromTitle(cctxCountTotal.title) }
          value={ Number(cctxCountTotal.value).toLocaleString() }
          isLoading={ isLoading }
        />
      ) }
      { cctxPendingCountTotal && (
        <StatsWidget
          label={ getStatsLabelFromTitle(cctxPendingCountTotal.title) }
          value={ Number(cctxPendingCountTotal.value).toLocaleString() }
          isLoading={ isLoading }
        />
      ) }
      { cctxCount24h && (
        <StatsWidget
          label={ getStatsLabelFromTitle(cctxCount24h.title) }
          value={ Number(cctxCount24h.value).toLocaleString() }
          period="24h"
          isLoading={ isLoading }
        />
      ) }
    </div>
  );
};

export default React.memo(ZetaChainCCTXsStats);
