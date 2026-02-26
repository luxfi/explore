// Chain detail page — shows chain info, validators, and subnet details.
// Modeled after Avalanche's L1 Details page.

import { Box, Flex, Grid, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import { useBlockchains, useCurrentValidators, useSubnets } from 'lib/api/pchain';
import type { PChainBlockchain, PChainValidator } from 'lib/api/pchain';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tag } from 'toolkit/chakra/tag';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import PageTitle from 'ui/shared/Page/PageTitle';

// ── Constants ──

const PRIMARY_NETWORK_ID = '11111111111111111111111111111111LpoYY';
const LUX_DECIMALS = 9;

const INFO_ROW_BG = { _light: 'gray.50', _dark: 'whiteAlpha.50' };

// Primary chain metadata that can be resolved from slug
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

// ── Helpers ──

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

// ── Info row ──

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

// ── Validator row ──

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

// ── Main component ──

const ChainDetailPage = () => {
  const router = useRouter();
  const slug = (router.query.slug as string || '').toLowerCase();

  const { blockchains, isLoading: chainsLoading } = useBlockchains();
  const { validators, isLoading: validatorsLoading } = useCurrentValidators();
  const { subnets } = useSubnets();

  // Resolve chain from slug
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

  // Get subnet info
  const subnet = React.useMemo(
    () => subnets.find((s) => s.id === subnetId),
    [ subnets, subnetId ],
  );

  // Get chains in same subnet
  const subnetChains = React.useMemo(
    () => subnetId ? blockchains.filter((c) => c.subnetID === subnetId) : [],
    [ blockchains, subnetId ],
  );

  // Total stake
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

      { /* Description */ }
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

      { /* Stats bar */ }
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

      { /* Chain Info table */ }
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

      { /* Subnet Chains table */ }
      { subnetChains.length > 0 && (
        <Box mb={ 6 }>
          <Flex align="center" gap={ 2 } mb={ 3 }>
            <Text fontSize="sm" fontWeight={ 600 } color="text.primary">
              Chains in Subnet
            </Text>
            <Tag size="sm" variant="subtle">{ subnetChains.length }</Tag>
          </Flex>
          <Box border="1px solid" borderColor="border.divider" borderRadius="lg" overflow="hidden">
            { /* Table header */ }
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

      { /* Validators table */ }
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
          { /* Table header */ }
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
