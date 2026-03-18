import BigNumber from 'bignumber.js';
import React from 'react';

import { route } from 'nextjs/routes';

import config from 'configs/app';
import multichainConfig from 'configs/multichain';
import { isConfidentialTokenType, isFungibleTokenType } from 'lib/token/tokenTypes';
import { Link } from 'toolkit/chakra/link';
import { TruncatedText } from 'toolkit/components/truncation/TruncatedText';
import NativeTokenTag from 'ui/shared/celo/NativeTokenTag';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';
import calculateUsdValue from 'ui/shared/value/calculateUsdValue';

import type { TokenEnhancedData } from '../utils/tokenUtils';

interface Props {
  data: TokenEnhancedData;
}

const TokenSelectItem = ({ data }: Props) => {

  const isNativeToken = config.UI.views.address.nativeTokenAddress &&
    data.token.address_hash.toLowerCase() === config.UI.views.address.nativeTokenAddress.toLowerCase();

  const chain = React.useMemo(() => {
    if (!data.chain_values) {
      return;
    }

    const chainId = Object.keys(data.chain_values)[0];
    const chain = multichainConfig()?.chains.find((chain) => chain.id === chainId);
    return chain;
  }, [ data.chain_values ]);

  const secondRow = (() => {
    if (isConfidentialTokenType(data.token.type)) {
      const text = `••••• ${ data.token.symbol || '' }`;

      return (
        <>
          <TruncatedText text={ text }/>
          { data.token.exchange_rate && <span className="ml-2">@{ Number(data.token.exchange_rate).toLocaleString() }</span> }
        </>
      );
    }

    const isFungibleToken = isFungibleTokenType(data.token.type);

    if (isFungibleToken) {
      const tokenDecimals = Number(data.token.decimals ?? 18);
      const text = `${ BigNumber(data.value).dividedBy(10 ** tokenDecimals).toFormat() } ${ data.token.symbol || '' }`;

      return (
        <>
          <TruncatedText text={ text }/>
          { data.token.exchange_rate && <span className="ml-2">@{ Number(data.token.exchange_rate).toLocaleString() }</span> }
        </>
      );
    }

    switch (data.token.type) {
      case 'ERC-721': {
        const text = `${ BigNumber(data.value).toFormat() } ${ data.token.symbol || '' }`;
        return <TruncatedText text={ text }/>;
      }
      case 'ERC-1155': {
        return (
          <>
            <span className="text-ellipsis mr-6 overflow-hidden">
              #{ data.token_id || 0 }
            </span>
            <span>
              { BigNumber(data.value).toFormat() }
            </span>
          </>
        );
      }
      case 'ERC-404': {
        return (
          <>
            { data.token_id !== null && (
              <span className="text-ellipsis mr-6 overflow-hidden">
                #{ data.token_id || 0 }
              </span>
            ) }
            { data.value !== null && (
              <span>
                { data.token.decimals ?
                  calculateUsdValue({ amount: data.value, decimals: data.token.decimals }).valueStr :
                  BigNumber(data.value).toFormat()
                }
              </span>
            ) }
          </>
        );
      }
    }
  })();

  const url = route({ pathname: '/token/[hash]', query: { hash: data.token.address_hash } }, { chain });

  return (
    <Link
      className="px-1 py-2.5 flex flex-col gap-y-2 border-b border-[var(--color-border-divider)] hover:bg-blue-50 dark:hover:bg-gray-800 text-inherit text-sm"
      href={ url }
    >
      <div className="flex items-center w-full">
        <TokenEntity
          token={ data.token }
          chain={ chain }
          noSymbol
          noCopy
          noLink
          className="font-bold w-auto mr-2"

        />
        { isNativeToken && <NativeTokenTag className="mr-2"/> }
        { data.usd && (
          <TruncatedText
            text={ `$${ data.usd.toFormat(2) }` }
            className={ `font-bold min-w-[120px] ml-auto text-right ${ isNativeToken ? 'text-[var(--color-text-secondary)]' : '' }` }
          />
        ) }
      </div>
      <div className="flex items-center justify-between whitespace-nowrap w-full" color={ isNativeToken ? 'text.secondary' : undefined }>
        { secondRow }
      </div>
    </Link>
  );
};

export default React.memo(TokenSelectItem);
