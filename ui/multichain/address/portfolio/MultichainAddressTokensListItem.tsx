import { BigNumber } from 'bignumber.js';
import React from 'react';

import type { AddressTokensErc20Item } from 'ui/address/tokens/types';

import multichainConfig from 'configs/multichain';
import { getTokenTypeName } from 'lib/token/tokenTypes';
import { Skeleton } from '@luxfi/ui/skeleton';
import { Tag } from '@luxfi/ui/tag';
import NativeTokenTag from 'ui/shared/celo/NativeTokenTag';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import calculateUsdValue from 'ui/shared/value/calculateUsdValue';
import SimpleValue from 'ui/shared/value/SimpleValue';

interface Props {
  data: AddressTokensErc20Item;
  isLoading: boolean;
}

const MultichainAddressTokensListItem = ({ data, isLoading }: Props) => {
  const chainInfo = React.useMemo(() => {
    if (!data.chain_values) {
      return;
    }

    const chainId = Object.keys(data.chain_values)[0];
    const chain = multichainConfig()?.chains.find((chain) => chain.id === chainId);
    return chain;
  }, [ data.chain_values ]);

  const isNativeToken = chainInfo?.app_config.UI.views.address.nativeTokenAddress &&
    data.token.address_hash.toLowerCase() === chainInfo?.app_config.UI.views.address.nativeTokenAddress.toLowerCase();

  const {
    valueBn: tokenQuantity,
    usdBn: tokenValue,
  } = calculateUsdValue({ amount: data.value, exchangeRate: data.token.exchange_rate, decimals: data.token.decimals });

  return (
    <ListItemMobile className="py-3 gap-y-3 text-sm">
      { isNativeToken ?
        <NativeTokenTag chainConfig={ chainInfo?.app_config }/> :
        <Tag loading={ isLoading }>{ getTokenTypeName(data.token.type, chainInfo?.app_config) }</Tag> }
      <TokenEntity
        token={ data.token }
        chain={ chainInfo }
        isLoading={ isLoading }
        noCopy
        jointSymbol
        className="font-semibold w-auto max-w-full"
        noLink={ data.token.type === 'NATIVE' }
      />
      { data.token.type !== 'NATIVE' && (
        <AddressEntity
          address={{ hash: data.token.address_hash }}
          isLoading={ isLoading }
          noIcon
          link={{ variant: 'secondary' }}
          className="w-full"
        />
      ) }
      <div
        className="grid gap-y-3"
        style={{ gridTemplateColumns: 'minmax(auto, 100px) 1fr' }}
      >
        { data.token.exchange_rate ? (
          <>
            <Skeleton loading={ isLoading } fontWeight="500">
              <span>Price</span>
            </Skeleton>
            <SimpleValue
              value={ BigNumber(data.token.exchange_rate) }
              prefix="$"
              loading={ isLoading }
              className={ isNativeToken ? 'text-[var(--color-text-secondary)]' : undefined }
            />
          </>
        ) : null }
        <Skeleton loading={ isLoading } fontWeight="500">
          <span>Quantity</span>
        </Skeleton>
        <SimpleValue
          value={ tokenQuantity }
          loading={ isLoading }
          className={ isNativeToken ? 'text-[var(--color-text-secondary)]' : undefined }
        />
        { data.token.exchange_rate && (
          <>
            <Skeleton loading={ isLoading } fontWeight="500">
              <span>Value</span>
            </Skeleton>
            <SimpleValue
              value={ tokenValue }
              prefix="$"
              loading={ isLoading }
              className={ isNativeToken ? 'text-[var(--color-text-secondary)]' : undefined }
            />
          </>
        ) }
      </div>
    </ListItemMobile>
  );
};

export default React.memo(MultichainAddressTokensListItem);
