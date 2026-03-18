import { upperFirst } from 'es-toolkit';
import React from 'react';

import config from 'configs/app';
import { SECOND } from 'toolkit/utils/consts';
import StatsWidget from 'ui/shared/stats/StatsWidget';

const flashblocksFeature = config.features.flashblocks;

interface Props {
  itemsNum: number;
  txsNum: number;
  initialTs: number | undefined;
}

const FlashblocksStats = ({ itemsNum, txsNum, initialTs }: Props) => {

  const timeElapsed = initialTs ? Date.now() - initialTs : undefined;

  if (!flashblocksFeature.isEnabled) {
    return null;
  }

  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-3 gap-1 lg:gap-3 mb-6"
    >
      <StatsWidget
        label={ `${ upperFirst(flashblocksFeature.name) }s (sec)` }
        value={ timeElapsed ? Number(itemsNum / (timeElapsed / SECOND)).toLocaleString(undefined, { maximumFractionDigits: 0 }) : '-' }
      />
      <StatsWidget
        label="TPS"
        value={ timeElapsed && txsNum > 0 ? Number(txsNum / (timeElapsed / SECOND)).toLocaleString(undefined, { maximumFractionDigits: 0 }) : '-' }
      />
      <StatsWidget
        label={ `${ upperFirst(flashblocksFeature.name) } time` }
        value={
          timeElapsed && itemsNum > 0 ?
            Number(timeElapsed / itemsNum).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' ms' :
            '-'
        }
      />
    </div>
  );
};

export default React.memo(FlashblocksStats);
