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
    <div className="p-4 bg-black/5 dark:bg-white/5 rounded max-h-[360px] overflow-y-scroll font-normal text-sm">
      { query.data && (
        <div
          className="grid gap-5"
          style={{ gridTemplateColumns: 'min-content min-content min-content' }}
        >
          <div className="font-semibold mb-1 whitespace-nowrap">
            { titles[0] }
          </div>
          <div className="font-semibold mb-1 whitespace-nowrap text-right">
            Amount { token.symbol }
          </div>
          <div className="font-semibold mb-1 whitespace-nowrap">
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
                  <div className="text-right">
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

      { query.isFetching && <ContentLoader className="max-w-[200px] mt-3"/> }

      { query.isError && <span className="text-[var(--color-text-error)] mt-3">Something went wrong. Unable to load next page.</span> }

      <div className="h-0 w-[100px]" ref={ cutRef }/>
    </div>
  );
};

export default React.memo(CeloEpochElectionRewardDetailsDesktop);
