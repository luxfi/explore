import { Skeleton } from '@luxfi/ui/skeleton';
import React from 'react';

import config from 'configs/app';
import { getEnvValue } from 'configs/app/utils';
import type { PChainBlockchain } from 'lib/api/pchain';
import { useBlockchains } from 'lib/api/pchain';
import { cn } from 'lib/utils/cn';
import PageTitle from 'ui/shared/Page/PageTitle';

import ChainRow from './ChainRow';

// ---------------------------------------------------------------------------
// L1 Mode: Sovereign L1 deployments (e.g., Liquidity) show only their own
// chains configured via NEXT_PUBLIC_L1_CHAINS env var. No primary network.
//
// Format: JSON array of {name, fullName, vm, chainId?, slug, url?, isActive}
// Example: [{"name":"Liquid EVM","fullName":"EVM Chain","vm":"EVM","chainId":8675309,"slug":"evm","isActive":true}]
//
// When set, the Primary Network tab and P-Chain API calls are completely hidden.
// ---------------------------------------------------------------------------

interface L1Chain {
  name: string;
  fullName: string;
  vm: string;
  chainId: number | null;
  slug: string;
  url?: string;
  isActive: boolean;
}

// Parse L1 chains — called inside the component (runtime, not build time)
function parseL1Chains(): Array<L1Chain> {
  const raw = getEnvValue('NEXT_PUBLIC_L1_CHAINS') || '';
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    try {
      // envs.js strips quotes: {name:Foo} → re-quote for JSON.parse
      const fixed = raw
        .replace(/(?<=[{,]\s*)(\w+)\s*:/g, '"$1":')
        .replace(/:\s*([^"{[\d,\]\s}][^,}\]]*)/g, ':"$1"')
        .replace(/"true"/g, 'true')
        .replace(/"false"/g, 'false')
        .replace(/"null"/g, 'null');
      return JSON.parse(fixed);
    } catch {
      return [];
    }
  }
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PRIMARY_NETWORK_ID = '11111111111111111111111111111111LpoYY' as const;

// Primary network chains.
// Only C, P, X are deployed and live on mainnet.
// Extended chains (A, B, D, G, I, K, O, Q, R, T, Z) exist as VM types in
// the node codebase but are NOT live -- they are listed as "Planned" and
// excluded from active chain counts.
const PRIMARY_CHAINS = [
  { name: 'C-Chain', fullName: 'Contract Chain', vm: 'EVM', chainId: 96369, slug: 'c-chain', isLive: true },
  { name: 'P-Chain', fullName: 'Platform Chain', vm: 'PVM', chainId: null, slug: 'p-chain', isLive: true },
  { name: 'X-Chain', fullName: 'Exchange Chain', vm: 'AVM', chainId: null, slug: 'x-chain', isLive: true },
  { name: 'D-Chain', fullName: 'DEX Chain', vm: 'DexVM', chainId: null, slug: 'd-chain', isLive: false },
  { name: 'A-Chain', fullName: 'AI Chain', vm: 'AIVM', chainId: null, slug: 'a-chain', isLive: false },
  { name: 'B-Chain', fullName: 'Bridge Chain', vm: 'BridgeVM', chainId: null, slug: 'b-chain', isLive: false },
  { name: 'Q-Chain', fullName: 'Quantum Chain', vm: 'QuantumVM', chainId: null, slug: 'q-chain', isLive: false },
  { name: 'T-Chain', fullName: 'Threshold Chain', vm: 'ThresholdVM', chainId: null, slug: 't-chain', isLive: false },
  { name: 'Z-Chain', fullName: 'ZK Chain', vm: 'ZKVM', chainId: null, slug: 'z-chain', isLive: false },
  { name: 'G-Chain', fullName: 'Graph Chain', vm: 'GraphVM', chainId: null, slug: 'g-chain', isLive: false },
  { name: 'K-Chain', fullName: 'Key Chain', vm: 'KeyVM', chainId: null, slug: 'k-chain', isLive: false },
  { name: 'O-Chain', fullName: 'Oracle Chain', vm: 'OracleVM', chainId: null, slug: 'o-chain', isLive: false },
  { name: 'R-Chain', fullName: 'Relay Chain', vm: 'RelayVM', chainId: null, slug: 'r-chain', isLive: false },
  { name: 'I-Chain', fullName: 'Identity Chain', vm: 'IdentityVM', chainId: null, slug: 'i-chain', isLive: false },
] as const;

const SUBNET_CHAIN_IDS: Readonly<Record<string, number>> = {
  Zoo: 200200,
  Hanzo: 36963,
  SPC: 36911,
  Pars: 494949,
};

// Map P-chain internal blockchain names (e.g. "pars3", "spc2") to display names
const L1_DISPLAY_NAMES: Readonly<Record<string, string>> = {
  pars: 'Pars', pars2: 'Pars', pars3: 'Pars',
  spc: 'SPC', spc2: 'SPC', spc3: 'SPC',
  hanzo: 'Hanzo', hanzo2: 'Hanzo', hanzo3: 'Hanzo',
  zoo: 'Zoo', zoo2: 'Zoo', zoo3: 'Zoo',
};

function getL1DisplayName(rawName: string): string {
  return L1_DISPLAY_NAMES[rawName] ?? rawName;
}

const TAB_IDS = {
  primary: 'primary',
  subnets: 'subnets',
} as const;

type TabId = typeof TAB_IDS[keyof typeof TAB_IDS];

const EMPTY_L1_CHAINS: ReadonlyArray<PChainBlockchain> = [];

// ---------------------------------------------------------------------------
// Table header
// ---------------------------------------------------------------------------

interface TableHeaderProps {
  readonly showSubnetId: boolean;
}

const TableHeader = ({ showSubnetId }: TableHeaderProps) => (
  <div className="hidden lg:flex px-4 py-2 gap-4 border-b border-[var(--color-border-divider)]">
    <div className="min-w-[180px] max-w-[220px] shrink-0 text-[var(--color-text-secondary)] font-semibold text-xs uppercase tracking-wider">
      Chain
    </div>
    <div className="flex-1 text-[var(--color-text-secondary)] font-semibold text-xs uppercase tracking-wider">
      Blockchain ID
    </div>
    { showSubnetId && (
      <div className="flex-1 text-[var(--color-text-secondary)] font-semibold text-xs uppercase tracking-wider">
        Subnet ID
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
    return blockchains.filter((chain) => chain.subnetID !== PRIMARY_NETWORK_ID);
  }, [ blockchains ]);

  const handlePrimaryClick = React.useCallback(() => {
    setActiveTab(TAB_IDS.primary);
  }, []);

  const handleSubnetsClick = React.useCallback(() => {
    setActiveTab(TAB_IDS.subnets);
  }, []);

  // ─── L1 Mode: Sovereign chain — show only configured chains ───────

  const l1Chains2 = React.useMemo(() => parseL1Chains(), []);
  if (l1Chains2.length > 0) {
    return (
      <>
        <PageTitle
          title="Chains"
          secondRow={ (
            <div className="text-sm text-[var(--color-text-secondary)]">
              Blockchains on { config.chain.name || 'the network' }
            </div>
          ) }
        />
        <div className="border border-[var(--color-border-divider)] rounded-md overflow-hidden">
          <TableHeader showSubnetId={ false }/>
          { l1Chains2.map((chain) => (
            <ChainRow
              key={ chain.name }
              name={ chain.name }
              fullName={ chain.fullName }
              vmLabel={ chain.vm }
              chainId={ chain.chainId }
              isActive={ chain.isActive }
              href={ chain.url || `/chains/${ chain.slug }` }
            />
          )) }
        </div>
      </>
    );
  }

  // ─── Normal mode: Primary Network + L1/L2/L3 tabs ─────────────────
  return (
    <>
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
          isActive={ activeTab === TAB_IDS.subnets }
          onClick={ handleSubnetsClick }
        />
      </div>

      { /* Primary Network tab */ }
      { activeTab === TAB_IDS.primary && (
        <div className="border border-[var(--color-border-divider)] rounded-md overflow-hidden">
          <TableHeader showSubnetId={ false }/>
          { PRIMARY_CHAINS.map((chain) => (
            <ChainRow
              key={ chain.name }
              name={ chain.name }
              fullName={ chain.isLive ? chain.fullName : `${ chain.fullName } (Planned)` }
              vmLabel={ chain.vm }
              chainId={ chain.chainId }
              isActive={ chain.isLive }
              href={ chain.isLive ? `/chains/${ chain.slug }` : undefined }
            />
          )) }
        </div>
      ) }

      { /* L1/L2/L3 tab */ }
      { activeTab === TAB_IDS.subnets && (
        <div className="border border-[var(--color-border-divider)] rounded-md overflow-hidden">
          <TableHeader showSubnetId/>
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
          { !isLoading && l1Chains.map((chain) => {
            const displayName = getL1DisplayName(chain.name);
            return (
              <ChainRow
                key={ chain.id }
                name={ displayName }
                blockchainId={ chain.id }
                subnetId={ chain.subnetID }
                vmId={ chain.vmID }
                vmLabel={ resolveVmLabel(chain.vmID) }
                chainId={ SUBNET_CHAIN_IDS[displayName] ?? null }
                isActive
                href={ `/chains/${ displayName.toLowerCase() }` }
              />
            );
          }) }
        </div>
      ) }
    </>
  );
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const KNOWN_VM_IDS: Readonly<Record<string, string>> = {
  mgj786NP7uDwBCcq6YwThhaN8FLyybkCa4zBWTQbNgmK6k9A6: 'EVM',
  ag3GReYPNuSR17rUP8acMdZipQBikdXNRKDyFszAysmy3vDXE: 'L2',
  jvYyfQTxGMJLuGWa55kdP2p2zSUYsQ5Raupu4TW34ZAUBAbtq: 'AVM',
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
