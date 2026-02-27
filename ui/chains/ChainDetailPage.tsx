import { Box, Flex, Grid, Text } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

import { useBlockchains, useCurrentValidators, useSubnets } from 'lib/api/pchain';
import type { PChainBlockchain, PChainValidator } from 'lib/api/pchain';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tag } from 'toolkit/chakra/tag';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import PageTitle from 'ui/shared/Page/PageTitle';

const PRIMARY_NETWORK_ID = '11111111111111111111111111111111LpoYY';
const LUX_DECIMALS = 9;

const INFO_ROW_BG = { _light: 'gray.50', _dark: 'whiteAlpha.50' };

const PRIMARY_CHAIN_META: Readonly<Record<string, {
  readonly name: string;
  readonly fullName: string;
  readonly vm: string;
  readonly vmId: string;
  readonly description: string;
}>> = {
  'c-chain': {
    name: 'C-Chain',
    fullName: 'Contract Chain',
    vm: 'EVM',
    vmId: 'mgj786NP7uDwBCcq6YwThhaN8FLyybkCa4zBWTQbNgmK6k9A6',
    description: 'The C-Chain is an EVM-compatible blockchain on the Lux Network used for smart contracts and DeFi applications.',
  },
  'p-chain': {
    name: 'P-Chain',
    fullName: 'Platform Chain',
    vm: 'PVM',
    vmId: 'rWhpuQPF1kb72esV2momhMuTYGkEb1oL29pt2EBXWsBY6MALT',
    description: 'The P-Chain manages validators, staking, and subnet creation across the Lux Network.',
  },
  'x-chain': {
    name: 'X-Chain',
    fullName: 'Exchange Chain',
    vm: 'AVM',
    vmId: 'jvYyfQTxGMJLuGWa55kdP2p2zSUYsQ5Raupu4TW34ZAUBAbtq',
    description: 'The X-Chain is a DAG-based chain for creating and exchanging digital assets on the Lux Network.',
  },
  'd-chain': {
    name: 'D-Chain',
    fullName: 'DEX Chain',
    vm: 'DexVM',
    vmId: '',
    description: 'The D-Chain is a decentralized exchange chain on the Lux Network for on-chain order books and token swaps.',
  },
  'a-chain': {
    name: 'A-Chain',
    fullName: 'AI Chain',
    vm: 'AIVM',
    vmId: '',
    description: 'The A-Chain powers AI workloads on the Lux Network, providing decentralized inference and model serving.',
  },
  'b-chain': {
    name: 'B-Chain',
    fullName: 'Bridge Chain',
    vm: 'BridgeVM',
    vmId: '',
    description: 'The B-Chain is the bridge relay chain on the Lux Network, enabling cross-chain asset transfers via Teleporter.',
  },
  'q-chain': {
    name: 'Q-Chain',
    fullName: 'Quantum Chain',
    vm: 'QuantumVM',
    vmId: '',
    description: 'The Q-Chain provides post-quantum cryptographic primitives and quantum-resistant operations on the Lux Network.',
  },
  't-chain': {
    name: 'T-Chain',
    fullName: 'Threshold Chain',
    vm: 'ThresholdVM',
    vmId: '',
    description: 'The T-Chain enables threshold signature schemes and distributed key generation on the Lux Network.',
  },
  'z-chain': {
    name: 'Z-Chain',
    fullName: 'ZK Chain',
    vm: 'ZKVM',
    vmId: '',
    description: 'The Z-Chain handles zero-knowledge proof generation and verification on the Lux Network.',
  },
  'g-chain': {
    name: 'G-Chain',
    fullName: 'Graph Chain',
    vm: 'GraphVM',
    vmId: '',
    description: 'The G-Chain provides decentralized graph indexing and query services on the Lux Network.',
  },
  'k-chain': {
    name: 'K-Chain',
    fullName: 'Key Chain',
    vm: 'KeyVM',
    vmId: '',
    description: 'The K-Chain provides decentralized key management and custody services on the Lux Network.',
  },
  'o-chain': {
    name: 'O-Chain',
    fullName: 'Oracle Chain',
    vm: 'OracleVM',
    vmId: '',
    description: 'The O-Chain provides decentralized oracle services, bringing off-chain data on-chain for the Lux Network.',
  },
  'r-chain': {
    name: 'R-Chain',
    fullName: 'Relay Chain',
    vm: 'RelayVM',
    vmId: '',
    description: 'The R-Chain handles cross-chain message relay and interoperability routing on the Lux Network.',
  },
  'i-chain': {
    name: 'I-Chain',
    fullName: 'Identity Chain',
    vm: 'IdentityVM',
    vmId: '',
    description: 'The I-Chain manages decentralized identity, DIDs, and verifiable credentials on the Lux Network.',
  },
};

const SUBNET_CHAIN_IDS: Readonly<Record<string, number>> = {
  zoo: 200200,
  hanzo: 36963,
  spc: 36911,
  pars: 494949,
};

const SUBNET_DESCRIPTIONS: Readonly<Record<string, string>> = {
  zoo: 'Zoo is an L1 blockchain on the Lux Network for the Zoo Labs Foundation open AI research network.',
  hanzo: 'Hanzo is an L1 blockchain on the Lux Network for Hanzo AI infrastructure and agent frameworks.',
  spc: 'SPC is an L1 blockchain on the Lux Network.',
  pars: 'Pars is an L1 blockchain on the Lux Network.',
};

const EXPLORER_URLS: Readonly<Record<string, string>> = {
  zoo: 'https://explore-zoo.lux.network',
  hanzo: 'https://explore-hanzo.lux.network',
  spc: 'https://explore-spc.lux.network',
  pars: 'https://explore-pars.lux.network',
};

const KNOWN_VM_IDS: Readonly<Record<string, string>> = {
  mgj786NP7uDwBCcq6YwThhaN8FLyybkCa4zBWTQbNgmK6k9A6: 'EVM',
  ag3GReYPNuSR17rUP8acMdZipQBikdXNRKDyFszAysmy3vDXE: 'Subnet EVM',
  jvYyfQTxGMJLuGWa55kdP2p2zSUYsQ5Raupu4TW34ZAUBAbtq: 'AVM',
  rWhpuQPF1kb72esV2momhMuTYGkEb1oL29pt2EBXWsBY6MALT: 'PVM',
};

// DAG chain indexer API URLs
const CHAIN_INDEXER_URLS: Readonly<Record<string, string>> = {
  'x-chain': 'https://api-indexer-xchain.lux.network',
  'a-chain': 'https://api-indexer-achain.lux.network',
  'b-chain': 'https://api-indexer-bchain.lux.network',
  'q-chain': 'https://api-indexer-qchain.lux.network',
  't-chain': 'https://api-indexer-tchain.lux.network',
  'z-chain': 'https://api-indexer-zchain.lux.network',
  'k-chain': 'https://api-indexer-kchain.lux.network',
  'p-chain': 'https://api-indexer-pchain.lux.network',
  'c-chain': 'https://api-indexer.lux.network',
};

interface IndexerStats {
  readonly chain_stats: Record<string, unknown>;
  readonly dag_stats?: {
    readonly total_vertices: number;
    readonly total_edges: number;
    readonly accepted_vertices: number;
    readonly pending_vertices: number;
    readonly chain_type: string;
    readonly last_updated: string;
  };
}

function useChainIndexerStats(slug: string): { stats: IndexerStats | null; isLoading: boolean } {
  const indexerUrl = CHAIN_INDEXER_URLS[slug];
  const query = useQuery({
    queryKey: [ 'chainIndexerStats', slug ],
    queryFn: async() => {
      if (!indexerUrl) return null;
      const res = await fetch(`${ indexerUrl }/api/v2/stats`);
      if (!res.ok) return null;
      return await res.json() as IndexerStats;
    },
    staleTime: 30_000,
    enabled: Boolean(indexerUrl),
  });
  return { stats: query.data ?? null, isLoading: query.isLoading };
}

function formatStake(nanoLux: bigint): string {
  const lux = Number(nanoLux) / Math.pow(10, LUX_DECIMALS);
  if (lux >= 1_000_000) return `${ (lux / 1_000_000).toFixed(2) }M`;
  if (lux >= 1_000) return `${ (lux / 1_000).toFixed(2) }K`;
  return lux.toFixed(2);
}

function truncateId(id: string, len: number = 16): string {
  if (id.length <= len) return id;
  return `${ id.slice(0, 8) }...${ id.slice(-6) }`;
}

interface InfoRowProps {
  readonly label: string;
  readonly value: string;
  readonly isMono?: boolean;
  readonly canCopy?: boolean;
}

const InfoRow = ({ label, value, isMono = false, canCopy = false }: InfoRowProps) => (
  <Flex
    py={ 3 }
    px={ 4 }
    borderBottom="1px solid"
    borderColor="border.divider"
    _odd={{ bgColor: INFO_ROW_BG }}
    gap={ 4 }
    flexWrap={{ base: 'wrap', lg: 'nowrap' }}
  >
    <Box
      minW={{ base: '100%', lg: '200px' }}
      flexShrink={ 0 }
      color="text.secondary"
      fontSize="sm"
      fontWeight={ 500 }
    >
      { label }
    </Box>
    <Flex flex={ 1 } align="center" gap={ 1 } minW={ 0 }>
      <Text
        fontSize="sm"
        color="text.primary"
        fontFamily={ isMono ? 'mono' : 'body' }
        wordBreak="break-all"
      >
        { value }
      </Text>
      { canCopy && <CopyToClipboard text={ value }/> }
    </Flex>
  </Flex>
);

interface ValidatorRowProps {
  readonly validator: PChainValidator;
  readonly index: number;
}

const ValidatorRow = ({ validator, index }: ValidatorRowProps) => {
  const stake = BigInt(validator.stakeAmount || validator.weight || '0');
  const uptime = parseFloat(validator.uptime || '0') * 100;

  return (
    <Flex
      py={ 3 }
      px={ 4 }
      borderBottom="1px solid"
      borderColor="border.divider"
      _hover={{ bg: { _light: 'gray.50', _dark: 'whiteAlpha.50' } }}
      transition="background 0.15s"
      gap={ 4 }
      align="center"
      flexWrap={{ base: 'wrap', lg: 'nowrap' }}
    >
      <Box w="40px" flexShrink={ 0 } color="text.secondary" fontSize="sm">
        { index + 1 }
      </Box>
      <Box flex={ 2 } minW={ 0 }>
        <Text fontSize="sm" fontFamily="mono" color="text.primary" title={ validator.nodeID }>
          { truncateId(validator.nodeID, 24) }
        </Text>
      </Box>
      <Box flex={ 1 } textAlign="right">
        <Text fontSize="sm" color="text.primary" fontWeight={ 500 }>
          { formatStake(stake) } LUX
        </Text>
      </Box>
      <Box w="80px" textAlign="right" flexShrink={ 0 }>
        <Text fontSize="sm" color="text.primary">
          { uptime.toFixed(1) }%
        </Text>
      </Box>
      <Box w="40px" flexShrink={ 0 } textAlign="center">
        <Box
          bgColor={ validator.connected ? 'green.400' : 'gray.400' }
          borderRadius="full"
          boxSize="8px"
          display="inline-block"
        />
      </Box>
    </Flex>
  );
};

const ChainDetailPage = () => {
  const router = useRouter();
  const slug = (router.query.slug as string || '').toLowerCase();

  const { blockchains, isLoading: chainsLoading } = useBlockchains();
  const { validators, isLoading: validatorsLoading } = useCurrentValidators();
  const { subnets } = useSubnets();
  const { stats: indexerStats } = useChainIndexerStats(slug);

  const resolvedChain = React.useMemo<{
    blockchain: PChainBlockchain | undefined;
    isPrimary: boolean;
    meta: typeof PRIMARY_CHAIN_META[string] | undefined;
  }>(() => {
    // Check primary chains first
    const primaryMeta = PRIMARY_CHAIN_META[slug];
    if (primaryMeta) {
      return { blockchain: undefined, isPrimary: true, meta: primaryMeta };
    }

    // Check L1 chains
    const chain = blockchains.find((c) =>
      c.name.toLowerCase() === slug ||
      c.id.toLowerCase() === slug,
    );
    return { blockchain: chain, isPrimary: false, meta: undefined };
  }, [ slug, blockchains ]);

  const chainName = resolvedChain.meta?.name ??
    resolvedChain.blockchain?.name ??
    slug;
  const chainDescription = resolvedChain.meta?.description ??
    SUBNET_DESCRIPTIONS[slug] ??
    `${ chainName } is a blockchain on the Lux Network.`;

  const blockchainId = resolvedChain.blockchain?.id ?? '';
  const subnetId = resolvedChain.blockchain?.subnetID ?? (resolvedChain.isPrimary ? PRIMARY_NETWORK_ID : '');
  const vmId = resolvedChain.blockchain?.vmID ?? resolvedChain.meta?.vmId ?? '';
  const vmName = KNOWN_VM_IDS[vmId] ?? (vmId ? truncateId(vmId) : 'Unknown');
  const chainId = SUBNET_CHAIN_IDS[slug];
  const explorerUrl = EXPLORER_URLS[slug];
  const isLoading = chainsLoading || validatorsLoading;

  const subnet = React.useMemo(
    () => subnets.find((s) => s.id === subnetId),
    [ subnets, subnetId ],
  );

  const subnetChains = React.useMemo(
    () => subnetId ? blockchains.filter((c) => c.subnetID === subnetId) : [],
    [ blockchains, subnetId ],
  );

  const totalStake = React.useMemo(
    () => validators.reduce((sum, v) => sum + BigInt(v.stakeAmount || v.weight || '0'), BigInt(0)),
    [ validators ],
  );

  return (
    <>
      <PageTitle
        title={ chainName }
        secondRow={ (
          <Flex align="center" gap={ 2 }>
            <Text fontSize="sm" color="text.secondary">Chain Details</Text>
            { resolvedChain.isPrimary && <Tag size="sm" variant="subtle">Primary Network</Tag> }
            { !resolvedChain.isPrimary && resolvedChain.blockchain && <Tag size="sm" variant="subtle">L1</Tag> }
          </Flex>
        ) }
      />

      <Box
        p={ 4 }
        mb={ 6 }
        border="1px solid"
        borderColor="border.divider"
        borderRadius="lg"
        bgColor={ INFO_ROW_BG }
      >
        <Text fontSize="sm" color="text.secondary" lineHeight="1.6">
          { chainDescription }
        </Text>
      </Box>

      <Grid
        templateColumns={{ base: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
        gap={ 3 }
        mb={ 6 }
      >
        <Box p={ 4 } border="1px solid" borderColor="border.divider" borderRadius="lg" bgColor={ INFO_ROW_BG }>
          <Text fontSize="xs" color="text.secondary" fontWeight={ 600 } textTransform="uppercase" letterSpacing="wider" mb={ 1 }>
            Validators
          </Text>
          <Skeleton loading={ isLoading }>
            <Text fontSize="xl" fontWeight={ 700 } color="text.primary">
              { validators.length }
            </Text>
          </Skeleton>
        </Box>
        <Box p={ 4 } border="1px solid" borderColor="border.divider" borderRadius="lg" bgColor={ INFO_ROW_BG }>
          <Text fontSize="xs" color="text.secondary" fontWeight={ 600 } textTransform="uppercase" letterSpacing="wider" mb={ 1 }>
            Total Stake
          </Text>
          <Skeleton loading={ isLoading }>
            <Text fontSize="xl" fontWeight={ 700 } color="text.primary">
              { formatStake(totalStake) } LUX
            </Text>
          </Skeleton>
        </Box>
        <Box p={ 4 } border="1px solid" borderColor="border.divider" borderRadius="lg" bgColor={ INFO_ROW_BG }>
          <Text fontSize="xs" color="text.secondary" fontWeight={ 600 } textTransform="uppercase" letterSpacing="wider" mb={ 1 }>
            Subnet Chains
          </Text>
          <Skeleton loading={ isLoading }>
            <Text fontSize="xl" fontWeight={ 700 } color="text.primary">
              { subnetChains.length }
            </Text>
          </Skeleton>
        </Box>
        <Box p={ 4 } border="1px solid" borderColor="border.divider" borderRadius="lg" bgColor={ INFO_ROW_BG }>
          <Text fontSize="xs" color="text.secondary" fontWeight={ 600 } textTransform="uppercase" letterSpacing="wider" mb={ 1 }>
            Threshold
          </Text>
          <Skeleton loading={ isLoading }>
            <Text fontSize="xl" fontWeight={ 700 } color="text.primary">
              { subnet?.threshold ?? '-' }
            </Text>
          </Skeleton>
        </Box>
      </Grid>

      <Box mb={ 6 }>
        <Text fontSize="sm" fontWeight={ 600 } color="text.primary" mb={ 3 }>
          Chain Info
        </Text>
        <Box border="1px solid" borderColor="border.divider" borderRadius="lg" overflow="hidden">
          <InfoRow label="Chain Name" value={ chainName }/>
          { blockchainId && <InfoRow label="Blockchain ID" value={ blockchainId } isMono canCopy/> }
          { subnetId && <InfoRow label="Subnet ID" value={ subnetId } isMono canCopy/> }
          <InfoRow label="VM Name" value={ vmName }/>
          { vmId && <InfoRow label="VM ID" value={ vmId } isMono canCopy/> }
          { chainId != null && <InfoRow label="EVM Chain ID" value={ String(chainId) }/> }
          { explorerUrl && <InfoRow label="Explorer" value={ explorerUrl }/> }
          { resolvedChain.isPrimary && <InfoRow label="Network" value="Primary Network"/> }
          { !resolvedChain.isPrimary && <InfoRow label="Network" value="L1 Subnet"/> }
        </Box>
      </Box>

      { indexerStats && (
        <Box mb={ 6 }>
          <Flex align="center" gap={ 2 } mb={ 3 }>
            <Text fontSize="sm" fontWeight={ 600 } color="text.primary">
              Indexer Stats
            </Text>
            { indexerStats.dag_stats && (
              <Tag size="sm" variant="subtle">
                { indexerStats.dag_stats.chain_type.toUpperCase() }
              </Tag>
            ) }
          </Flex>
          <Box border="1px solid" borderColor="border.divider" borderRadius="lg" overflow="hidden">
            { indexerStats.dag_stats && (
              <>
                <InfoRow label="Total Vertices" value={ String(indexerStats.dag_stats.total_vertices) }/>
                <InfoRow label="Total Edges" value={ String(indexerStats.dag_stats.total_edges) }/>
                <InfoRow label="Accepted Vertices" value={ String(indexerStats.dag_stats.accepted_vertices) }/>
                <InfoRow label="Pending Vertices" value={ String(indexerStats.dag_stats.pending_vertices) }/>
                <InfoRow label="Last Updated" value={ indexerStats.dag_stats.last_updated }/>
              </>
            ) }
            { Object.entries(indexerStats.chain_stats).map(([ key, value ]) => (
              <InfoRow
                key={ key }
                label={ key.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') }
                value={ typeof value === 'object' ? JSON.stringify(value) : String(value) }
              />
            )) }
          </Box>
        </Box>
      ) }

      { subnetChains.length > 0 && (
        <Box mb={ 6 }>
          <Flex align="center" gap={ 2 } mb={ 3 }>
            <Text fontSize="sm" fontWeight={ 600 } color="text.primary">
              Chains in Subnet
            </Text>
            <Tag size="sm" variant="subtle">{ subnetChains.length }</Tag>
          </Flex>
          <Box border="1px solid" borderColor="border.divider" borderRadius="lg" overflow="hidden">
            <Flex
              px={ 4 }
              py={ 2 }
              gap={ 4 }
              borderBottom="1px solid"
              borderColor="border.divider"
              display={{ base: 'none', lg: 'flex' }}
            >
              <Box flex={ 1 } color="text.secondary" fontWeight={ 600 } fontSize="xs" textTransform="uppercase" letterSpacing="wider">
                Name
              </Box>
              <Box flex={ 2 } color="text.secondary" fontWeight={ 600 } fontSize="xs" textTransform="uppercase" letterSpacing="wider">
                Blockchain ID
              </Box>
              <Box w="120px" color="text.secondary" fontWeight={ 600 } fontSize="xs" textTransform="uppercase" letterSpacing="wider">
                VM
              </Box>
            </Flex>
            { subnetChains.map((chain) => (
              <Flex
                key={ chain.id }
                px={ 4 }
                py={ 3 }
                gap={ 4 }
                borderBottom="1px solid"
                borderColor="border.divider"
                _last={{ borderBottom: 'none' }}
                _hover={{ bg: { _light: 'gray.50', _dark: 'whiteAlpha.50' } }}
                transition="background 0.15s"
                flexWrap={{ base: 'wrap', lg: 'nowrap' }}
              >
                <Box flex={ 1 }>
                  <Text fontSize="sm" fontWeight={ 500 } color="text.primary">
                    { chain.name }
                  </Text>
                </Box>
                <Box flex={ 2 } minW={ 0 }>
                  <Flex align="center" gap={ 1 }>
                    <Text fontSize="sm" fontFamily="mono" color="text.secondary" title={ chain.id }>
                      { truncateId(chain.id, 24) }
                    </Text>
                    <CopyToClipboard text={ chain.id } size="2xs"/>
                  </Flex>
                </Box>
                <Box w="120px">
                  <Box
                    bgColor={{ _light: 'gray.100', _dark: 'whiteAlpha.100' }}
                    color="text.secondary"
                    borderRadius="sm"
                    px={ 2 }
                    py={ 0.5 }
                    fontSize="xs"
                    fontFamily="mono"
                    display="inline-block"
                  >
                    { KNOWN_VM_IDS[chain.vmID] ?? truncateId(chain.vmID, 12) }
                  </Box>
                </Box>
              </Flex>
            )) }
          </Box>
        </Box>
      ) }

      <Box mb={ 6 }>
        <Flex align="center" gap={ 2 } mb={ 3 }>
          <Text fontSize="sm" fontWeight={ 600 } color="text.primary">
            Validators
          </Text>
          <Skeleton loading={ validatorsLoading }>
            <Tag size="sm" variant="subtle">{ validators.length }</Tag>
          </Skeleton>
        </Flex>
        <Box border="1px solid" borderColor="border.divider" borderRadius="lg" overflow="hidden">
          <Flex
            px={ 4 }
            py={ 2 }
            gap={ 4 }
            borderBottom="1px solid"
            borderColor="border.divider"
            display={{ base: 'none', lg: 'flex' }}
            align="center"
          >
            <Box w="40px" flexShrink={ 0 } color="text.secondary" fontWeight={ 600 } fontSize="xs" textTransform="uppercase" letterSpacing="wider">
              #
            </Box>
            <Box flex={ 2 } color="text.secondary" fontWeight={ 600 } fontSize="xs" textTransform="uppercase" letterSpacing="wider">
              Node ID
            </Box>
            <Box flex={ 1 } textAlign="right" color="text.secondary" fontWeight={ 600 } fontSize="xs" textTransform="uppercase" letterSpacing="wider">
              Stake
            </Box>
            <Box
              w="80px"
              textAlign="right"
              flexShrink={ 0 }
              color="text.secondary"
              fontWeight={ 600 }
              fontSize="xs"
              textTransform="uppercase"
              letterSpacing="wider"
            >
              Uptime
            </Box>
            <Box
              w="40px"
              flexShrink={ 0 }
              textAlign="center"
              color="text.secondary"
              fontWeight={ 600 }
              fontSize="xs"
              textTransform="uppercase"
              letterSpacing="wider"
            >
              { '\u2022' }
            </Box>
          </Flex>

          { validatorsLoading && (
            <Box px={ 4 } py={ 6 }>
              <Skeleton loading h="16px" mb={ 3 }/>
              <Skeleton loading h="16px" mb={ 3 }/>
              <Skeleton loading h="16px" mb={ 3 }/>
              <Skeleton loading h="16px"/>
            </Box>
          ) }

          { !validatorsLoading && validators.length === 0 && (
            <Box px={ 4 } py={ 8 } textAlign="center" color="text.secondary" fontSize="sm">
              No validators found
            </Box>
          ) }

          { !validatorsLoading && validators.map((v, i) => (
            <ValidatorRow key={ v.nodeID } validator={ v } index={ i }/>
          )) }
        </Box>
      </Box>
    </>
  );
};

export default ChainDetailPage;
