import BigNumber from 'bignumber.js';
import React from 'react';

import type { WatchlistAddress } from 'types/api/account';

import config from 'configs/app';
import { currencyUnits } from 'lib/units';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { nbsp } from 'toolkit/utils/htmlEntities';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import * as TokenEntity from 'ui/shared/entities/token/TokenEntity';
import IconSvg from 'ui/shared/IconSvg';
import calculateUsdValue from 'ui/shared/value/calculateUsdValue';
import NativeCoinValue from 'ui/shared/value/NativeCoinValue';
import SimpleValue from 'ui/shared/value/SimpleValue';
import { DEFAULT_ACCURACY_USD } from 'ui/shared/value/utils';

const WatchListAddressItem = ({ item, isLoading }: { item: WatchlistAddress; isLoading?: boolean }) => {
  const nativeTokenData = React.useMemo(() => ({
    name: config.chain.currency.name || '',
    icon_url: '',
    symbol: '',
    address_hash: '',
    type: 'ERC-20' as const,
    reputation: null,
  }), [ ]);

  const { usdBn: usdNative } = calculateUsdValue(
    {
      amount: item.address_balance,
      exchangeRate: item.exchange_rate,
      decimals: String(config.chain.currency.decimals),
    },
  );

  return (
    <div className="flex flex-col gap-3 font-medium">
      <AddressEntity
        address={ item.address }
        isLoading={ isLoading }
        className="font-semibold"

      />
      <div className="flex">
        <TokenEntity.Icon
          token={ nativeTokenData }
          isLoading={ isLoading }
        />
        <Skeleton loading={ isLoading } className="whitespace-pre inline-flex">
          <span>{ currencyUnits.ether } balance: </span>
          <NativeCoinValue
            amount={ item.address_balance }
            exchangeRate={ item.exchange_rate }
            noSymbol
          />
        </Skeleton>
      </div>
      { Boolean(item.tokens_count) && (
        <div className="flex flex-row">
          <IconSvg name="tokens" className="size-5" isLoading={ isLoading }/>
          <Skeleton loading={ isLoading } display="inline-flex">
            <span>{ `Tokens:${ nbsp }` + item.tokens_count + (item.tokens_overflow ? '+' : '') }</span>
            <span>{ `${ nbsp }($${ BigNumber(item.tokens_fiat_value).toFormat(2) })` }</span>
          </Skeleton>
        </div>
      ) }
      { Boolean(item.tokens_fiat_value) && (
        <SimpleValue
          value={ BigNumber(item.tokens_fiat_value).plus(usdNative) }
          prefix="$"
          startElement={ (
            <div className="flex flex-row">
              <IconSvg className="size-5" name="wallet" isLoading={ isLoading }/>
              <span>Net worth:{ nbsp }</span>
            </div>
          ) }
          accuracy={ DEFAULT_ACCURACY_USD }
          loading={ isLoading }
          overflowed={ item.tokens_overflow }
          className="pl-7"
        />
      ) }
    </div>
  );
};

export default WatchListAddressItem;
