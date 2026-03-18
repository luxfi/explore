import React from 'react';

import type { EmptyStateProps } from 'toolkit/chakra/empty-state';
import { EmptyState } from 'toolkit/chakra/empty-state';

import DataFetchAlert from './DataFetchAlert';

export type Props = {
  isError: boolean;
  itemsNum?: number;
  emptyText?: React.ReactNode;
  actionBar?: React.ReactNode;
  showActionBarIfEmpty?: boolean;
  showActionBarIfError?: boolean;
  children: React.ReactNode;
  className?: string;
  hasActiveFilters?: boolean;
  emptyStateProps?: EmptyStateProps;
};

const DataListDisplay = (props: Props) => {
  if (props.isError) {
    if (props.showActionBarIfError) {
      return (
        <div className={ props.className }>
          { props.actionBar }
          <DataFetchAlert/>
        </div>
      );
    }

    return <DataFetchAlert className={ props.className }/>;
  }

  if (props.hasActiveFilters && !props.itemsNum) {
    return (
      <div className={ props.className }>
        { props.actionBar }
        <EmptyState { ...props.emptyStateProps }/>
      </div>
    );
  }

  if (!props.itemsNum) {
    return (
      <>
        { props.showActionBarIfEmpty && props.actionBar }
        { props.emptyText && <p className={ props.className }>{ props.emptyText }</p> }
      </>
    );
  }

  return (
    <div className={ props.className }>
      { props.actionBar }
      { props.children }
    </div>
  );
};

export default DataListDisplay;
