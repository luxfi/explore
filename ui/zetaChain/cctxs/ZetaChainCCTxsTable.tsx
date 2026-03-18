import React from 'react';

import type { CctxListItem } from '@luxfi/zetachain-cctx-types';
import type { ZetaChainCCTXFilterParams } from 'types/client/zetaChain';

import { AddressHighlightProvider } from 'lib/contexts/addressHighlight';
import useInitialList from 'lib/hooks/useInitialList';
import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import * as SocketNewItemsNotice from 'ui/shared/SocketNewItemsNotice';
import TimeFormatToggle from 'ui/shared/time/TimeFormatToggle';

import ZetaChainFilterByColumn from '../filters/ZetaChainFilterByColumn';
import ZetaChainCCTxsTableItem from './ZetaChainCCTxsTableItem';

type Props = {
  txs: Array<CctxListItem>;
  top: number;
  enableTimeIncrement?: boolean;
  isLoading?: boolean;
  filters?: ZetaChainCCTXFilterParams;
  onFilterChange: <T extends keyof ZetaChainCCTXFilterParams>(field: T, val: ZetaChainCCTXFilterParams[T]) => void;
  isPlaceholderData?: boolean;
  showStatusFilter?: boolean;
  showSocketInfo?: boolean;
  showSocketErrorAlert?: boolean;
  socketInfoNum?: number;
};

const ZetaChainCCTxsTable = ({
  txs,
  top,
  enableTimeIncrement,
  isLoading,
  filters = {},
  onFilterChange,
  isPlaceholderData,
  showStatusFilter = true,
  showSocketInfo = false,
  showSocketErrorAlert = false,
  socketInfoNum = 0,
}: Props) => {
  const initialList = useInitialList({
    data: txs ?? [],
    idFn: (item) => item.index,
    enabled: !isLoading,
  });

  return (
    <AddressHighlightProvider>
      <TableRoot minWidth="950px">
        <TableHeaderSticky top={ top }>
          <TableRow>
            <TableColumnHeader>
              <div className="flex">
                <span verticalAlign="middle">
                  CCTx hash
                </span>
                <ZetaChainFilterByColumn
                  column="age"
                  columnName="Age"
                  filters={ filters }
                  handleFilterChange={ onFilterChange }
                  isLoading={ isPlaceholderData }
                />
                <TimeFormatToggle/>
              </div>
            </TableColumnHeader>
            <TableColumnHeader>
              <span verticalAlign="middle">
                Status
              </span>
              { showStatusFilter && (
                <ZetaChainFilterByColumn
                  column="status"
                  columnName="Status"
                  filters={ filters }
                  handleFilterChange={ onFilterChange }
                  isLoading={ isPlaceholderData }
                />
              ) }
            </TableColumnHeader>
            <TableColumnHeader>
              <span verticalAlign="middle">
                Sender
              </span>
              <ZetaChainFilterByColumn
                column="sender"
                columnName="Sender"
                filters={ filters }
                handleFilterChange={ onFilterChange }
                isLoading={ isPlaceholderData }
              />
            </TableColumnHeader>
            <TableColumnHeader>
              <span verticalAlign="middle">
                Receiver
              </span>
              <ZetaChainFilterByColumn
                column="receiver"
                columnName="Receiver"
                filters={ filters }
                handleFilterChange={ onFilterChange }
                isLoading={ isPlaceholderData }
              />
            </TableColumnHeader>
            <TableColumnHeader isNumeric>
              <span verticalAlign="middle">
                Value
              </span>
              <ZetaChainFilterByColumn
                column="asset"
                columnName="Asset"
                filters={ filters }
                handleFilterChange={ onFilterChange }
                isLoading={ isPlaceholderData }
              />
            </TableColumnHeader>
          </TableRow>
        </TableHeaderSticky>
        <TableBody>
          { showSocketInfo && (
            <SocketNewItemsNotice.Desktop
              showErrorAlert={ showSocketErrorAlert }
              num={ socketInfoNum }
              type="cross_chain_transaction"
              isLoading={ isLoading }
            />
          ) }
          { txs.map((item, index) => (
            <ZetaChainCCTxsTableItem
              key={ item.index + (isLoading ? index : '') }
              tx={ item }
              enableTimeIncrement={ enableTimeIncrement }
              isLoading={ isLoading }
            />
          )) }
        </TableBody>
      </TableRoot>
    </AddressHighlightProvider>
  );
};

export default React.memo(ZetaChainCCTxsTable);
