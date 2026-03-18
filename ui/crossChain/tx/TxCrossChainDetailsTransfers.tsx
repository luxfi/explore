import React from 'react';

import type { InterchainTransfer } from '@luxfi/interchain-indexer-types';

import { route } from 'nextjs-routes';

import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import AddressFromToIcon from 'ui/shared/address/AddressFromToIcon';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import AddressEntityInterchain from 'ui/shared/entities/address/AddressEntityInterchain';
import IconSvg from 'ui/shared/IconSvg';
import TokenValueInterchain from 'ui/shared/value/TokenValueInterchain';

const MAX_NUM = 5;

interface Props {
  data: Array<InterchainTransfer>;
  id: string;
  isLoading?: boolean;
}

const TxCrossChainDetailsTransfers = ({ data, id, isLoading }: Props) => {
  return (
    <>
      <DetailedInfo.ItemLabel
        hint="Tokens moved as part of the cross-chain operation"
        isLoading={ isLoading }
      >
        Token transferred
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue position="relative" multiRow>
        <div
          flexDirection="column"
          alignItems="flex-start"
          rowGap={ 1 }
          w="100%"
          overflow="hidden"
        >
          { data.slice(0, MAX_NUM).map((item, index) => {
            return (
              <div key={ index } alignItems="center" columnGap={ 2 } rowGap={ 0 } flexWrap="wrap">
                { item.sender ? (
                  <AddressEntityInterchain
                    address={ item.sender }
                    isLoading={ isLoading }
                    chain={ item.source_chain }
                    noIcon
                    truncation="constant"
                  />
                ) : <span color="text.secondary">Unknown</span> }
                <AddressFromToIcon
                  isLoading={ isLoading }
                  type="unspecified"
                />
                { item.recipient ? (
                  <AddressEntityInterchain
                    address={ item.recipient }
                    isLoading={ isLoading }
                    chain={ item.destination_chain }
                    noIcon
                    truncation="constant"
                  />
                ) : <span color="text.secondary">Unknown</span> }
                <Skeleton loading={ isLoading } color="text.secondary">
                  <span>for</span>
                </Skeleton>
                { item.source_token ? (
                  <TokenValueInterchain
                    token={ item.source_token }
                    amount={ item.source_amount }
                    chain={ item.source_chain }
                    loading={ isLoading }
                  />
                ) : <span color="text.secondary">Unknown</span> }
                <AddressFromToIcon
                  isLoading={ isLoading }
                  type="unspecified"
                />
                { item.destination_token ? (
                  <TokenValueInterchain
                    token={ item.destination_token }
                    amount={ item.destination_amount }
                    chain={ item.destination_chain }
                    loading={ isLoading }
                  />
                ) : <span color="text.secondary">Unknown</span> }
              </div>
            );
          }) }
        </div>
      </DetailedInfo.ItemValue>
      { data.length > MAX_NUM && (
        <>
          <div className="hidden lg:block"/>
          <div fontSize="sm" alignItems="center" display="inline-flex" pl={{ base: '28px', lg: 0 }}>
            { /* FIXME use non-navigation icon */ }
            <IconSvg name="navigation/tokens" boxSize={ 6 }/>
            <Link
              href={ route({ pathname: '/cross-chain-tx/[id]', query: { id, tab: 'transfers' } }) }
            >
              View all
            </Link>
          </div>
        </>
      ) }
    </>
  );
};

export default React.memo(TxCrossChainDetailsTransfers);
