import React from 'react';

import type * as multichain from '@luxfi/multichain-aggregator-types';
import type { ClusterChainConfig } from 'types/multichain';

import useIsMobile from 'lib/hooks/useIsMobile';
import { cn } from 'lib/utils/cn';
import useAddChainClick from 'lib/web3/useAddChainClick';
import useProvider from 'lib/web3/useProvider';
import { WALLETS_INFO } from 'lib/web3/wallets';
import { Heading } from 'toolkit/chakra/heading';
import { IconButton } from 'toolkit/chakra/icon-button';
import { LinkBox, LinkOverlay } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tooltip } from 'toolkit/chakra/tooltip';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import ChainIcon from 'ui/shared/externalChains/ChainIcon';
import IconSvg from 'ui/shared/IconSvg';
import RollupStageBadge from 'ui/snippets/navigation/RollupStageBadge';

interface Props {
  data: ClusterChainConfig;
  isLoading: boolean;
  metrics: multichain.ChainMetrics | undefined;
}

const ChainWidget = ({ data, isLoading, metrics }: Props) => {
  const isMobile = useIsMobile();
  const { data: { wallet } = {} } = useProvider();
  const walletIcon = wallet ? WALLETS_INFO[wallet].icon : undefined;
  const handleAddToWalletClick = useAddChainClick({ source: 'Chain widget' });

  const chainStats = (
    <div gap={ 2 } alignItems="flex-start" fontWeight={ 500 }>
      <div gap={ 2 }>
        <Skeleton loading={ isLoading } color="text.secondary">
          <span>Chain ID</span>
        </Skeleton>
        <Skeleton loading={ isLoading }>{ data.id }</Skeleton>
        <CopyToClipboard text={ String(data.id) } className="ml-0" isLoading={ isLoading }/>
      </div>
      { metrics?.active_accounts?.current_full_week && (
        <div gap={ 2 }>
          <Skeleton loading={ isLoading } color="text.secondary">
            <span>Active accounts</span>
          </Skeleton>
          <Skeleton loading={ isLoading }>{ Number(metrics.active_accounts.current_full_week).toLocaleString() }</Skeleton>
        </div>
      ) }
      { metrics?.tps && (
        <div gap={ 2 }>
          <Skeleton loading={ isLoading } color="text.secondary">
            <span>TPS</span>
          </Skeleton>
          <Skeleton loading={ isLoading }>{ metrics.tps }</Skeleton>
        </div>
      ) }
    </div>
  );

  if (isMobile) {
    return (
      <LinkBox
        className="bg-[rgba(246,246,248,0.5)] dark:bg-white/5 rounded-xl border border-solid border-black/20 dark:border-white/20 p-4 basis-full text-sm overflow-hidden"
      >
        <div justifyContent="space-between" mb={ 2 }>
          <div minW="0">
            <ChainIcon data={ data } boxSize={ 5 } isLoading={ isLoading } noTooltip/>
            <Heading level="3" className="min-w-0">
              <LinkOverlay href={ data.explorer_url } external loading={ isLoading } className="group-hover:text-[var(--color-hover)]">
                <div overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
                  { data.name }
                </div>
              </LinkOverlay>
            </Heading>
          </div>
          <RollupStageBadge chainConfig={ data.app_config } isLoading={ isLoading }/>
        </div>
        { chainStats }
      </LinkBox>
    );
  }

  return (
    <LinkBox
      className={ cn(
        'group rounded-xl border border-solid p-6 text-sm overflow-hidden',
        'bg-[rgba(246,246,248,0.5)] dark:bg-white/5',
        'border-black/20 dark:border-white/20',
        'basis-[calc((100%-3*12px)/4)]',
        !isLoading && 'hover:bg-gray-50 dark:hover:bg-white/10 hover:border-[var(--color-hover)]',
      ) }
    >
      <div justifyContent="space-between">
        <ChainIcon data={ data } boxSize="30px" isLoading={ isLoading } noTooltip/>
        { walletIcon && (
          <Tooltip content="Add to wallet">
            <IconButton
              onClick={ handleAddToWalletClick }
              size="md"
              variant="icon_background"
              className="z-[1] bg-black/5 dark:bg-white/5"
              loadingSkeleton={ isLoading }
            >
              <IconSvg name={ walletIcon } boxSize={ 5 }/>
            </IconButton>
          </Tooltip>
        ) }
      </div>
      <Heading level="3" className="my-3">
        <LinkOverlay href={ data.explorer_url } external loading={ isLoading } className="group-hover:text-[var(--color-hover)]">
          <div overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
            { data.name }
          </div>
        </LinkOverlay>
      </Heading>
      <RollupStageBadge chainConfig={ data.app_config } isLoading={ isLoading } mb={ 2.5 }/>
      { chainStats }
    </LinkBox>
  );
};

export default React.memo(ChainWidget);
