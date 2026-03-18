import React from 'react';

import type { TokenInfo } from '@luxfi/interchain-indexer-types';
import type { ExternalChain } from 'types/externalChains';

import type { EntityProps as TokenEntityProps } from 'ui/shared/entities/token/TokenEntity';
import TokenEntityInterchain from 'ui/shared/entities/token/TokenEntityInterchain';

import type { Props as AssetValueProps } from './AssetValue';
import AssetValue from './AssetValue';

interface Props extends Omit<AssetValueProps, 'asset'> {
  token: TokenInfo;
  chain: ExternalChain | undefined;
  tokenEntityProps?: Omit<TokenEntityProps, 'token'>;
}

const TokenValueInterchain = ({ token, tokenEntityProps, chain, ...rest }: Props) => {

  const tokenInfo = React.useMemo(() => {
    return {
      symbol: token.symbol ?? null,
      address_hash: token.address_hash,
      icon_url: token.icon_url ?? null,
      name: token.name ?? null,
      type: 'ERC-20',
      reputation: null,
    };
  }, [ token.address_hash, token.icon_url, token.name, token.symbol ]);

  const asset = (
    <TokenEntityInterchain
      token={ tokenInfo }
      chain={ chain }
      noCopy
      onlySymbol
      className="shrink-0 w-fit ml-2"
      icon={{ marginRight: 1 }}
      { ...tokenEntityProps }
    />
  );
  return (
    <AssetValue
      amount={ rest.amount }
      asset={ asset }
      decimals={ token.decimals }
      { ...rest }
    />
  );
};

export default React.memo(TokenValueInterchain);
