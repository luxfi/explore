import React from 'react';

import { TableRow, TableCell } from '@luxfi/ui/table';
import NovesFromTo from 'ui/shared/Noves/NovesFromTo';

import NovesActionSnippet from './components/NovesActionSnippet';
import type { NovesFlowViewItem } from './utils/generateFlowViewData';

type Props = {
  isPlaceholderData: boolean;
  item: NovesFlowViewItem;
};

const TxAssetFlowsTableItem = (props: Props) => {

  return (
    <TableRow>
      <TableCell px={ 3 } py={ 5 } fontSize="sm">
        <NovesActionSnippet item={ props.item } isLoaded={ !props.isPlaceholderData }/>
      </TableCell>
      <TableCell px={ 3 } py="18px" fontSize="sm">
        <NovesFromTo item={ props.item } isLoaded={ !props.isPlaceholderData }/>
      </TableCell>
    </TableRow>
  );
};

export default React.memo(TxAssetFlowsTableItem);
