import React from 'react';

import type * as multichain from '@luxfi/multichain-aggregator-types';
import type { ClusterChainConfig } from 'types/multichain';

import useAddChainClick from 'lib/web3/useAddChainClick';
import useProvider from 'lib/web3/useProvider';
import { WALLETS_INFO } from 'lib/web3/wallets';
import { IconButton } from 'toolkit/chakra/icon-button';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import { Tooltip } from 'toolkit/chakra/tooltip';
import { TruncatedText } from 'toolkit/components/truncation/TruncatedText';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import ChainIcon from 'ui/shared/externalChains/ChainIcon';
import IconSvg from 'ui/shared/IconSvg';

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

const MultichainEcosystemsTableItem = ({ data, isLoading, chainInfo }: Props) => {

  const { data: { wallet } = {} } = useProvider();
  const walletIcon = wallet ? WALLETS_INFO[wallet].icon : undefined;

  const handleAddToWalletClick = useAddChainClick({ source: 'Chain widget' });

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
    <TableRow alignItems="top">
      <TableCell verticalAlign="middle">
        <div className="flex flex-row items-center gap-3">
          <div className="flex flex-row items-center gap-2">
            <ChainIcon data={ chainInfo } isLoading={ isLoading }/>
            <Link
              href={ chainInfo?.explorer_url }
              className="font-bold max-w-[calc(100%-28px)]"
              external
              loading={ isLoading }
            >
              <TruncatedText text={ chainInfo?.name ?? 'Unknown chain' } loading={ isLoading }/>
            </Link>
          </div>
          <div className="flex flex-row items-center gap-0 shrink-0">
            <Skeleton loading={ isLoading } color="text.secondary"><span>{ data.chain_id }</span></Skeleton>
            <CopyToClipboard text={ String(data.chain_id) } isLoading={ isLoading }/>
          </div>
        </div>
      </TableCell>
      <TableCell verticalAlign="middle">
        <div className="flex flex-row items-center gap-2">
          <Skeleton loading={ isLoading }>
            <span>{ activeAddresses.value.toLocaleString() }</span>
          </Skeleton>
          { activeAddresses.delta ? (
            <Skeleton loading={ isLoading }>
              <DeltaIndicator delta={ activeAddresses.delta }/>
            </Skeleton>
          ) : null }
        </div>
      </TableCell>
      <TableCell verticalAlign="middle">
        <div className="flex flex-row items-center gap-2">
          <Skeleton loading={ isLoading }>
            <span>{ newAddresses.value.toLocaleString() }</span>
          </Skeleton>
          { newAddresses.delta ? (
            <Skeleton loading={ isLoading }>
              <DeltaIndicator delta={ newAddresses.delta }/>
            </Skeleton>
          ) : null }
        </div>
      </TableCell>
      <TableCell verticalAlign="middle">
        <div className="flex flex-row items-center gap-2">
          <Skeleton loading={ isLoading }>
            <span>{ dailyTransactions.value.toLocaleString() }</span>
          </Skeleton>
          { dailyTransactions.delta ? (
            <Skeleton loading={ isLoading }>
              <DeltaIndicator delta={ dailyTransactions.delta }/>
            </Skeleton>
          ) : null }
        </div>
      </TableCell>
      <TableCell verticalAlign="middle">
        <div className="flex flex-row items-center justify-between">
          <Skeleton loading={ isLoading }>
            <span>{ Number(data.tps ?? 0).toLocaleString(undefined, { maximumFractionDigits: 2 }) }</span>
          </Skeleton>
          { walletIcon ? (
            <Tooltip content="Add to wallet">
              <IconButton
                onClick={ handleAddToWalletClick }
                size="md"
                variant="icon_background"
                className="bg-black/5 dark:bg-white/5"
                loadingSkeleton={ isLoading }
              >
                <IconSvg name={ walletIcon } className="w-5 h-5"/>
              </IconButton>
            </Tooltip>
          ) : <div className="w-8 h-8"/> }
        </div>
      </TableCell>
    </TableRow>
  );
};

export default React.memo(MultichainEcosystemsTableItem);
