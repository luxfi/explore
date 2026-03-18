import { useRouter } from 'next/router';
import React from 'react';

import type { CeloEpochDetails } from 'types/api/epochs';
import type { TokenInfo } from 'types/api/token';

import getQueryParamString from 'lib/router/getQueryParamString';
import { ContentLoader } from 'toolkit/components/loaders/ContentLoader';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import useLazyLoadedList from 'ui/shared/pagination/useLazyLoadedList';
import AssetValue from 'ui/shared/value/AssetValue';

import { formatRewardType, getRewardDetailsTableTitles } from './utils';

interface Props {
  type: keyof CeloEpochDetails['aggregated_election_rewards'];
  token: TokenInfo;
}

const CeloEpochElectionRewardDetailsDesktop = ({ type, token }: Props) => {
  const rootRef = React.useRef<HTMLDivElement>(null);

  const router = useRouter();
  const number = getQueryParamString(router.query.number);

  const { cutRef, query } = useLazyLoadedList({
    rootRef,
    resourceName: 'general:epoch_celo_election_rewards',
    pathParams: { number: number, reward_type: formatRewardType(type) },
    queryOptions: {
      refetchOnMount: false,
    },
  });

  const titles = getRewardDetailsTableTitles(type);

  return (
    <div
      p={ 4 }
      bgColor={{ _light: 'blackAlpha.50', _dark: 'whiteAlpha.50' }}
      borderRadius="base"
      maxH="360px"
      overflowY="scroll"
      fontWeight={ 400 }
      textStyle="sm"
    >
      { query.data && (
        <div
          gridTemplateColumns="min-content min-content min-content"
          rowGap={ 5 }
          columnGap={ 5 }
        >
          <div fontWeight={ 600 } mb={ 1 } whiteSpace="nowrap">
            { titles[0] }
          </div>
          <div fontWeight={ 600 } mb={ 1 } whiteSpace="nowrap" textAlign="right">
            Amount { token.symbol }
          </div>
          <div fontWeight={ 600 } mb={ 1 } whiteSpace="nowrap">
            { titles[1] }
          </div>

          { query.data?.pages
            .map((page) => page.items)
            .flat()
            .map((item, index) => {
              return (
                <React.Fragment key={ index }>
                  <div>
                    <AddressEntity address={ item.account } noIcon truncation="constant"/>
                  </div>
                  <div textAlign="right">
                    <AssetValue
                      amount={ item.amount }
                      decimals={ token.decimals }
                    />
                  </div>
                  <div>
                    <AddressEntity address={ item.associated_account } noIcon truncation="constant"/>
                  </div>
                </React.Fragment>
              );
            }) }
        </div>
      ) }

      { query.isFetching && <ContentLoader maxW="200px" mt={ 3 }/> }

      { query.isError && <span color="text.error" mt={ 3 }>Something went wrong. Unable to load next page.</span> }

      <div h="0" w="100px" ref={ cutRef }/>
    </div>
  );
};

export default React.memo(CeloEpochElectionRewardDetailsDesktop);
