import { mapValues } from 'es-toolkit';
import React from 'react';

import type * as multichain from '@luxfi/multichain-aggregator-types';
import type { TokenType } from 'types/api/token';
import type { ClusterChainConfig } from 'types/multichain';

import { route } from 'nextjs/routes';

import * as contract from 'lib/multichain/contract';
import shortenString from 'lib/shortenString';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import IconSvg from 'ui/shared/IconSvg';

import SearchResultListItem from '../SearchResultListItem';

interface Props {
  data: multichain.AggregatedTokenInfo;
  chain: ClusterChainConfig;
  isMobile?: boolean;
}

const SearchResultItemToken = ({ data, chain, isMobile }: Props) => {

  const isVerified = contract.isVerified({ chain_infos: mapValues(data.chain_infos, (chainInfo) => ({ ...chainInfo, is_contract: true, coin_balance: '0' })) });

  return (
    <SearchResultListItem
      href={ route({ pathname: '/token/[hash]', query: { hash: data.address_hash } }, { chain }) }
    >
      <div className="w-full lg:w-[200px]">
        <TokenEntity
          token={{
            address_hash: data.address_hash,
            icon_url: data.icon_url ?? null,
            name: data.name ?? 'Unnamed token',
            symbol: data.symbol ?? '',
            type: data.type as unknown as TokenType,
            reputation: null,
          }}
          chain={ chain }
          noLink
          jointSymbol
          noCopy
          className="font-semibold lg:font-bold"
        />
      </div>
      <div className="flex items-center w-full lg:w-auto flex-grow">
        <div
          className="overflow-hidden whitespace-nowrap text-ellipsis font-normal lg:font-medium text-[var(--color-text-secondary)] group-hover:text-inherit"
        >
          { isMobile ? shortenString(data.address_hash) : (
            <HashStringShortenDynamic hash={ data.address_hash }/>
          ) }
        </div>
        { isVerified && <IconSvg name="status/success" className="w-3.5 h-3.5 text-green-500 ml-1 shrink-0"/> }
        <span
          className="overflow-hidden whitespace-nowrap text-ellipsis font-normal lg:font-semibold ml-auto max-w-[60%] lg:max-w-none"
        >
          { (data.type as string) === 'ERC-20' && data.exchange_rate && `$${ Number(data.exchange_rate).toLocaleString() }` }
          { (data.type as string) !== 'ERC-20' && data.total_supply && `Items ${ Number(data.total_supply).toLocaleString() }` }
        </span>
      </div>
    </SearchResultListItem>
  );
};

export default React.memo(SearchResultItemToken);
