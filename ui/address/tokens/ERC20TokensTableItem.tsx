import { BigNumber } from 'bignumber.js';
import React from 'react';

import type { AddressTokensErc20Item } from './types';

import config from 'configs/app';
import multichainConfig from 'configs/multichain';
import { getTokenTypeName, isConfidentialTokenType } from 'lib/token/tokenTypes';
import { TableCell, TableRow } from '@luxfi/ui/table';
import { Tag } from '@luxfi/ui/tag';
import AddressAddToWallet from 'ui/shared/address/AddressAddToWallet';
import NativeTokenTag from 'ui/shared/celo/NativeTokenTag';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';
import calculateUsdValue from 'ui/shared/value/calculateUsdValue';
import ConfidentialValue from 'ui/shared/value/ConfidentialValue';
import SimpleValue from 'ui/shared/value/SimpleValue';
import { DEFAULT_ACCURACY_USD } from 'ui/shared/value/utils';

type Props = AddressTokensErc20Item & { isLoading: boolean; hasAdditionalTokenTypes?: boolean };

const ERC20TokensTableItem = ({
  token,
  value,
  chain_values: chainValues,
  isLoading,
  hasAdditionalTokenTypes,
}: Props) => {

  const {
    valueBn: tokenQuantity,
    usdBn: tokenValue,
  } = calculateUsdValue({ amount: value, exchangeRate: token.exchange_rate, decimals: token.decimals });

  const isNativeToken = config.UI.views.address.nativeTokenAddress &&
    token.address_hash.toLowerCase() === config.UI.views.address.nativeTokenAddress.toLowerCase();

  const chainInfo = React.useMemo(() => {
    if (!chainValues) {
      return;
    }

    const chainId = Object.keys(chainValues)[0];
    const chain = multichainConfig()?.chains.find((chain) => chain.id === chainId);
    return chain;
  }, [ chainValues ]);

  const cellVerticalAlign = hasAdditionalTokenTypes ? 'top' : 'middle';

  return (
    <TableRow className="group" >
      <TableCell verticalAlign={ cellVerticalAlign }>
        <div className="flex flex-row gap-2">
          <TokenEntity
            token={ token }
            chain={ chainInfo }
            isLoading={ isLoading }
            noCopy
            jointSymbol
            className="font-bold w-auto"
           
          />
          { isNativeToken && <NativeTokenTag/> }
        </div>
        { hasAdditionalTokenTypes && <Tag loading={ isLoading } className="mt-2">{ getTokenTypeName(token.type) }</Tag> }
      </TableCell>
      <TableCell verticalAlign={ cellVerticalAlign }>
        <div className="flex items-center justify-between w-[150px]">
          <AddressEntity
            address={{ hash: token.address_hash }}
            isLoading={ isLoading }
            truncation="constant"
            noIcon
          />
          <AddressAddToWallet token={ token } className="ml-4 opacity-0" isLoading={ isLoading }/>
        </div>
      </TableCell>
      <TableCell isNumeric verticalAlign={ cellVerticalAlign }>
        { token.exchange_rate ? (
          <SimpleValue
            value={ BigNumber(token.exchange_rate) }
            prefix="$"
            loading={ isLoading }
            color={ isNativeToken ? 'text.secondary' : undefined }
          />
        ) : null }
      </TableCell>
      <TableCell isNumeric verticalAlign={ cellVerticalAlign }>
        { isConfidentialTokenType(token.type) ? (
          <ConfidentialValue loading={ isLoading }/>
        ) : (
          <SimpleValue
            value={ tokenQuantity }
            color={ isNativeToken ? 'text.secondary' : undefined }
            loading={ isLoading }
          />
        ) }
      </TableCell>
      <TableCell isNumeric verticalAlign={ cellVerticalAlign }>
        { isConfidentialTokenType(token.type) && (
          <ConfidentialValue loading={ isLoading }/>
        ) }
        { !isConfidentialTokenType(token.type) && token.exchange_rate && (
          <SimpleValue
            value={ tokenValue }
            prefix="$"
            color={ isNativeToken ? 'text.secondary' : undefined }
            loading={ isLoading }
            accuracy={ DEFAULT_ACCURACY_USD }
          />
        ) }
      </TableCell>
    </TableRow>
  );
};

export default React.memo(ERC20TokensTableItem);
