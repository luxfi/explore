import React from 'react';

import config from 'configs/app';
import useEtherscanRedirects from 'lib/router/useEtherscanRedirects';
import PageTitle from 'ui/shared/Page/PageTitle';
import NetworkStats from 'ui/stats/lux/NetworkStats';

import ChartsWidgetsList from '../stats/ChartsWidgetsList';
import NumberWidgetsList from '../stats/NumberWidgetsList';
import StatsFilters from '../stats/StatsFilters';
import useStats from '../stats/useStats';

// Aggregate counters and historical charts are served by the Blockscout stats
// microservice. On networks where it is not deployed we show the live,
// chain-sourced Network Overview (validators / chains / stake from the P-chain)
// plus an honest note — never fabricated counters.
const hasStatsService = config.features.stats.isEnabled;

const Stats = () => {
  const {
    isPlaceholderData,
    isError,
    sections,
    currentSection,
    handleSectionChange,
    interval,
    handleIntervalChange,
    handleFilterChange,
    displayedCharts,
    initialFilterQuery,
  } = useStats();

  useEtherscanRedirects();

  return (
    <>
      <PageTitle
        title={ config.meta.seo.enhancedDataEnabled ? `${ config.chain.name } statistic & data` : `${ config.chain.name } stats` }
      />

      <NetworkStats/>

      { hasStatsService ? (
        <>
          <div className="mb-6 sm:mb-8">
            <NumberWidgetsList/>
          </div>

          <div className="mb-6 sm:mb-8">
            <StatsFilters
              isLoading={ isPlaceholderData }
              initialFilterValue={ initialFilterQuery }
              sections={ sections }
              currentSection={ currentSection }
              onSectionChange={ handleSectionChange }
              interval={ interval }
              onIntervalChange={ handleIntervalChange }
              onFilterInputChange={ handleFilterChange }
            />
          </div>

          <ChartsWidgetsList
            initialFilterQuery={ initialFilterQuery }
            isError={ isError }
            isPlaceholderData={ isPlaceholderData }
            charts={ displayedCharts }
            interval={ interval }
            sections={ sections }
            selectedSectionId={ currentSection }
          />
        </>
      ) : (
        <div className="mt-8 rounded-lg border border-[var(--color-border-divider)] px-6 py-10 text-center">
          <div className="text-base font-medium text-[var(--color-text-primary)]">
            Historical statistics are being indexed
          </div>
          <div className="mt-2 text-sm text-[var(--color-text-secondary)]">
            Live network data is shown above. Aggregate counters and charts will
            appear here once the analytics indexer is online for { config.chain.name }.
          </div>
        </div>
      ) }
    </>
  );
};

export default Stats;
