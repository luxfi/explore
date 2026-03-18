import { capitalize } from 'es-toolkit';
import { useRouter } from 'next/router';
import React from 'react';

import type { Block } from 'types/api/block';

import config from 'configs/app';
import getBlockTotalReward from 'lib/block/getBlockTotalReward';
import getNetworkValidatorTitle from 'lib/networks/getNetworkValidatorTitle';
import { currencyUnits } from 'lib/units';
import { cn } from 'lib/utils/cn';
import { Skeleton } from '@luxfi/ui/skeleton';
import { Tooltip } from '@luxfi/ui/tooltip';
import { thinsp } from 'toolkit/utils/htmlEntities';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import IconSvg from 'ui/shared/IconSvg';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';
import SimpleValue from 'ui/shared/value/SimpleValue';

type Props = {
  block: Block;
  isLoading?: boolean;
  animation?: string;
};

const LatestBlocksItem = ({ block, isLoading, animation }: Props) => {
  const totalReward = getBlockTotalReward(block);
  const router = useRouter();

  const handleClick = React.useCallback(() => {
    if (!isLoading) {
      router.push({ pathname: '/block/[height_or_hash]', query: { height_or_hash: String(block.height) } });
    }
  }, [ router, block.height, isLoading ]);

  return (
    <div
      className={ cn(
        'rounded-lg border border-[var(--color-border-divider)] bg-[var(--color-stats-bg)]',
        'p-4 min-w-[260px] flex-1 transition-colors duration-150',
        isLoading ? 'cursor-default' : 'cursor-pointer hover:bg-[var(--color-gray-100)] dark:hover:bg-[var(--color-whiteAlpha-100)]',
      ) }
      style={ animation ? { animation } : undefined }
      onClick={ handleClick }
    >
      <div className="flex items-center overflow-hidden w-full mb-3">
        <BlockEntity
          isLoading={ isLoading }
          number={ block.height }
          tailLength={ 2 }
          className="text-base font-medium mr-auto"
        />
        { block.celo?.l1_era_finalized_epoch_number && (
          <Tooltip content={ `Finalized epoch #${ block.celo.l1_era_finalized_epoch_number }` }>
            <IconSvg name="checkered_flag" className="w-5 h-5 p-[1px] ml-2 shrink-0" isLoading={ isLoading }/>
          </Tooltip>
        ) }
        <TimeWithTooltip
          timestamp={ block.timestamp }
          enableIncrement={ !isLoading }
          timeFormat="relative"
          isLoading={ isLoading }
          className="text-[var(--color-text-secondary)] inline-block text-sm shrink-0 ml-2"
        />
      </div>
      <div className="grid gap-2 grid-cols-[auto_minmax(0,1fr)] text-sm">
        <Skeleton loading={ isLoading } className="text-[var(--color-text-secondary)]">Txn</Skeleton>
        <Skeleton loading={ isLoading } className="text-[var(--color-text-secondary)]"><span>{ block.transactions_count }</span></Skeleton>

        { !config.features.rollup.isEnabled && !config.UI.views.block.hiddenFields?.total_reward && (
          <>
            <Skeleton loading={ isLoading } className="text-[var(--color-text-secondary)]">Reward</Skeleton>
            <SimpleValue
              value={ totalReward }
              loading={ isLoading }
              color="text.secondary"
              endElement={ `${ thinsp }${ currencyUnits.ether }` }
            />
          </>
        ) }

        { !config.features.rollup.isEnabled && !config.UI.views.block.hiddenFields?.miner && (
          <>
            <Skeleton loading={ isLoading } className="text-[var(--color-text-secondary)]">{ capitalize(getNetworkValidatorTitle()) }</Skeleton>
            <AddressEntity
              address={ block.miner }
              isLoading={ isLoading }
              noIcon
              noCopy
              truncation="constant"
            />
          </>
        ) }
      </div>
    </div>
  );
};

export default LatestBlocksItem;
