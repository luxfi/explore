import { Skeleton } from '@luxfi/ui/skeleton';
import React from 'react';

import config from 'configs/app';
import { PRIMARY_VMS } from 'configs/app/primaryChains';
import type { PChainBlockchain } from 'lib/api/pchain';
import { useBlockchains } from 'lib/api/pchain';
import { cn } from 'lib/utils/cn';
import PageTitle from 'ui/shared/Page/PageTitle';
import PrimaryNetworkGuard from 'ui/shared/PrimaryNetworkGuard';

import ChainRow from './ChainRow';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PRIMARY_NETWORK_ID = '11111111111111111111111111111111LpoYY' as const;

// Which primary chains EXIST is the network's answer, read live from
// platform.getBlockchains; configs/app/primaryChains.ts only says how to
// present one. Listing the hardcoded set gave every network the same fifteen
// rows, four of which (T, R, I, O) are registered on no network at all — the
// node answers "there is no ID with alias: T" — and one of which (M) exists
// only on devnet. The P-Chain is added by hand because it is the registry, so
// it never appears in its own list.

const L1_EVM_CHAIN_IDS: Readonly<Record<string, number>> = {
  Zoo: 200200,
  Hanzo: 36963,
  SPC: 36911,
  Pars: 494949,
};

const TAB_IDS = {
  primary: 'primary',
  l1: 'l1',
} as const;

type TabId = typeof TAB_IDS[keyof typeof TAB_IDS];

const EMPTY_L1_CHAINS: ReadonlyArray<PChainBlockchain> = [];

// ---------------------------------------------------------------------------
// Table header
// ---------------------------------------------------------------------------

interface TableHeaderProps {
  readonly showNetId: boolean;
}

const TableHeader = ({ showNetId }: TableHeaderProps) => (
  <div className="hidden lg:flex px-4 py-2 gap-4 border-b border-[var(--color-border-divider)]">
    <div className="min-w-[180px] max-w-[220px] shrink-0 text-[var(--color-text-secondary)] font-semibold text-xs uppercase tracking-wider">
      Chain
    </div>
    <div className="flex-1 text-[var(--color-text-secondary)] font-semibold text-xs uppercase tracking-wider">
      Blockchain ID
    </div>
    { showNetId && (
      <div className="flex-1 text-[var(--color-text-secondary)] font-semibold text-xs uppercase tracking-wider">
        Network ID
      </div>
    ) }
    <div className="shrink-0 w-[120px] text-[var(--color-text-secondary)] font-semibold text-xs uppercase tracking-wider">
      VM
    </div>
    <div className="shrink-0 text-[var(--color-text-secondary)] font-semibold text-xs uppercase tracking-wider ml-auto">
      Status
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Tab button
// ---------------------------------------------------------------------------

interface TabButtonProps {
  readonly label: string;
  readonly isActive: boolean;
  readonly onClick: () => void;
}

const TabButton = ({ label, isActive, onClick }: TabButtonProps) => (
  <button
    className={ cn(
      'px-4 py-2 text-sm bg-transparent cursor-pointer transition-all duration-150 border-b-2 hover:text-[var(--color-text-primary)]',
      isActive ?
        'font-semibold text-[var(--color-text-primary)] border-[var(--color-text-primary)]' :
        'font-normal text-[var(--color-text-secondary)] border-transparent',
    ) }
    onClick={ onClick }
  >
    { label }
  </button>
);

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

const ChainsPage = () => {
  const [ activeTab, setActiveTab ] = React.useState<TabId>(TAB_IDS.primary);
  const { blockchains, isLoading } = useBlockchains();

  const l1Chains = React.useMemo<ReadonlyArray<PChainBlockchain>>(() => {
    if (!blockchains.length) {
      return EMPTY_L1_CHAINS;
    }
    return blockchains.filter((chain) => chain.netID !== PRIMARY_NETWORK_ID);
  }, [ blockchains ]);

  // The primary chains this network actually runs, in the registry's order,
  // each paired with its presentation metadata. A chain the network reports
  // but we have no metadata for still gets a row — the network is the source
  // of truth, not our table.
  const primaryChains = React.useMemo(() => {
    const rows = blockchains
      .filter((chain) => chain.netID === PRIMARY_NETWORK_ID)
      .map((chain) => {
        const slug = chain.name.toLowerCase();
        return { chain, meta: PRIMARY_VMS.find((vm) => vm.slug === slug) };
      });
    const pChain = PRIMARY_VMS.find((vm) => vm.slug === 'p-chain');
    return pChain ? [ { chain: undefined, meta: pChain }, ...rows ] : rows;
  }, [ blockchains ]);

  const handlePrimaryClick = React.useCallback(() => {
    setActiveTab(TAB_IDS.primary);
  }, []);

  const handleL1Click = React.useCallback(() => {
    setActiveTab(TAB_IDS.l1);
  }, []);

  return (
    <PrimaryNetworkGuard title="Chains">
      <PageTitle
        title="Chains"
        secondRow={ (
          <div className="text-sm text-[var(--color-text-secondary)]">
            All blockchains on { config.chain.name || 'the network' }
          </div>
        ) }
      />

      { /* Tabs */ }
      <div className="flex border-b border-[var(--color-border-divider)] mb-4">
        <TabButton
          label="Primary Network"
          isActive={ activeTab === TAB_IDS.primary }
          onClick={ handlePrimaryClick }
        />
        <TabButton
          label={ `L1 / L2 / L3${ l1Chains.length > 0 ? ` (${ l1Chains.length })` : '' }` }
          isActive={ activeTab === TAB_IDS.l1 }
          onClick={ handleL1Click }
        />
      </div>

      { /* Primary Network tab */ }
      { activeTab === TAB_IDS.primary && (
        <div className="border border-[var(--color-border-divider)] rounded-md overflow-hidden">
          <TableHeader showNetId={ false }/>
          { isLoading && (
            <div className="px-4 py-6">
              <Skeleton loading={ true } h="20px" mb={ 3 }/>
              <Skeleton loading={ true } h="20px" mb={ 3 }/>
              <Skeleton loading={ true } h="20px"/>
            </div>
          ) }
          { !isLoading && primaryChains.length === 0 && (
            <div className="px-4 py-8 text-center text-[var(--color-text-secondary)] text-sm">
              The P-Chain did not answer, so this network&apos;s chain list is unknown
            </div>
          ) }
          { !isLoading && primaryChains.map(({ chain, meta }) => (
            <ChainRow
              key={ meta?.slug ?? chain?.id }
              name={ meta?.name ?? chain?.name ?? '' }
              fullName={ meta?.fullName }
              blockchainId={ chain?.id }
              vmLabel={ meta?.vm ?? 'Unknown' }
              chainId={ meta?.chainId ?? null }
              isActive
              href={ `/chains/${ meta?.slug ?? (chain?.name ?? '').toLowerCase() }` }
            />
          )) }
        </div>
      ) }

      { /* L1/L2/L3 tab */ }
      { activeTab === TAB_IDS.l1 && (
        <div className="border border-[var(--color-border-divider)] rounded-md overflow-hidden">
          <TableHeader showNetId/>
          { isLoading && (
            <div className="px-4 py-6">
              <Skeleton loading={ true } h="20px" mb={ 3 }/>
              <Skeleton loading={ true } h="20px" mb={ 3 }/>
              <Skeleton loading={ true } h="20px" mb={ 3 }/>
              <Skeleton loading={ true } h="20px"/>
            </div>
          ) }
          { !isLoading && l1Chains.length === 0 && (
            <div className="px-4 py-8 text-center text-[var(--color-text-secondary)] text-sm">
              No L1/L2/L3 chains found
            </div>
          ) }
          { !isLoading && l1Chains.map((chain) => (
            <ChainRow
              key={ chain.id }
              name={ chain.name }
              blockchainId={ chain.id }
              netId={ chain.netID }
              vmId={ chain.vmID }
              vmLabel={ resolveVmLabel(chain.vmID) }
              chainId={ L1_EVM_CHAIN_IDS[chain.name] ?? null }
              isActive
              href={ `/chains/${ chain.name.toLowerCase() }` }
            />
          )) }
        </div>
      ) }
    </PrimaryNetworkGuard>
  );
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const KNOWN_VM_IDS: Readonly<Record<string, string>> = {
  mgj786NP7uDwBCcq6YwThhaN8FLyybkCa4zBWTQbNgmK6k9A6: 'EVM',
  ag3GReYPNuSR17rUP8acMdZipQBikdXNRKDyFszAysmy3vDXE: 'L2',
  jvYyfQTxGMJLuGWa55kdP2p2zSUYsQ5Raupu4TW34ZAUBAbtq: 'XVM',
  rWhpuQPF1kb72esV2momhMuTYGkEb1oL29pt2EBXWsBY6MALT: 'PVM',
};

function resolveVmLabel(vmId?: string): string {
  if (!vmId) {
    return 'Unknown';
  }
  return KNOWN_VM_IDS[vmId] ?? truncateVmId(vmId);
}

function truncateVmId(vmId: string): string {
  if (vmId.length <= 12) {
    return vmId;
  }
  return `${ vmId.slice(0, 6) }...${ vmId.slice(-4) }`;
}

export default ChainsPage;
