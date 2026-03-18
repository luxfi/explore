import BigNumber from 'bignumber.js';
import React from 'react';

import { currencyUnits } from 'lib/units';
import { thinsp } from 'toolkit/utils/htmlEntities';

import SimpleValue from './SimpleValue';
import { GWEI, WEI } from './utils';

export interface Props {
  amount: string;
  asset?: string;
  accuracy?: number;
  noTooltip?: boolean;
  loading?: boolean;
  className?: string;
  [key: string]: unknown;
}

const GasPriceValue = ({
  amount,
  asset = currencyUnits.ether,
  accuracy = 0,
  noTooltip,
  loading,
  className,
  ...rest
}: Props) => {
  return (
    <span
      className={ `inline-flex flex-wrap flex-row items-center max-w-full gap-x-1 ${ className ?? '' }`.trim() }
      { ...rest }
    >
      <SimpleValue
        value={ BigNumber(amount).div(WEI) }
        accuracy={ accuracy }
        endElement={ asset ? `${ thinsp }${ asset }` : undefined }
        noTooltip={ noTooltip }
        loading={ loading }
      />
      <SimpleValue
        value={ BigNumber(amount).div(GWEI) }
        accuracy={ accuracy }
        startElement={ <span>(</span> }
        endElement={ `${ thinsp }${ currencyUnits.gwei })` }
        noTooltip={ noTooltip }
        loading={ loading }
        color="text.secondary"
      />
    </span>
  );
};

export default React.memo(GasPriceValue);
