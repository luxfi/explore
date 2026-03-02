import React from 'react';

import config from 'configs/app';
import { useCurrentValidators } from 'lib/api/pchain';
import { cn } from 'lib/utils/cn';
import PageTitle from 'ui/shared/Page/PageTitle';

import DelegatorsList from './DelegatorsList';
import ValidatorsDashboard from './ValidatorsDashboard';
import ValidatorsList from './ValidatorsList';

// ---------------------------------------------------------------------------
// Tab definitions
// ---------------------------------------------------------------------------

const TABS = {
  dashboard: 'dashboard',
  validators: 'validators',
  delegators: 'delegators',
} as const;

type TabId = typeof TABS[keyof typeof TABS];

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
      'px-4 py-2 text-sm border-b-2 bg-transparent cursor-pointer transition-all hover:text-[var(--color-text-primary)]',
      isActive ? 'font-semibold text-[var(--color-text-primary)] border-[var(--color-text-primary)]' : 'font-normal text-[var(--color-text-secondary)] border-transparent',
    ) }
    onClick={ onClick }
  >
    { label }
  </button>
);

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

const ValidatorsPage = () => {
  const [ activeTab, setActiveTab ] = React.useState<TabId>(TABS.dashboard);
  const { validators, stats, isLoading } = useCurrentValidators();

  const handleDashboardClick = React.useCallback(() => {
    setActiveTab(TABS.dashboard);
  }, []);

  const handleValidatorsClick = React.useCallback(() => {
    setActiveTab(TABS.validators);
  }, []);

  const handleDelegatorsClick = React.useCallback(() => {
    setActiveTab(TABS.delegators);
  }, []);

  return (
    <>
      <PageTitle
        title="Validators"
        secondRow={ (
          <div>
            P-Chain validators securing { config.chain.name || 'the network' }
          </div>
        ) }
      />

      { /* Tabs */ }
      <div className="flex"
      >
        <TabButton
          label="Dashboard"
          isActive={ activeTab === TABS.dashboard }
          onClick={ handleDashboardClick }
        />
        <TabButton
          label={ `Validators (${ stats.validatorCount })` }
          isActive={ activeTab === TABS.validators }
          onClick={ handleValidatorsClick }
        />
        <TabButton
          label={ `Delegators (${ stats.delegatorCount })` }
          isActive={ activeTab === TABS.delegators }
          onClick={ handleDelegatorsClick }
        />
      </div>

      { /* Tab content */ }
      { activeTab === TABS.dashboard && (
        <ValidatorsDashboard
          validators={ validators }
          stats={ stats }
          isLoading={ isLoading }
        />
      ) }

      { activeTab === TABS.validators && (
        <ValidatorsList
          validators={ validators }
          isLoading={ isLoading }
        />
      ) }

      { activeTab === TABS.delegators && (
        <DelegatorsList
          validators={ validators }
          isLoading={ isLoading }
        />
      ) }
    </>
  );
};

export default ValidatorsPage;
