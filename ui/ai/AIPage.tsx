import { Box, Flex, Grid } from '@chakra-ui/react';
import React from 'react';

import type { AIAttestation, AIChainStats } from 'lib/api/achain';
import { useModels, useAttestations, useProviders, useInferenceResults } from 'lib/api/achain';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tag } from 'toolkit/chakra/tag';
import PageTitle from 'ui/shared/Page/PageTitle';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TABS = {
  dashboard: 'dashboard',
  models: 'models',
  providers: 'providers',
  attestations: 'attestations',
} as const;

type TabId = typeof TABS[keyof typeof TABS];

const RECENT_ATTESTATIONS_COUNT = 5;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function truncateHash(hash: string): string {
  if (hash.length <= 14) {
    return hash;
  }
  return `${ hash.slice(0, 8) }...${ hash.slice(-4) }`;
}

function truncateAddress(address: string): string {
  if (address.length <= 14) {
    return address;
  }
  return `${ address.slice(0, 8) }...${ address.slice(-4) }`;
}

function formatParameters(params: number): string {
  if (params >= 1_000_000_000_000) {
    return `${ (params / 1_000_000_000_000).toFixed(1) }T`;
  }
  if (params >= 1_000_000_000) {
    return `${ (params / 1_000_000_000).toFixed(1) }B`;
  }
  if (params >= 1_000_000) {
    return `${ (params / 1_000_000).toFixed(1) }M`;
  }
  return params.toLocaleString();
}

function formatEarnings(weiStr: string): string {
  const wei = BigInt(weiStr);
  const ether = Number(wei) / 1e18;
  return `${ ether.toFixed(2) } LUX`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// ---------------------------------------------------------------------------
// Stat card
// ---------------------------------------------------------------------------

interface StatCardProps {
  readonly label: string;
  readonly value: string;
  readonly isLoading: boolean;
}

const StatCard = ({ label, value, isLoading }: StatCardProps) => (
  <Box
    border="1px solid"
    borderColor="border.divider"
    borderRadius="lg"
    p={ 5 }
    bgColor={{ _light: 'gray.50', _dark: 'whiteAlpha.50' }}
  >
    <Box fontSize="xs" color="text.secondary" fontWeight="600" textTransform="uppercase" letterSpacing="wider" mb={ 1 }>
      { label }
    </Box>
    <Skeleton loading={ isLoading }>
      <Box fontSize="2xl" fontWeight="700" color="text.primary">
        { value }
      </Box>
    </Skeleton>
  </Box>
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
// Attestation status tag
// ---------------------------------------------------------------------------

function attestationStatusClassName(status: AIAttestation['status']): string {
  switch (status) {
    case 'verified': return 'bg-badge-green-bg text-badge-green-fg';
    case 'pending': return 'bg-badge-yellow-bg text-badge-yellow-fg';
    case 'rejected': return 'bg-badge-red-bg text-badge-red-fg';
  }
}

function attestationTypeLabel(type: AIAttestation['type']): string {
  switch (type) {
    case 'compute': return 'Compute';
    case 'training': return 'Training';
    case 'inference': return 'Inference';
  }
}

// ---------------------------------------------------------------------------
// Table header component
// ---------------------------------------------------------------------------

interface TableHeaderCellProps {
  readonly children: React.ReactNode;
  readonly flex?: number;
  readonly w?: string;
  readonly minW?: string;
  readonly textAlign?: 'left' | 'right' | 'center';
  readonly ml?: string;
}

const TableHeaderCell = ({ children, flex, w, minW, textAlign, ml }: TableHeaderCellProps) => (
  <Box
    flex={ flex }
    w={ w }
    minW={ minW }
    flexShrink={ 0 }
    color="text.secondary"
    fontWeight="600"
    fontSize="xs"
    textTransform="uppercase"
    letterSpacing="wider"
    textAlign={ textAlign }
    ml={ ml }
  >
    { children }
  </Box>
);

// ---------------------------------------------------------------------------
// Dashboard tab
// ---------------------------------------------------------------------------

interface DashboardTabProps {
  readonly stats: AIChainStats;
  readonly attestations: ReadonlyArray<AIAttestation>;
  readonly isLoading: boolean;
}

const DashboardTab = ({ stats, attestations, isLoading }: DashboardTabProps) => {
  const recentAttestations = React.useMemo(
    () => attestations.slice(0, RECENT_ATTESTATIONS_COUNT),
    [ attestations ],
  );

  return (
    <Flex direction="column" gap={ 6 }>
      { /* Stat cards */ }
      <Grid
        gridTemplateColumns={{ base: '1fr 1fr', lg: 'repeat(4, 1fr)' }}
        gap={ 3 }
      >
        <StatCard
          label="Total Models"
          value={ stats.totalModels.toLocaleString() }
          isLoading={ isLoading }
        />
        <StatCard
          label="Active Providers"
          value={ stats.activeProviders.toLocaleString() }
          isLoading={ isLoading }
        />
        <StatCard
          label="Total Attestations"
          value={ stats.totalAttestations.toLocaleString() }
          isLoading={ isLoading }
        />
        <StatCard
          label="Avg Latency"
          value={ `${ stats.avgLatencyMs }ms` }
          isLoading={ isLoading }
        />
      </Grid>

      { /* Recent attestations */ }
      <Box
        border="1px solid"
        borderColor="border.divider"
        borderRadius="lg"
        overflow="hidden"
      >
        <Box px={ 4 } py={ 3 } fontWeight="600" fontSize="sm" color="text.primary" borderBottom="1px solid" borderColor="border.divider">
          Recent Attestations
        </Box>

        { /* Header */ }
        <Flex
          px={ 4 }
          py={ 2 }
          gap={ 4 }
          borderBottom="1px solid"
          borderColor="border.divider"
          display={{ base: 'none', lg: 'flex' }}
        >
          <TableHeaderCell minW="80px">ID</TableHeaderCell>
          <TableHeaderCell minW="100px">Type</TableHeaderCell>
          <TableHeaderCell flex={ 1 }>Provider</TableHeaderCell>
          <TableHeaderCell minW="100px">Block</TableHeaderCell>
          <TableHeaderCell minW="160px">Time</TableHeaderCell>
          <TableHeaderCell minW="100px" textAlign="right">Status</TableHeaderCell>
        </Flex>

        { /* Rows */ }
        { isLoading && (
          <Box px={ 4 } py={ 6 }>
            <Skeleton loading={ true } h="16px" mb={ 3 }/>
            <Skeleton loading={ true } h="16px" mb={ 3 }/>
            <Skeleton loading={ true } h="16px"/>
          </Box>
        ) }

        { !isLoading && recentAttestations.map((att) => (
          <Flex
            key={ att.id }
            px={ 4 }
            py={ 3 }
            gap={ 4 }
            borderBottom="1px solid"
            borderColor="border.divider"
            alignItems="center"
            _hover={{ bg: { _light: 'gray.50', _dark: 'whiteAlpha.50' } }}
            transition="background 0.15s"
            flexWrap={{ base: 'wrap', lg: 'nowrap' }}
          >
            <Box minW="80px" flexShrink={ 0 } fontFamily="mono" fontSize="sm" color="text.primary">
              { att.id }
            </Box>
            <Box minW="100px" flexShrink={ 0 }>
              <Tag size="sm">{ attestationTypeLabel(att.type) }</Tag>
            </Box>
            <Box flex={ 1 } fontFamily="mono" fontSize="sm" color="text.secondary" title={ att.provider }>
              { truncateAddress(att.provider) }
            </Box>
            <Box minW="100px" flexShrink={ 0 } fontSize="sm" color="text.secondary">
              { att.blockHeight.toLocaleString() }
            </Box>
            <Box minW="160px" flexShrink={ 0 } fontSize="sm" color="text.secondary">
              { formatTimestamp(att.timestamp) }
            </Box>
            <Box minW="100px" flexShrink={ 0 } textAlign={{ base: 'left', lg: 'right' }}>
              <Tag size="sm" className={ attestationStatusClassName(att.status) }>
                { att.status }
              </Tag>
            </Box>
          </Flex>
        )) }
      </Box>
    </Flex>
  );
};

// ---------------------------------------------------------------------------
// Models tab
// ---------------------------------------------------------------------------

interface ModelsTabProps {
  readonly isLoading: boolean;
}

const ModelsTab = ({ isLoading }: ModelsTabProps) => {
  const { models } = useModels();

  return (
    <Box
      border="1px solid"
      borderColor="border.divider"
      borderRadius="lg"
      overflow="hidden"
    >
      { /* Header */ }
      <Flex
        px={ 4 }
        py={ 2 }
        gap={ 4 }
        borderBottom="1px solid"
        borderColor="border.divider"
        display={{ base: 'none', lg: 'flex' }}
      >
        <TableHeaderCell minW="180px">Name</TableHeaderCell>
        <TableHeaderCell minW="80px">Version</TableHeaderCell>
        <TableHeaderCell minW="100px">Framework</TableHeaderCell>
        <TableHeaderCell minW="100px" textAlign="right">Parameters</TableHeaderCell>
        <TableHeaderCell flex={ 1 }>Provider</TableHeaderCell>
        <TableHeaderCell minW="120px" textAlign="right">Registered</TableHeaderCell>
      </Flex>

      { /* Rows */ }
      { isLoading && (
        <Box px={ 4 } py={ 6 }>
          <Skeleton loading={ true } h="16px" mb={ 3 }/>
          <Skeleton loading={ true } h="16px" mb={ 3 }/>
          <Skeleton loading={ true } h="16px"/>
        </Box>
      ) }

      { !isLoading && models.length === 0 && (
        <Box px={ 4 } py={ 8 } textAlign="center" color="text.secondary" fontSize="sm">
          No models registered
        </Box>
      ) }

      { !isLoading && models.map((model) => (
        <Flex
          key={ model.id }
          px={ 4 }
          py={ 3 }
          gap={ 4 }
          borderBottom="1px solid"
          borderColor="border.divider"
          alignItems="center"
          _hover={{ bg: { _light: 'gray.50', _dark: 'whiteAlpha.50' } }}
          transition="background 0.15s"
          flexWrap={{ base: 'wrap', lg: 'nowrap' }}
        >
          <Box minW="180px" flexShrink={ 0 }>
            <Box fontSize="sm" fontWeight="600" color="text.primary">{ model.name }</Box>
            <Box fontSize="xs" fontFamily="mono" color="text.secondary" title={ model.modelHash }>
              { truncateHash(model.modelHash) }
            </Box>
          </Box>
          <Box minW="80px" flexShrink={ 0 }>
            <Tag size="sm">v{ model.version }</Tag>
          </Box>
          <Box minW="100px" flexShrink={ 0 } fontSize="sm" color="text.secondary">
            { model.framework }
          </Box>
          <Box minW="100px" flexShrink={ 0 } fontSize="sm" color="text.primary" textAlign={{ base: 'left', lg: 'right' }}>
            { formatParameters(model.parameters) }
          </Box>
          <Box flex={ 1 } fontFamily="mono" fontSize="sm" color="text.secondary" title={ model.provider }>
            { truncateAddress(model.provider) }
          </Box>
          <Box minW="120px" flexShrink={ 0 } fontSize="sm" color="text.secondary" textAlign={{ base: 'left', lg: 'right' }}>
            { formatDate(model.registeredAt) }
          </Box>
        </Flex>
      )) }
    </Box>
  );
};

// ---------------------------------------------------------------------------
// Providers tab
// ---------------------------------------------------------------------------

interface ProvidersTabProps {
  readonly isLoading: boolean;
}

const ProvidersTab = ({ isLoading }: ProvidersTabProps) => {
  const { providers } = useProviders();

  return (
    <Box
      border="1px solid"
      borderColor="border.divider"
      borderRadius="lg"
      overflow="hidden"
    >
      { /* Header */ }
      <Flex
        px={ 4 }
        py={ 2 }
        gap={ 4 }
        borderBottom="1px solid"
        borderColor="border.divider"
        display={{ base: 'none', lg: 'flex' }}
      >
        <TableHeaderCell flex={ 1 }>Address</TableHeaderCell>
        <TableHeaderCell minW="100px" textAlign="right">Reputation</TableHeaderCell>
        <TableHeaderCell minW="100px" textAlign="right">Capacity</TableHeaderCell>
        <TableHeaderCell minW="100px" textAlign="right">Total Jobs</TableHeaderCell>
        <TableHeaderCell minW="140px" textAlign="right">Earnings</TableHeaderCell>
        <TableHeaderCell minW="80px" textAlign="right">Status</TableHeaderCell>
      </Flex>

      { /* Rows */ }
      { isLoading && (
        <Box px={ 4 } py={ 6 }>
          <Skeleton loading={ true } h="16px" mb={ 3 }/>
          <Skeleton loading={ true } h="16px" mb={ 3 }/>
          <Skeleton loading={ true } h="16px"/>
        </Box>
      ) }

      { !isLoading && providers.length === 0 && (
        <Box px={ 4 } py={ 8 } textAlign="center" color="text.secondary" fontSize="sm">
          No compute providers found
        </Box>
      ) }

      { !isLoading && providers.map((provider) => (
        <Flex
          key={ provider.address }
          px={ 4 }
          py={ 3 }
          gap={ 4 }
          borderBottom="1px solid"
          borderColor="border.divider"
          alignItems="center"
          _hover={{ bg: { _light: 'gray.50', _dark: 'whiteAlpha.50' } }}
          transition="background 0.15s"
          flexWrap={{ base: 'wrap', lg: 'nowrap' }}
        >
          <Box flex={ 1 } fontFamily="mono" fontSize="sm" color="text.primary" title={ provider.address }>
            { truncateAddress(provider.address) }
          </Box>
          <Box minW="100px" flexShrink={ 0 } fontSize="sm" color="text.primary" textAlign={{ base: 'left', lg: 'right' }}>
            { provider.reputation }%
          </Box>
          <Box minW="100px" flexShrink={ 0 } fontSize="sm" color="text.secondary" textAlign={{ base: 'left', lg: 'right' }}>
            { provider.capacity } GPUs
          </Box>
          <Box minW="100px" flexShrink={ 0 } fontSize="sm" color="text.secondary" textAlign={{ base: 'left', lg: 'right' }}>
            { provider.totalJobs.toLocaleString() }
          </Box>
          <Box minW="140px" flexShrink={ 0 } fontSize="sm" color="text.primary" textAlign={{ base: 'left', lg: 'right' }}>
            { formatEarnings(provider.totalEarnings) }
          </Box>
          <Box minW="80px" flexShrink={ 0 } textAlign={{ base: 'left', lg: 'right' }}>
            <Tag size="sm" className={ provider.isActive ? 'bg-badge-green-bg text-badge-green-fg' : undefined }>
              { provider.isActive ? 'Active' : 'Offline' }
            </Tag>
          </Box>
        </Flex>
      )) }
    </Box>
  );
};

// ---------------------------------------------------------------------------
// Attestations tab
// ---------------------------------------------------------------------------

interface AttestationsTabProps {
  readonly attestations: ReadonlyArray<AIAttestation>;
  readonly isLoading: boolean;
}

const AttestationsTab = ({ attestations, isLoading }: AttestationsTabProps) => (
  <Box
    border="1px solid"
    borderColor="border.divider"
    borderRadius="lg"
    overflow="hidden"
  >
    { /* Header */ }
    <Flex
      px={ 4 }
      py={ 2 }
      gap={ 4 }
      borderBottom="1px solid"
      borderColor="border.divider"
      display={{ base: 'none', lg: 'flex' }}
    >
      <TableHeaderCell minW="80px">ID</TableHeaderCell>
      <TableHeaderCell minW="100px">Type</TableHeaderCell>
      <TableHeaderCell flex={ 1 }>Provider</TableHeaderCell>
      <TableHeaderCell flex={ 1 }>Model Hash</TableHeaderCell>
      <TableHeaderCell minW="160px">Timestamp</TableHeaderCell>
      <TableHeaderCell minW="100px" textAlign="right">Status</TableHeaderCell>
    </Flex>

    { /* Rows */ }
    { isLoading && (
      <Box px={ 4 } py={ 6 }>
        <Skeleton loading={ true } h="16px" mb={ 3 }/>
        <Skeleton loading={ true } h="16px" mb={ 3 }/>
        <Skeleton loading={ true } h="16px"/>
      </Box>
    ) }

    { !isLoading && attestations.length === 0 && (
      <Box px={ 4 } py={ 8 } textAlign="center" color="text.secondary" fontSize="sm">
        No attestations found
      </Box>
    ) }

    { !isLoading && attestations.map((att) => (
      <Flex
        key={ att.id }
        px={ 4 }
        py={ 3 }
        gap={ 4 }
        borderBottom="1px solid"
        borderColor="border.divider"
        alignItems="center"
        _hover={{ bg: { _light: 'gray.50', _dark: 'whiteAlpha.50' } }}
        transition="background 0.15s"
        flexWrap={{ base: 'wrap', lg: 'nowrap' }}
      >
        <Box minW="80px" flexShrink={ 0 } fontFamily="mono" fontSize="sm" color="text.primary">
          { att.id }
        </Box>
        <Box minW="100px" flexShrink={ 0 }>
          <Tag size="sm">{ attestationTypeLabel(att.type) }</Tag>
        </Box>
        <Box flex={ 1 } fontFamily="mono" fontSize="sm" color="text.secondary" title={ att.provider }>
          { truncateAddress(att.provider) }
        </Box>
        <Box flex={ 1 } fontFamily="mono" fontSize="sm" color="text.secondary" title={ att.modelHash }>
          { truncateHash(att.modelHash) }
        </Box>
        <Box minW="160px" flexShrink={ 0 } fontSize="sm" color="text.secondary">
          { formatTimestamp(att.timestamp) }
        </Box>
        <Box minW="100px" flexShrink={ 0 } textAlign={{ base: 'left', lg: 'right' }}>
          <Tag size="sm" className={ attestationStatusClassName(att.status) }>
            { att.status }
          </Tag>
        </Box>
      </Flex>
    )) }
  </Box>
);

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

const AIPage = () => {
  const [ activeTab, setActiveTab ] = React.useState<TabId>(TABS.dashboard);
  const { models, isLoading: modelsLoading } = useModels();
  const { attestations, isLoading: attestationsLoading } = useAttestations();
  const { providers, isLoading: providersLoading } = useProviders();
  const { results, isLoading: inferenceLoading } = useInferenceResults();

  const isLoading = modelsLoading || attestationsLoading || providersLoading || inferenceLoading;

  const stats = React.useMemo<AIChainStats>(() => {
    const activeProviderCount = providers.filter((p) => p.isActive).length;
    const totalLatency = results.reduce((sum, r) => sum + r.latencyMs, 0);
    const avgLatency = results.length > 0 ? Math.round(totalLatency / results.length) : 0;

    return {
      totalModels: models.length,
      activeProviders: activeProviderCount,
      totalAttestations: attestations.length,
      avgLatencyMs: avgLatency,
    };
  }, [ models, attestations, providers, results ]);

  const handleDashboardClick = React.useCallback(() => {
    setActiveTab(TABS.dashboard);
  }, []);

  const handleModelsClick = React.useCallback(() => {
    setActiveTab(TABS.models);
  }, []);

  const handleProvidersClick = React.useCallback(() => {
    setActiveTab(TABS.providers);
  }, []);

  const handleAttestationsClick = React.useCallback(() => {
    setActiveTab(TABS.attestations);
  }, []);

  return (
    <>
      <PageTitle
        title="AI Compute"
        secondRow={ (
          <Box fontSize="sm" color="text.secondary">
            A-Chain AI models, compute providers, and attestations
          </Box>
        ) }
      />

      { /* Tabs */ }
      <Flex
        borderBottom="1px solid"
        borderColor="border.divider"
        mb={ 6 }
        gap={ 0 }
      >
        <TabButton
          label="Dashboard"
          isActive={ activeTab === TABS.dashboard }
          onClick={ handleDashboardClick }
        />
        <TabButton
          label={ `Models (${ models.length })` }
          isActive={ activeTab === TABS.models }
          onClick={ handleModelsClick }
        />
        <TabButton
          label={ `Providers (${ providers.length })` }
          isActive={ activeTab === TABS.providers }
          onClick={ handleProvidersClick }
        />
        <TabButton
          label={ `Attestations (${ attestations.length })` }
          isActive={ activeTab === TABS.attestations }
          onClick={ handleAttestationsClick }
        />
      </Flex>

      { /* Tab content */ }
      { activeTab === TABS.dashboard && (
        <DashboardTab
          stats={ stats }
          attestations={ attestations }
          isLoading={ isLoading }
        />
      ) }

      { activeTab === TABS.models && (
        <ModelsTab isLoading={ modelsLoading }/>
      ) }

      { activeTab === TABS.providers && (
        <ProvidersTab isLoading={ providersLoading }/>
      ) }

      { activeTab === TABS.attestations && (
        <AttestationsTab
          attestations={ attestations }
          isLoading={ attestationsLoading }
        />
      ) }
    </>
  );
};

export default AIPage;
