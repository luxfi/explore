import BigNumber from 'bignumber.js';
import React from 'react';

import type { AddressCoinBalanceHistoryItem } from 'types/api/address';
import type { ClusterChainConfig } from 'types/multichain';

import { Skeleton } from '@luxfi/ui/skeleton';
import { ZERO } from 'toolkit/utils/consts';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';
import NativeCoinValue from 'ui/shared/value/NativeCoinValue';
import SimpleValue from 'ui/shared/value/SimpleValue';
import { WEI } from 'ui/shared/value/utils';

type Props = AddressCoinBalanceHistoryItem & {
  page: number;
  isLoading: boolean;
  chainData?: ClusterChainConfig;
};

const AddressCoinBalanceListItem = (props: Props) => {
  const deltaBn = BigNumber(props.delta).div(WEI);
  const isPositiveDelta = deltaBn.gte(ZERO);

  return (
    <ListItemMobile className="gap-y-2">
      <div className="flex justify-between w-full">
        <NativeCoinValue
          amount={ props.value }
          loading={ props.isLoading }
          fontWeight={ 600 }
        />
        <Skeleton loading={ props.isLoading }>
          <div className="flex items-center gap-1 shrink-0">
            <span className="font-semibold text-sm">
              <SimpleValue
                value={ deltaBn }
                loading={ props.isLoading }
              />
            </span>
            <span className={ isPositiveDelta ? 'text-green-500' : 'text-red-500' }>
              { isPositiveDelta ? '\u25B2' : '\u25BC' }
            </span>
          </div>
        </Skeleton>
      </div>
      <div className="flex gap-x-2 w-full">
        <Skeleton loading={ props.isLoading } fontWeight={ 500 } flexShrink={ 0 }>Block</Skeleton>
        <BlockEntity
          isLoading={ props.isLoading }
          number={ props.block_number }
          noIcon={ !props.chainData }
          className="font-bold"
          chain={ props.chainData }
        />
      </div>
      { props.transaction_hash && (
        <div className="flex gap-x-2 w-full">
          <Skeleton loading={ props.isLoading } fontWeight={ 500 } flexShrink={ 0 }>Txs</Skeleton>
          <TxEntity
            hash={ props.transaction_hash }
            isLoading={ props.isLoading }
            noIcon
            className="font-bold max-w-[150px]"
          />
        </div>
      ) }
      <div className="flex gap-x-2 w-full">
        <Skeleton loading={ props.isLoading } fontWeight={ 500 } flexShrink={ 0 }>Age</Skeleton>
        <TimeWithTooltip
          timestamp={ props.block_timestamp }
          enableIncrement={ props.page === 1 }
          isLoading={ props.isLoading }
          color="text.secondary"
        />
      </div>
    </ListItemMobile>
  );
};

export default React.memo(AddressCoinBalanceListItem);
