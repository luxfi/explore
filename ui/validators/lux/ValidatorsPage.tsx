import { Box, Flex } from '@chakra-ui/react';
import React from 'react';

import { useCurrentValidators } from 'lib/api/pchain';
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
          <Box fontSize="sm" color="text.secondary">
            P-Chain validators securing the Lux Network
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
          label={ `Validators (${ stats.validatorCount })` }
          isActive={ activeTab === TABS.validators }
          onClick={ handleValidatorsClick }
        />
        <TabButton
          label={ `Delegators (${ stats.delegatorCount })` }
          isActive={ activeTab === TABS.delegators }
          onClick={ handleDelegatorsClick }
        />
      </Flex>

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
