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
    <div
      flexDir="column"
      rowGap={ 3 }
      p={ 4 }
      bgColor={{ _light: 'blackAlpha.50', _dark: 'whiteAlpha.50' }}
      borderRadius="base"
      maxH="360px"
      overflowY="scroll"
    >

      { query.data?.pages
        .map((page) => page.items)
        .flat()
        .map((item, index) => {
          return (
            <div key={ index } flexDir="column" alignItems="flex-start" rowGap={ 1 } fontWeight={ 400 }>
              <AddressEntity address={ item.account } noIcon w="100%"/>
              <TokenValue
                amount={ item.amount }
                token={ token }
                tokenEntityProps={{ noIcon: true, ml: 1 }}
                startElement={ <div flexShrink={ 0 } color="text.secondary">got </div> }
              />
              <div columnGap={ 1 } alignItems="center" w="100%">
                <div flexShrink={ 0 } color="text.secondary">on behalf of</div>
                <AddressEntity address={ item.associated_account } noIcon/>
              </div>
            </div>
          );
        }) }

      { query.isFetching && <ContentLoader maxW="200px" mt={ 3 }/> }

      { query.isError && <span color="text.error" mt={ 3 }>Something went wrong. Unable to load next page.</span> }

      <div h="0" w="100px" mt="-12px" ref={ cutRef }/>
    </div>
  );
};

export default React.memo(CeloEpochElectionRewardDetailsMobile);
