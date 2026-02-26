import { Box, Flex } from '@chakra-ui/react';
import React from 'react';

import type { PChainBlockchain } from 'lib/api/pchain';
import { useBlockchains } from 'lib/api/pchain';
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
  <Flex
    px={ 4 }
    py={ 2 }
    gap={ 4 }
    borderBottom="1px solid"
    borderColor="border.divider"
    display={{ base: 'none', lg: 'flex' }}
  >
    <Box
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
    </Box>
    <Box flex={ 1 } color="text.secondary" fontWeight="600" fontSize="xs" textTransform="uppercase" letterSpacing="wider">
      Blockchain ID
    </Box>
    { showSubnetId && (
      <Box flex={ 1 } color="text.secondary" fontWeight="600" fontSize="xs" textTransform="uppercase" letterSpacing="wider">
        Subnet ID
      </Box>
    ) }
    <Box flexShrink={ 0 } w="120px" color="text.secondary" fontWeight="600" fontSize="xs" textTransform="uppercase" letterSpacing="wider">
      VM
    </Box>
    <Box flexShrink={ 0 } color="text.secondary" fontWeight="600" fontSize="xs" textTransform="uppercase" letterSpacing="wider" ml="auto">
      Status
    </Box>
  </Flex>
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
  <Box
    as="button"
    px={ 4 }
    py={ 2 }
    fontSize="sm"
    fontWeight={ isActive ? '600' : '400' }
    color={ isActive ? 'text.primary' : 'text.secondary' }
    borderBottom="2px solid"
    borderColor={ isActive ? 'text.primary' : 'transparent' }
    bg="transparent"
    cursor="pointer"
    transition="all 0.15s"
    _hover={{ color: 'text.primary' }}
    onClick={ onClick }
  >
    { label }
  </Box>
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
          <Box fontSize="sm" color="text.secondary">
            All blockchains on the Lux Network
          </Box>
        ) }
      />

      { /* Tabs */ }
      <Flex
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
      </Flex>

      { /* Primary Network tab */ }
      { activeTab === TAB_IDS.primary && (
        <Box
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
        </Box>
      ) }

      { /* L1/L2/L3 tab */ }
      { activeTab === TAB_IDS.subnets && (
        <Box
          border="1px solid"
          borderColor="border.divider"
          borderRadius="md"
          overflow="hidden"
        >
          <TableHeader showSubnetId/>
          { isLoading && (
            <Box px={ 4 } py={ 6 }>
              <Skeleton loading={ true } h="20px" mb={ 3 }/>
              <Skeleton loading={ true } h="20px" mb={ 3 }/>
              <Skeleton loading={ true } h="20px" mb={ 3 }/>
              <Skeleton loading={ true } h="20px"/>
            </Box>
          ) }
          { !isLoading && l1Chains.length === 0 && (
            <Box px={ 4 } py={ 8 } textAlign="center" color="text.secondary" fontSize="sm">
              No L1/L2/L3 chains found
            </Box>
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
        </Box>
      ) }
    </>
  );
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const KNOWN_VM_IDS: Readonly<Record<string, string>> = {
  mgj786NP7uDwBCcq6YwThhaN8FLyybkCa4zBWTQbNgmK6k9A6: 'EVM',
  ag3GReYPNuSR17rUP8acMdZipQBikdXNRKDyFszAysmy3vDXE: 'Subnet EVM',
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
