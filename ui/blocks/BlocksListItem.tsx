import BigNumber from 'bignumber.js';
import { capitalize } from 'es-toolkit';
import React from 'react';

import type { Block } from 'types/api/block';
import type { ClusterChainConfig } from 'types/multichain';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import getBlockTotalReward from 'lib/block/getBlockTotalReward';
import getNetworkValidatorTitle from 'lib/networks/getNetworkValidatorTitle';
import { currencyUnits } from 'lib/units';
import { Link } from 'toolkit/next/link';
import { Skeleton } from '@luxfi/ui/skeleton';
import { Tooltip } from '@luxfi/ui/tooltip';
import BlockGasUsed from 'ui/shared/block/BlockGasUsed';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import IconSvg from 'ui/shared/IconSvg';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';
import Utilization from 'ui/shared/Utilization/Utilization';
import NativeCoinValue from 'ui/shared/value/NativeCoinValue';
import SimpleValue from 'ui/shared/value/SimpleValue';

interface Props {
  data: Block;
  isLoading?: boolean;
  enableTimeIncrement?: boolean;
  animation?: string;
  chainData?: ClusterChainConfig;
}

const isRollup = config.features.rollup.isEnabled;

const BlocksListItem = ({ data, isLoading, enableTimeIncrement, animation, chainData }: Props) => {
  const totalReward = getBlockTotalReward(data);
  const burntFees = BigNumber(data.burnt_fees || 0);
  const txFees = BigNumber(data.transaction_fees || 0);

  return (
    <ListItemMobile className={ animation } key={ String(data.height) }>
      <div className="flex justify-between w-full">
        <div className="flex gap-x-2 items-center">
          <BlockEntity
            isLoading={ isLoading }
            number={ data.height }
            hash={ data.type !== 'block' ? data.hash : undefined }
            className="font-semibold"
            chain={ chainData }
            isPendingUpdate={ data.is_pending_update }
          />
          { data.celo?.l1_era_finalized_epoch_number && (
            <Tooltip content={ `Finalized epoch #${ data.celo.l1_era_finalized_epoch_number }` } disabled={ isLoading }>
              <IconSvg name="checkered_flag" className="w-5 h-5 p-px shrink-0" isLoading={ isLoading }/>
            </Tooltip>
          ) }
        </div>
        <TimeWithTooltip
          timestamp={ data.timestamp }
          enableIncrement={ enableTimeIncrement }
          isLoading={ isLoading }
          color="text.secondary"
          fontWeight="400"
          display="inline-block"
        />
      </div>
      { data.size && (
        <div className="flex gap-x-2">
          <span className="font-medium">Size</span>
          <Skeleton loading={ isLoading } display="inline-block" color="text.secondary">
            <span>{ data.size?.toLocaleString() } bytes</span>
          </Skeleton>
        </div>
      ) }
      { !config.UI.views.block.hiddenFields?.miner && (
        <div className="flex gap-x-2 w-full">
          <span className="font-medium">{ capitalize(getNetworkValidatorTitle()) }</span>
          <AddressEntity
            address={ data.miner }
            isLoading={ isLoading }
            truncation="constant"
          />
        </div>
      ) }
      <div className="flex gap-x-2">
        <span className="font-medium">Txn</span>
        { data.transactions_count > 0 ? (
          <Skeleton loading={ isLoading } display="inline-block">
            <Link href={ route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: String(data.height), tab: 'txs' } }) }>
              { data.transactions_count }
            </Link>
          </Skeleton>
        ) :
          <span className="text-[var(--color-text-secondary)]">{ data.transactions_count }</span>
        }
      </div>
      <div>
        <span className="font-medium">Gas used</span>
        <div className="mt-2">
          <Skeleton loading={ isLoading } display="inline-block" color="text.secondary" mr={ 4 }>
            <span>{ BigNumber(data.gas_used || 0).toFormat() }</span>
          </Skeleton>
          <BlockGasUsed
            gasUsed={ data.gas_used || undefined }
            gasLimit={ data.gas_limit }
            isLoading={ isLoading }
            gasTarget={ data.gas_target_percentage || undefined }
          />
        </div>
      </div>
      { !isRollup && !config.UI.views.block.hiddenFields?.total_reward && (
        <div className="flex gap-x-2">
          <span className="font-medium">Reward { currencyUnits.ether }</span>
          <SimpleValue value={ totalReward } loading={ isLoading } className="text-[var(--color-text-secondary)]"/>
        </div>
      ) }
      { !isRollup && !config.UI.views.block.hiddenFields?.burnt_fees && (
        <div>
          <span className="font-medium">Burnt fees</span>
          <div className="flex gap-x-4 mt-2">
            <NativeCoinValue
              amount={ data.burnt_fees }
              noSymbol
              startElement={ <IconSvg name="flame" className="mr-2 w-5 h-5" isLoading={ isLoading }/> }
              loading={ isLoading }
              display="flex"
              color="text.secondary"
            />
            <Utilization value={ burntFees.div(txFees).toNumber() } isLoading={ isLoading }/>
          </div>
        </div>
      ) }
      { !isRollup && !config.UI.views.block.hiddenFields?.base_fee && data.base_fee_per_gas && (
        <div className="flex gap-x-2">
          <span className="font-medium">Base fee</span>
          <NativeCoinValue
            amount={ data.base_fee_per_gas }
            loading={ isLoading }
            gweiThreshold={ 4 }
            units="wei"
            color="text.secondary"
          />
        </div>
      ) }
    </ListItemMobile>
  );
};

export default BlocksListItem;
