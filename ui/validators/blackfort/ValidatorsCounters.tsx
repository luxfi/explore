import React from 'react';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import { VALIDATORS_BLACKFORT_COUNTERS } from 'stubs/validators';
import StatsWidget from 'ui/shared/stats/StatsWidget';

const ValidatorsCounters = () => {
  const countersQuery = useApiQuery('general:validators_blackfort_counters', {
    queryOptions: {
      enabled: config.features.validators.isEnabled,
      placeholderData: VALIDATORS_BLACKFORT_COUNTERS,
    },
  });

  if (!countersQuery.data) {
    return null;
  }

  return (
    <div className="grid" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
      <StatsWidget
        label="Total validators"
        value={ Number(countersQuery.data.validators_count).toLocaleString() }
        diff={ Number(countersQuery.data.new_validators_count_24h).toLocaleString() }
        isLoading={ countersQuery.isPlaceholderData }
      />
    </div>
  );
};

export default React.memo(ValidatorsCounters);
