import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import { INTERCHAIN_STATS_DAILY } from 'stubs/interchainIndexer';
import StatsWidget from 'ui/shared/stats/StatsWidget';

const TransactionsCrossChainStats = () => {
  const { data, isPlaceholderData, isError } = useApiQuery('interchainIndexer:stats_daily', {
    queryOptions: {
      placeholderData: INTERCHAIN_STATS_DAILY,
    },
  });

  if (isError || !data) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-3 mb-6">
      <StatsWidget
        label="Cross-chain txns"
        value={ Number(data.daily_messages).toLocaleString() }
        period="24h"
        isLoading={ isPlaceholderData }
      />
    </div>
  );
};

export default React.memo(TransactionsCrossChainStats);
