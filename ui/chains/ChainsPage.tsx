import React from 'react';

import config from 'configs/app';
import type { PChainBlockchain } from 'lib/api/pchain';
import { useBlockchains } from 'lib/api/pchain';
import { cn } from 'lib/utils/cn';
import { Skeleton } from 'toolkit/chakra/skeleton';
import PageTitle from 'ui/shared/Page/PageTitle';

import ChainRow from './ChainRow';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PRIMARY_NETWORK_ID = '11111111111111111111111111111111LpoYY' as const;

// All 14 primary network chains from ~/work/lux/node/node/vms_allvms.go
// Core: C (EVM), P (PlatformVM), X (ExchangeVM)
// Extended (allvms build): A, B, D, G, I, K, O, Q, R, T, Z
const PRIMARY_CHAINS = [
  { name: 'C-Chain', fullName: 'Contract Chain', vm: 'EVM', chainId: 96369, slug: 'c-chain' },
  { name: 'P-Chain', fullName: 'Platform Chain', vm: 'PVM', chainId: null, slug: 'p-chain' },
  { name: 'X-Chain', fullName: 'Exchange Chain', vm: 'AVM', chainId: null, slug: 'x-chain' },
  { name: 'D-Chain', fullName: 'DEX Chain', vm: 'DexVM', chainId: null, slug: 'd-chain' },
  { name: 'A-Chain', fullName: 'AI Chain', vm: 'AIVM', chainId: null, slug: 'a-chain' },
  { name: 'B-Chain', fullName: 'Bridge Chain', vm: 'BridgeVM', chainId: null, slug: 'b-chain' },
  { name: 'Q-Chain', fullName: 'Quantum Chain', vm: 'QuantumVM', chainId: null, slug: 'q-chain' },
  { name: 'T-Chain', fullName: 'Threshold Chain', vm: 'ThresholdVM', chainId: null, slug: 't-chain' },
  { name: 'Z-Chain', fullName: 'ZK Chain', vm: 'ZKVM', chainId: null, slug: 'z-chain' },
  { name: 'G-Chain', fullName: 'Graph Chain', vm: 'GraphVM', chainId: null, slug: 'g-chain' },
  { name: 'K-Chain', fullName: 'Key Chain', vm: 'KeyVM', chainId: null, slug: 'k-chain' },
  { name: 'O-Chain', fullName: 'Oracle Chain', vm: 'OracleVM', chainId: null, slug: 'o-chain' },
  { name: 'R-Chain', fullName: 'Relay Chain', vm: 'RelayVM', chainId: null, slug: 'r-chain' },
  { name: 'I-Chain', fullName: 'Identity Chain', vm: 'IdentityVM', chainId: null, slug: 'i-chain' },
] as const;

const SUBNET_CHAIN_IDS: Readonly<Record<string, number>> = {
  Zoo: 200200,
  Hanzo: 36963,
  SPC: 36911,
  Pars: 494949,
};

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
  <div
    px={ 4 }
    py={ 2 }
    gap={ 4 }
    borderBottom="1px solid"
    borderColor="border.divider"
    display={{ base: 'none', lg: 'flex' }}
  >
    <div
      minW="180px"
      maxW="220px"
      flexShrink={ 0 }
      color="text.secondary"
      fontWeight="600"
      fontSize="xs"
      textTransform="uppercase"
      letterSpacing="wider"
    >
      Chain
    </div>
    <div flex={ 1 } color="text.secondary" fontWeight="600" fontSize="xs" textTransform="uppercase" letterSpacing="wider">
      Blockchain ID
    </div>
    { showSubnetId && (
      <div flex={ 1 } color="text.secondary" fontWeight="600" fontSize="xs" textTransform="uppercase" letterSpacing="wider">
        Subnet ID
      </div>
    ) }
    <div flexShrink={ 0 } w="120px" color="text.secondary" fontWeight="600" fontSize="xs" textTransform="uppercase" letterSpacing="wider">
      VM
    </div>
    <div flexShrink={ 0 } color="text.secondary" fontWeight="600" fontSize="xs" textTransform="uppercase" letterSpacing="wider" ml="auto">
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
      isActive ? 'font-semibold text-[var(--color-text-primary)] border-[var(--color-text-primary)]' : 'font-normal text-[var(--color-text-secondary)] border-transparent',
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

  return (
    <>
      <PageTitle
        title="Chains"
        secondRow={ (
          <div fontSize="sm" color="text.secondary">
            All blockchains on { config.chain.name || 'the network' }
          </div>
        ) }
      />

      { /* Tabs */ }
      <div
        borderBottom="1px solid"
        borderColor="border.divider"
        mb={ 4 }
        gap={ 0 }
      >
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
        <div
          border="1px solid"
          borderColor="border.divider"
          borderRadius="md"
          overflow="hidden"
        >
          <TableHeader showSubnetId={ false }/>
          { PRIMARY_CHAINS.map((chain) => (
            <ChainRow
              key={ chain.name }
              name={ chain.name }
              fullName={ chain.fullName }
              vmLabel={ chain.vm }
              chainId={ chain.chainId }
              isActive
              href={ `/chains/${ chain.slug }` }
            />
          )) }
        </div>
      ) }

      { /* L1/L2/L3 tab */ }
      { activeTab === TAB_IDS.subnets && (
        <div
          border="1px solid"
          borderColor="border.divider"
          borderRadius="md"
          overflow="hidden"
        >
          <TableHeader showSubnetId/>
          { isLoading && (
            <div px={ 4 } py={ 6 }>
              <Skeleton loading={ true } h="20px" mb={ 3 }/>
              <Skeleton loading={ true } h="20px" mb={ 3 }/>
              <Skeleton loading={ true } h="20px" mb={ 3 }/>
              <Skeleton loading={ true } h="20px"/>
            </div>
          ) }
          { !isLoading && l1Chains.length === 0 && (
            <div px={ 4 } py={ 8 } textAlign="center" color="text.secondary" fontSize="sm">
              No L1/L2/L3 chains found
            </div>
          ) }
          { !isLoading && l1Chains.map((chain) => (
            <ChainRow
              key={ chain.id }
              name={ chain.name }
              blockchainId={ chain.id }
              subnetId={ chain.subnetID }
              vmId={ chain.vmID }
              vmLabel={ resolveVmLabel(chain.vmID) }
              chainId={ SUBNET_CHAIN_IDS[chain.name] ?? null }
              isActive
              href={ `/chains/${ chain.name.toLowerCase() }` }
            />
          )) }
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
