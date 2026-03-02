import React from 'react';

import type { AIAttestation, AIChainStats } from 'lib/api/achain';
import { cn } from 'lib/utils/cn';
import { useModels, useAttestations, useProviders, useInferenceResults } from 'lib/api/achain';
import { Skeleton } from '@luxfi/ui/skeleton';
import { Tag } from '@luxfi/ui/tag';
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
  <div className="border border-[var(--color-border-divider)] rounded-lg p-5 bg-gray-50 dark:bg-[rgba(255,255,255,0.04)]">
    <div className="text-xs text-[var(--color-text-secondary)] font-semibold uppercase tracking-wider mb-1">
      { label }
    </div>
    <Skeleton loading={ isLoading }>
      <div className="text-2xl font-bold text-[var(--color-text-primary)]">
        { value }
      </div>
    </Skeleton>
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
  <div
    className="shrink-0 text-[var(--color-text-secondary)] font-semibold text-xs uppercase tracking-wider"
    style={{
      flex: flex ?? undefined,
      width: w,
      minWidth: minW,
      textAlign: textAlign ?? 'left',
      marginLeft: ml,
    }}
  >
    { children }
  </div>
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
    <div className="flex flex-col gap-6">
      { /* Stat cards */ }
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
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
      </div>

      { /* Recent attestations */ }
      <div className="border border-[var(--color-border-divider)] rounded-lg overflow-hidden">
        <div className="px-4 py-3 font-semibold text-sm text-[var(--color-text-primary)] border-b border-[var(--color-border-divider)]">
          Recent Attestations
        </div>

        { /* Header */ }
        <div className="hidden lg:flex px-4 py-2 gap-4 border-b border-[var(--color-border-divider)]">
          <TableHeaderCell minW="80px">ID</TableHeaderCell>
          <TableHeaderCell minW="100px">Type</TableHeaderCell>
          <TableHeaderCell flex={ 1 }>Provider</TableHeaderCell>
          <TableHeaderCell minW="100px">Block</TableHeaderCell>
          <TableHeaderCell minW="160px">Time</TableHeaderCell>
          <TableHeaderCell minW="100px" textAlign="right">Status</TableHeaderCell>
        </div>

        { /* Rows */ }
        { isLoading && (
          <div className="px-4 py-6">
            <Skeleton loading={ true } h="16px" mb={ 3 }/>
            <Skeleton loading={ true } h="16px" mb={ 3 }/>
            <Skeleton loading={ true } h="16px"/>
          </div>
        ) }

        { !isLoading && recentAttestations.map((att) => (
          <div key={ att.id } className="flex flex-wrap lg:flex-nowrap px-4 py-3 gap-4 border-b border-[var(--color-border-divider)] items-center hover:bg-gray-50 dark:hover:bg-[rgba(255,255,255,0.04)] transition-[background] duration-150">
            <div className="min-w-[80px] shrink-0 font-mono text-sm text-[var(--color-text-primary)]">
              { att.id }
            </div>
            <div className="min-w-[100px] shrink-0">
              <Tag size="sm">{ attestationTypeLabel(att.type) }</Tag>
            </div>
            <div className="flex-1 font-mono text-sm text-[var(--color-text-secondary)]" title={ att.provider }>
              { truncateAddress(att.provider) }
            </div>
            <div className="min-w-[100px] shrink-0 text-sm text-[var(--color-text-secondary)]">
              { att.blockHeight.toLocaleString() }
            </div>
            <div className="min-w-[160px] shrink-0 text-sm text-[var(--color-text-secondary)]">
              { formatTimestamp(att.timestamp) }
            </div>
            <div className="min-w-[100px] shrink-0 text-left lg:text-right">
              <Tag size="sm" className={ attestationStatusClassName(att.status) }>
                { att.status }
              </Tag>
            </div>
          </div>
        )) }
      </div>
    </div>
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
    <div className="border border-[var(--color-border-divider)] rounded-lg overflow-hidden">
      { /* Header */ }
      <div className="hidden lg:flex px-4 py-2 gap-4 border-b border-[var(--color-border-divider)]">
        <TableHeaderCell minW="180px">Name</TableHeaderCell>
        <TableHeaderCell minW="80px">Version</TableHeaderCell>
        <TableHeaderCell minW="100px">Framework</TableHeaderCell>
        <TableHeaderCell minW="100px" textAlign="right">Parameters</TableHeaderCell>
        <TableHeaderCell flex={ 1 }>Provider</TableHeaderCell>
        <TableHeaderCell minW="120px" textAlign="right">Registered</TableHeaderCell>
      </div>

      { /* Rows */ }
      { isLoading && (
        <div className="px-4 py-6">
          <Skeleton loading={ true } h="16px" mb={ 3 }/>
          <Skeleton loading={ true } h="16px" mb={ 3 }/>
          <Skeleton loading={ true } h="16px"/>
        </div>
      ) }

      { !isLoading && models.length === 0 && (
        <div className="px-4 py-8 text-center text-[var(--color-text-secondary)] text-sm">
          No models registered
        </div>
      ) }

      { !isLoading && models.map((model) => (
        <div key={ model.id } className="flex flex-wrap lg:flex-nowrap px-4 py-3 gap-4 border-b border-[var(--color-border-divider)] items-center hover:bg-gray-50 dark:hover:bg-[rgba(255,255,255,0.04)] transition-[background] duration-150">
          <div className="min-w-[180px] shrink-0">
            <div className="text-sm font-semibold text-[var(--color-text-primary)]">{ model.name }</div>
            <div className="text-xs font-mono text-[var(--color-text-secondary)]" title={ model.modelHash }>
              { truncateHash(model.modelHash) }
            </div>
          </div>
          <div className="min-w-[80px] shrink-0">
            <Tag size="sm">v{ model.version }</Tag>
          </div>
          <div className="min-w-[100px] shrink-0 text-sm text-[var(--color-text-secondary)]">
            { model.framework }
          </div>
          <div className="min-w-[100px] shrink-0 text-sm text-[var(--color-text-primary)] text-left lg:text-right">
            { formatParameters(model.parameters) }
          </div>
          <div className="flex-1 font-mono text-sm text-[var(--color-text-secondary)]" title={ model.provider }>
            { truncateAddress(model.provider) }
          </div>
          <div className="min-w-[120px] shrink-0 text-sm text-[var(--color-text-secondary)] text-left lg:text-right">
            { formatDate(model.registeredAt) }
          </div>
        </div>
      )) }
    </div>
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
    <div className="border border-[var(--color-border-divider)] rounded-lg overflow-hidden">
      { /* Header */ }
      <div className="hidden lg:flex px-4 py-2 gap-4 border-b border-[var(--color-border-divider)]">
        <TableHeaderCell flex={ 1 }>Address</TableHeaderCell>
        <TableHeaderCell minW="100px" textAlign="right">Reputation</TableHeaderCell>
        <TableHeaderCell minW="100px" textAlign="right">Capacity</TableHeaderCell>
        <TableHeaderCell minW="100px" textAlign="right">Total Jobs</TableHeaderCell>
        <TableHeaderCell minW="140px" textAlign="right">Earnings</TableHeaderCell>
        <TableHeaderCell minW="80px" textAlign="right">Status</TableHeaderCell>
      </div>

      { /* Rows */ }
      { isLoading && (
        <div className="px-4 py-6">
          <Skeleton loading={ true } h="16px" mb={ 3 }/>
          <Skeleton loading={ true } h="16px" mb={ 3 }/>
          <Skeleton loading={ true } h="16px"/>
        </div>
      ) }

      { !isLoading && providers.length === 0 && (
        <div className="px-4 py-8 text-center text-[var(--color-text-secondary)] text-sm">
          No compute providers found
        </div>
      ) }

      { !isLoading && providers.map((provider) => (
        <div key={ provider.address } className="flex flex-wrap lg:flex-nowrap px-4 py-3 gap-4 border-b border-[var(--color-border-divider)] items-center hover:bg-gray-50 dark:hover:bg-[rgba(255,255,255,0.04)] transition-[background] duration-150">
          <div className="flex-1 font-mono text-sm text-[var(--color-text-primary)]" title={ provider.address }>
            { truncateAddress(provider.address) }
          </div>
          <div className="min-w-[100px] shrink-0 text-sm text-[var(--color-text-primary)] text-left lg:text-right">
            { provider.reputation }%
          </div>
          <div className="min-w-[100px] shrink-0 text-sm text-[var(--color-text-secondary)] text-left lg:text-right">
            { provider.capacity } GPUs
          </div>
          <div className="min-w-[100px] shrink-0 text-sm text-[var(--color-text-secondary)] text-left lg:text-right">
            { provider.totalJobs.toLocaleString() }
          </div>
          <div className="min-w-[140px] shrink-0 text-sm text-[var(--color-text-primary)] text-left lg:text-right">
            { formatEarnings(provider.totalEarnings) }
          </div>
          <div className="min-w-[80px] shrink-0 text-left lg:text-right">
            <Tag size="sm" className={ provider.isActive ? 'bg-badge-green-bg text-badge-green-fg' : undefined }>
              { provider.isActive ? 'Active' : 'Offline' }
            </Tag>
          </div>
        </div>
      )) }
    </div>
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
  <div className="border border-[var(--color-border-divider)] rounded-lg overflow-hidden">
    { /* Header */ }
    <div className="hidden lg:flex px-4 py-2 gap-4 border-b border-[var(--color-border-divider)]">
      <TableHeaderCell minW="80px">ID</TableHeaderCell>
      <TableHeaderCell minW="100px">Type</TableHeaderCell>
      <TableHeaderCell flex={ 1 }>Provider</TableHeaderCell>
      <TableHeaderCell flex={ 1 }>Model Hash</TableHeaderCell>
      <TableHeaderCell minW="160px">Timestamp</TableHeaderCell>
      <TableHeaderCell minW="100px" textAlign="right">Status</TableHeaderCell>
    </div>

    { /* Rows */ }
    { isLoading && (
      <div className="px-4 py-6">
        <Skeleton loading={ true } h="16px" mb={ 3 }/>
        <Skeleton loading={ true } h="16px" mb={ 3 }/>
        <Skeleton loading={ true } h="16px"/>
      </div>
    ) }

    { !isLoading && attestations.length === 0 && (
      <div className="px-4 py-8 text-center text-[var(--color-text-secondary)] text-sm">
        No attestations found
      </div>
    ) }

    { !isLoading && attestations.map((att) => (
      <div key={ att.id } className="flex flex-wrap lg:flex-nowrap px-4 py-3 gap-4 border-b border-[var(--color-border-divider)] items-center hover:bg-gray-50 dark:hover:bg-[rgba(255,255,255,0.04)] transition-[background] duration-150">
        <div className="min-w-[80px] shrink-0 font-mono text-sm text-[var(--color-text-primary)]">
          { att.id }
        </div>
        <div className="min-w-[100px] shrink-0">
          <Tag size="sm">{ attestationTypeLabel(att.type) }</Tag>
        </div>
        <div className="flex-1 font-mono text-sm text-[var(--color-text-secondary)]" title={ att.provider }>
          { truncateAddress(att.provider) }
        </div>
        <div className="flex-1 font-mono text-sm text-[var(--color-text-secondary)]" title={ att.modelHash }>
          { truncateHash(att.modelHash) }
        </div>
        <div className="min-w-[160px] shrink-0 text-sm text-[var(--color-text-secondary)]">
          { formatTimestamp(att.timestamp) }
        </div>
        <div className="min-w-[100px] shrink-0 text-left lg:text-right">
          <Tag size="sm" className={ attestationStatusClassName(att.status) }>
            { att.status }
          </Tag>
        </div>
      </div>
    )) }
  </div>
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
          <div className="text-sm text-[var(--color-text-secondary)]">
            A-Chain AI models, compute providers, and attestations
          </div>
        ) }
      />

      { /* Tabs */ }
      <div className="flex border-b border-[var(--color-border-divider)] mb-6 gap-0">
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
      </div>

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
