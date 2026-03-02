import { useRouter } from 'next/router';
import React from 'react';

import type { CeloEpochDetails } from 'types/api/epochs';
import type { TokenInfo } from 'types/api/token';

import getQueryParamString from 'lib/router/getQueryParamString';
import { ContentLoader } from 'toolkit/components/loaders/ContentLoader';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import useLazyLoadedList from 'ui/shared/pagination/useLazyLoadedList';
import TokenValue from 'ui/shared/value/TokenValue';

import { formatRewardType } from './utils';

interface Props {
  type: keyof CeloEpochDetails['aggregated_election_rewards'];
  token: TokenInfo;
}

const CeloEpochElectionRewardDetailsMobile = ({ type, token }: Props) => {
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

  return (
    <div className="flex flex-col gap-y-3 p-4 bg-black/5 dark:bg-white/5 rounded max-h-[360px] overflow-y-scroll">

      { query.data?.pages
        .map((page) => page.items)
        .flat()
        .map((item, index) => {
          return (
            <div key={ index } className="flex flex-col items-start gap-y-1 font-normal">
              <AddressEntity address={ item.account } noIcon className="w-full"/>
              <TokenValue
                amount={ item.amount }
                token={ token }
                tokenEntityProps={{ noIcon: true }}
                startElement={ <div className="shrink-0 text-[var(--color-text-secondary)]">got </div> }
              />
              <div className="flex gap-x-1 items-center w-full">
                <div className="shrink-0 text-[var(--color-text-secondary)]">on behalf of</div>
                <AddressEntity address={ item.associated_account } noIcon/>
              </div>
            </div>
          );
        }) }

      { query.isFetching && <ContentLoader className="max-w-[200px] mt-3"/> }

      { query.isError && <span className="text-[var(--color-text-error)] mt-3">Something went wrong. Unable to load next page.</span> }

      <div className="h-0 w-[100px] -mt-3" ref={ cutRef }/>
    </div>
  );
};

export default React.memo(CeloEpochElectionRewardDetailsMobile);
