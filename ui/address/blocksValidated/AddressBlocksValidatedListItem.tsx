import BigNumber from 'bignumber.js';
import React from 'react';

import type { Block } from 'types/api/block';

import config from 'configs/app';
import getBlockTotalReward from 'lib/block/getBlockTotalReward';
import { currencyUnits } from 'lib/units';
import { Skeleton } from '@luxfi/ui/skeleton';
import BlockGasUsed from 'ui/shared/block/BlockGasUsed';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';
import SimpleValue from 'ui/shared/value/SimpleValue';

type Props = Block & {
  page: number;
  isLoading: boolean;
};

const AddressBlocksValidatedListItem = (props: Props) => {
  const totalReward = getBlockTotalReward(props);

  return (
    <ListItemMobile className="gap-y-2">
      <div className="flex justify-between w-full">
        <BlockEntity
          isLoading={ props.isLoading }
          number={ props.height }
          noIcon
          className="font-bold"
        />
        <TimeWithTooltip
          timestamp={ props.timestamp }
          enableIncrement={ props.page === 1 }
          isLoading={ props.isLoading }
          color="text.secondary"
          display="inline-block"
        />
      </div>
      <div className="flex gap-x-2 w-full">
        <Skeleton loading={ props.isLoading } fontWeight={ 500 } flexShrink={ 0 }>Txn</Skeleton>
        <Skeleton loading={ props.isLoading } display="inline-block" color="Skeleton_secondary">
          <span>{ props.transactions_count }</span>
        </Skeleton>
      </div>
      <div className="flex gap-x-2 w-full">
        <Skeleton loading={ props.isLoading } fontWeight={ 500 } flexShrink={ 0 }>Gas used</Skeleton>
        <Skeleton loading={ props.isLoading }>
          <span className="text-[var(--color-text-secondary)]">{ BigNumber(props.gas_used || 0).toFormat() }</span>
        </Skeleton>
        <BlockGasUsed
          gasUsed={ props.gas_used || undefined }
          gasLimit={ props.gas_limit }
          isLoading={ props.isLoading }
        />
      </div>
      { !config.UI.views.block.hiddenFields?.total_reward && !config.features.rollup.isEnabled && (
        <div className="flex gap-x-2 w-full">
          <Skeleton loading={ props.isLoading } fontWeight={ 500 } flexShrink={ 0 }>Reward { currencyUnits.ether }</Skeleton>
          <SimpleValue
            value={ totalReward }
            accuracy={ 0 }
            loading={ props.isLoading }
            color="text.secondary"
          />
        </div>
      ) }
    </ListItemMobile>
  );
};

export default React.memo(AddressBlocksValidatedListItem);
