import React from 'react';

import type * as multichain from '@luxfi/multichain-aggregator-types';
import type { ClusterChainConfig } from 'types/multichain';

import { Link } from 'toolkit/next/link';
import { Skeleton } from '@luxfi/ui/skeleton';
import { TruncatedText } from 'toolkit/components/truncation/TruncatedText';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import ChainIcon from 'ui/shared/externalChains/ChainIcon';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';

interface Props {
  data: multichain.ChainMetrics;
  chainInfo: ClusterChainConfig | undefined;
  isLoading?: boolean;
}

const DeltaIndicator = ({ delta }: { delta: number }) => {
  const isPositive = delta > 0;
  return (
    <span className={ `inline-flex items-center gap-0.5 ${ isPositive ? 'text-green-500' : 'text-red-500' }` }>
      <span>{ delta.toFixed(2) }%</span>
      <span>{ isPositive ? '\u25B2' : '\u25BC' }</span>
    </span>
  );
};

const MultichainEcosystemsListItem = ({ data, chainInfo, isLoading }: Props) => {
  const activeAddresses = {
    value: data.active_accounts?.current_full_week ? Number(data.active_accounts.current_full_week) : 0,
    delta: data.active_accounts?.wow_diff_percent ? Number(data.active_accounts.wow_diff_percent) : 0,
  };

  const newAddresses = {
    value: data.new_addresses?.current_full_week ? Number(data.new_addresses.current_full_week) : 0,
    delta: data.new_addresses?.wow_diff_percent ? Number(data.new_addresses.wow_diff_percent) : 0,
  };

  const dailyTransactions = {
    value: data.daily_transactions?.current_full_week ? Number(data.daily_transactions.current_full_week) : 0,
    delta: data.daily_transactions?.wow_diff_percent ? Number(data.daily_transactions.wow_diff_percent) : 0,
  };

  return (
    <ListItemMobile className="gap-y-3 py-4 text-sm items-stretch">
      <div className="flex flex-row justify-between font-semibold">
        <div className="flex flex-row items-center gap-2 max-w-[50%]">
          <ChainIcon data={ chainInfo } isLoading={ isLoading }/>
          <Link
            href={ chainInfo?.explorer_url }
            external
            loading={ isLoading }
            className="max-w-full"
          >
            <TruncatedText text={ chainInfo?.name ?? 'Unknown chain' } loading={ isLoading }/>
          </Link>
        </div>
        <div className="flex flex-row items-center gap-0 shrink-0">
          <Skeleton loading={ isLoading } color="text.secondary"><span>{ data.chain_id }</span></Skeleton>
          <CopyToClipboard text={ String(data.chain_id) } isLoading={ isLoading }/>
        </div>
      </div>
      <div className="grid" style={{ gridTemplateColumns: '140px 1fr', columnGap: '8px', rowGap: '12px' }}>
        <Skeleton loading={ isLoading } fontWeight={ 500 }>
          <span>Active addresses</span>
          <span className="text-[var(--color-text-secondary)]"> 7D</span>
        </Skeleton>
        <div className="flex flex-row items-center gap-1">
          <Skeleton loading={ isLoading }>
            <span>{ activeAddresses.value.toLocaleString() }</span>
          </Skeleton>
          { activeAddresses.delta ? (
            <Skeleton loading={ isLoading }>
              <DeltaIndicator delta={ activeAddresses.delta }/>
            </Skeleton>
          ) : null }
        </div>

        <Skeleton loading={ isLoading } fontWeight={ 500 }>
          <span>New addresses</span>
          <span className="text-[var(--color-text-secondary)]"> 7D</span>
        </Skeleton>
        <div className="flex flex-row items-center gap-1">
          <Skeleton loading={ isLoading }>
            <span>{ newAddresses.value.toLocaleString() }</span>
          </Skeleton>
          { newAddresses.delta ? (
            <Skeleton loading={ isLoading }>
              <DeltaIndicator delta={ newAddresses.delta }/>
            </Skeleton>
          ) : null }
        </div>

        <Skeleton loading={ isLoading } fontWeight={ 500 }>
          <span>Daily txs</span>
          <span className="text-[var(--color-text-secondary)]"> 7D</span>
        </Skeleton>
        <div className="flex flex-row items-center gap-1">
          <Skeleton loading={ isLoading }>
            <span>{ dailyTransactions.value.toLocaleString() }</span>
          </Skeleton>
          { dailyTransactions.delta ? (
            <Skeleton loading={ isLoading }>
              <DeltaIndicator delta={ dailyTransactions.delta }/>
            </Skeleton>
          ) : null }
        </div>

        <Skeleton loading={ isLoading } fontWeight={ 500 }>
          <span>TPS</span>
        </Skeleton>
        <Skeleton loading={ isLoading }>
          <span>{ Number(data.tps ?? 0).toLocaleString(undefined, { maximumFractionDigits: 2 }) }</span>
        </Skeleton>
      </div>
    </ListItemMobile>
  );
};

export default React.memo(MultichainEcosystemsListItem);
