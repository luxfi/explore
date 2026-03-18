import React from 'react';

import config from 'configs/app';
import useEtherscanRedirects from 'lib/router/useEtherscanRedirects';
import PageTitle from 'ui/shared/Page/PageTitle';
import NetworkStats from 'ui/stats/lux/NetworkStats';

import ChartsWidgetsList from '../stats/ChartsWidgetsList';
import NumberWidgetsList from '../stats/NumberWidgetsList';
import StatsFilters from '../stats/StatsFilters';
import useStats from '../stats/useStats';

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
  );
};

export default Stats;
