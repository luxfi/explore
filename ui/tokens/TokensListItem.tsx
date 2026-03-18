import BigNumber from 'bignumber.js';
import React from 'react';

import type { TokenInfo } from 'types/api/token';
import type { AggregatedTokenInfo } from 'types/client/multichainAggregator';

import config from 'configs/app';
import multichainConfig from 'configs/multichain';
import getItemIndex from 'lib/getItemIndex';
import { getTokenTypeName } from 'lib/token/tokenTypes';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tag } from 'toolkit/chakra/tag';
import AddressAddToWallet from 'ui/shared/address/AddressAddToWallet';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import SimpleValue from 'ui/shared/value/SimpleValue';
import { DEFAULT_ACCURACY_USD } from 'ui/shared/value/utils';

type Props = {
  token: TokenInfo | AggregatedTokenInfo;
  index: number;
  page: number;
  isLoading?: boolean;
};

const bridgedTokensFeature = config.features.bridgedTokens;

const TokensListItem = ({
  token,
  page,
  index,
  isLoading,
}: Props) => {

  const {
    address_hash: addressHash,
    exchange_rate: exchangeRate,
    type,
    holders_count: holdersCount,
    circulating_market_cap: marketCap,
  } = token;

  const originalChainId = 'origin_chain_id' in token ? token.origin_chain_id : undefined;
  const chainInfos = 'chain_infos' in token ? token.chain_infos : undefined;

  const bridgedChainTag = bridgedTokensFeature.isEnabled ?
    bridgedTokensFeature.chains.find(({ id }) => id === originalChainId)?.short_title :
    undefined;

  const filecoinRobustAddress = 'filecoin_robust_address' in token ? token.filecoin_robust_address : undefined;

  const chainInfo = React.useMemo(() => {
    if (!chainInfos) {
      return;
    }

    const chainId = Object.keys(chainInfos)[0];
    const chain = multichainConfig()?.chains.find((chain) => chain.id === chainId);
    return chain;
  }, [ chainInfos ]);

  return (
    <ListItemMobile>
      <div
        className="w-full"
      >
        <div>
          <TokenEntity
            token={ token }
            chain={ chainInfo }
            isLoading={ isLoading }
            jointSymbol
            noCopy
            className="w-auto"
            noLink={ type === 'NATIVE' }
          />
          <div>
            <Tag loading={ isLoading }>{ getTokenTypeName(type, chainInfo?.app_config) }</Tag>
            { bridgedChainTag && <Tag loading={ isLoading }>{ bridgedChainTag }</Tag> }
          </div>
          <Skeleton loading={ isLoading } color="text.secondary" className="text-right">
            <span>{ getItemIndex(index, page) }</span>
          </Skeleton>
        </div>
      </div>
      { type !== 'NATIVE' && (
        <div className="w-[150px]">
          <AddressEntity
            address={{ hash: addressHash, filecoin: { robust: filecoinRobustAddress } }}
            isLoading={ isLoading }
            truncation="constant"
            link={{ variant: 'secondary' }}
            noIcon
          />
          <AddressAddToWallet token={ token } isLoading={ isLoading }/>
        </div>
      ) }
      { exchangeRate && (
        <div>
          <Skeleton loading={ isLoading }>Price</Skeleton>
          <SimpleValue
            value={ BigNumber(exchangeRate) }
            loading={ isLoading }
            accuracy={ 4 }
            prefix="$"
            className="text-sm"
            color="text.secondary"
          />
        </div>
      ) }
      { marketCap && (
        <div>
          <Skeleton loading={ isLoading }>On-chain market cap</Skeleton>
          <SimpleValue
            value={ BigNumber(marketCap) }
            loading={ isLoading }
            prefix="$"
            accuracy={ DEFAULT_ACCURACY_USD }
            className="text-sm"
            color="text.secondary"
          />
        </div>
      ) }
      { holdersCount && (
        <div>
          <Skeleton loading={ isLoading }>Holders</Skeleton>
          <Skeleton loading={ isLoading } color="text.secondary"><span>{ Number(holdersCount).toLocaleString() }</span></Skeleton>
        </div>
      ) }
    </ListItemMobile>
  );
};

export default TokensListItem;
