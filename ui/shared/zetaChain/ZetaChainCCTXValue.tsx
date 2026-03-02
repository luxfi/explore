import React from 'react';

import { CoinType } from '@luxfi/zetachain-cctx-types';

import config from 'configs/app';
import { cn } from 'lib/utils/cn';
import { Skeleton } from '@luxfi/ui/skeleton';
import calculateUsdValue from 'ui/shared/value/calculateUsdValue';

type Props = {
  coinType: CoinType;
  tokenSymbol?: string;
  amount: string;
  decimals?: number | null;
  isLoading?: boolean;
  className?: string;
  accuracy?: number;
};

const ZetaChainCCTXValue = ({ coinType, tokenSymbol, amount, decimals, isLoading, className, accuracy = 8 }: Props) => {
  let unit: string;
  let value: string | undefined;
  switch (coinType) {
    case CoinType.Erc20:
      unit = tokenSymbol || 'Unnamed token';
      value = calculateUsdValue({ amount, decimals: decimals?.toString() || '18', accuracy }).valueStr;
      break;
    case CoinType.Zeta:
      unit = config.chain.currency.symbol || config.chain.currency.name || '';
      value = calculateUsdValue({ amount, decimals: config.chain.currency.decimals?.toString() || '18', accuracy }).valueStr;
      break;
    case CoinType.Gas:
      unit = tokenSymbol || 'Unnamed token';
      value = calculateUsdValue({ amount, decimals: decimals?.toString() || '18', accuracy }).valueStr;
      break;
    default:
      unit = '-';
      break;
  }

  return (
    <Skeleton loading={ isLoading } className={ cn('flex gap-1 overflow-hidden', className) }>
      <span className="overflow-hidden whitespace-nowrap text-ellipsis">{ value }</span>
      <span className="text-[var(--color-text-secondary)] whitespace-nowrap overflow-hidden text-ellipsis">{ unit }</span>
    </Skeleton>
  );
};

export default React.memo(ZetaChainCCTXValue);
