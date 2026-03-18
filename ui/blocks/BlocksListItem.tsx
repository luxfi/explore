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
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tooltip } from 'toolkit/chakra/tooltip';
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
    <ListItemMobile rowGap={ 3 } key={ String(data.height) } animation={ animation }>
      <div justifyContent="space-between" w="100%">
        <div columnGap={ 2 } alignItems="center">
          <BlockEntity
            isLoading={ isLoading }
            number={ data.height }
            hash={ data.type !== 'block' ? data.hash : undefined }
            fontWeight={ 600 }
            chain={ chainData }
            isPendingUpdate={ data.is_pending_update }
          />
          { data.celo?.l1_era_finalized_epoch_number && (
            <Tooltip content={ `Finalized epoch #${ data.celo.l1_era_finalized_epoch_number }` } disabled={ isLoading }>
              <IconSvg name="checkered_flag" boxSize={ 5 } p="1px" isLoading={ isLoading } flexShrink={ 0 }/>
            </Tooltip>
          ) }
        </div>
        <TimeWithTooltip
          timestamp={ data.timestamp }
          enableIncrement={ enableTimeIncrement }
          isLoading={ isLoading }
          color="text.secondary"
          fontWeight={ 400 }
          display="inline-block"
        />
      </div>
      { data.size && (
        <div columnGap={ 2 }>
          <span fontWeight={ 500 }>Size</span>
          <Skeleton loading={ isLoading } display="inline-block" color="text.secondary">
            <span>{ data.size?.toLocaleString() } bytes</span>
          </Skeleton>
        </div>
      ) }
      { !config.UI.views.block.hiddenFields?.miner && (
        <div columnGap={ 2 } w="100%">
          <span fontWeight={ 500 }>{ capitalize(getNetworkValidatorTitle()) }</span>
          <AddressEntity
            address={ data.miner }
            isLoading={ isLoading }
            truncation="constant"
          />
        </div>
      ) }
      <div columnGap={ 2 }>
        <span fontWeight={ 500 }>Txn</span>
        { data.transactions_count > 0 ? (
          <Skeleton loading={ isLoading } display="inline-block">
            <Link href={ route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: String(data.height), tab: 'txs' } }) }>
              { data.transactions_count }
            </Link>
          </Skeleton>
        ) :
          <span color="text.secondary">{ data.transactions_count }</span>
        }
      </div>
      <div>
        <span fontWeight={ 500 }>Gas used</span>
        <div mt={ 2 }>
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
        <div columnGap={ 2 }>
          <span fontWeight={ 500 }>Reward { currencyUnits.ether }</span>
          <SimpleValue value={ totalReward } loading={ isLoading } className="text-[var(--color-text-secondary)]"/>
        </div>
      ) }
      { !isRollup && !config.UI.views.block.hiddenFields?.burnt_fees && (
        <div>
          <span fontWeight={ 500 }>Burnt fees</span>
          <div columnGap={ 4 } mt={ 2 }>
            <NativeCoinValue
              amount={ data.burnt_fees }
              noSymbol
              startElement={ <IconSvg name="flame" mr={ 2 } boxSize={ 5 } color={{ _light: 'gray.500', _dark: 'inherit' }} isLoading={ isLoading }/> }
              loading={ isLoading }
              display="flex"
              color="text.secondary"
            />
            <Utilization value={ burntFees.div(txFees).toNumber() } isLoading={ isLoading }/>
          </div>
        </div>
      ) }
      { !isRollup && !config.UI.views.block.hiddenFields?.base_fee && data.base_fee_per_gas && (
        <div columnGap={ 2 }>
          <span fontWeight={ 500 }>Base fee</span>
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
