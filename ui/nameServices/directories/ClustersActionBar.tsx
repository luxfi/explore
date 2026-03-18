import React from 'react';

import type { PaginationParams } from 'ui/shared/pagination/types';

import {
  getSearchPlaceholder,
  shouldShowActionBar,
} from 'lib/clusters/actionBarUtils';
import useIsInitialLoading from 'lib/hooks/useIsInitialLoading';
import { Button, ButtonGroupRadio } from 'toolkit/chakra/button';
import { FilterInput } from 'toolkit/components/filters/FilterInput';
import ActionBar from 'ui/shared/ActionBar';
import Pagination from 'ui/shared/pagination/Pagination';

type ViewMode = 'leaderboard' | 'directory';

interface Props {
  pagination: PaginationParams;
  searchTerm: string | undefined;
  onSearchChange: (value: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (viewMode: ViewMode) => void;
  isLoading: boolean;
}

const ClustersActionBar = ({
  searchTerm,
  onSearchChange,
  viewMode,
  onViewModeChange,
  isLoading,
  pagination,
}: Props) => {
  const isInitialLoading = useIsInitialLoading(isLoading);

  const handleViewModeChange = React.useCallback((value: string) => {
    onViewModeChange(value as ViewMode);
  }, [ onViewModeChange ]);

  const placeholder = getSearchPlaceholder();
  const showActionBarOnMobile = shouldShowActionBar(pagination.isVisible, false);
  const showActionBarOnDesktop = shouldShowActionBar(pagination.isVisible, true);

  const filters = (
    <div className="flex gap-x-3 gap-y-3 flex-col lg:flex-row">
      <ButtonGroupRadio
        defaultValue={ viewMode }
        onChange={ handleViewModeChange }
        className="lg:w-fit"
        loading={ isInitialLoading }
      >
        <Button value="directory" size="sm" className="px-3">
          Directory
        </Button>
        <Button value="leaderboard" size="sm" className="px-3">
          Leaderboard
        </Button>
      </ButtonGroupRadio>
      <FilterInput
        initialValue={ searchTerm }
        onChange={ onSearchChange }
        placeholder={ placeholder }
        className="w-full lg:w-[360px] min-w-[auto] lg:min-w-[250px]"
        size="sm"
        loading={ isInitialLoading }
      />
    </div>
  );

  return (
    <>
      <div className="flex lg:hidden items-stretch mb-6 gap-3">
        { filters }
      </div>
      <ActionBar
        mt={ -6 }
        display={{ base: showActionBarOnMobile ? 'flex' : 'none', lg: showActionBarOnDesktop ? 'flex' : 'none' }}
      >
        <div className="hidden lg:block">
          { filters }
        </div>
        <Pagination { ...pagination } className="ml-auto"/>
      </ActionBar>
    </>
  );
};

export default React.memo(ClustersActionBar);
