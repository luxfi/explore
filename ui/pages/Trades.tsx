import { Badge } from '@luxfi/ui/badge';
import { TableBody, TableCell, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from '@luxfi/ui/table';
import React from 'react';

import { TRADES, TRADES_STATS } from 'lib/mock/compliance';
import type { Trade } from 'lib/mock/compliance';
import { Link } from 'toolkit/next/link';
import PageTitle from 'ui/shared/Page/PageTitle';

const formatNumber = (n: number): string => n.toLocaleString('en-US');
const formatCurrency = (n: number): string => `$${ n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }`;
const formatDateTime = (d: string): string => new Date(d).toLocaleString('en-US', {
  year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
});

const settlementColor = (s: Trade['settlementStatus']): 'green' | 'orange' | 'red' | 'blue' => {
  switch (s) {
    case 'Settled': return 'green';
    case 'Pending': return 'orange';
    case 'Failed': return 'red';
    case 'In Transit': return 'blue';
  }
};

const complianceColor = (s: Trade['complianceStatus']): 'green' | 'orange' | 'red' | 'purple' => {
  switch (s) {
    case 'Cleared': return 'green';
    case 'Flagged': return 'orange';
    case 'Under Review': return 'purple';
    case 'Blocked': return 'red';
  }
};

const StatCard = ({ label, value }: { label: string; value: string | number }) => (
  <div className="flex flex-col gap-1 p-4 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-dialog)]">
    <span className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider font-medium">{ label }</span>
    <span className="text-2xl font-bold">{ typeof value === 'number' ? formatNumber(value) : value }</span>
  </div>
);

const Trades = () => {
  return (
    <>
      <PageTitle title="Cross-BD Trades" withTextAd/>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Trades" value={ TRADES_STATS.totalTrades }/>
        <StatCard label="Today's Volume" value={ formatCurrency(TRADES_STATS.todayVolume) }/>
        <StatCard label="Pending Settlement" value={ TRADES_STATS.pendingSettlement }/>
        <StatCard label="Compliance Flags" value={ TRADES_STATS.complianceFlags }/>
      </div>

      <div className="w-full overflow-x-auto">
        <TableRoot minWidth="1300px">
          <TableHeaderSticky top={ 0 }>
            <TableRow>
              <TableColumnHeader>Trade ID</TableColumnHeader>
              <TableColumnHeader>Date</TableColumnHeader>
              <TableColumnHeader>Security</TableColumnHeader>
              <TableColumnHeader>Buyer BD (CRD#)</TableColumnHeader>
              <TableColumnHeader>Seller BD (CRD#)</TableColumnHeader>
              <TableColumnHeader isNumeric>Shares</TableColumnHeader>
              <TableColumnHeader isNumeric>Price</TableColumnHeader>
              <TableColumnHeader isNumeric>Net Amount</TableColumnHeader>
              <TableColumnHeader>Settlement</TableColumnHeader>
              <TableColumnHeader>Compliance</TableColumnHeader>
            </TableRow>
          </TableHeaderSticky>
          <TableBody>
            { TRADES.map((trade) => (
              <TableRow key={ trade.id }>
                <TableCell>
                  <span className="font-mono text-xs">{ trade.id }</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm whitespace-nowrap">{ formatDateTime(trade.date) }</span>
                </TableCell>
                <TableCell>
                  <Link href={ `/securities/${ trade.securityId }` } variant="primary">
                    { trade.securityName }
                  </Link>
                </TableCell>
                <TableCell>
                  <span>{ trade.buyerBd.name }</span>
                  <span className="text-xs text-[var(--color-text-secondary)] ml-1">(CRD { trade.buyerBd.crd })</span>
                </TableCell>
                <TableCell>
                  <span>{ trade.sellerBd.name }</span>
                  <span className="text-xs text-[var(--color-text-secondary)] ml-1">(CRD { trade.sellerBd.crd })</span>
                </TableCell>
                <TableCell isNumeric>{ formatNumber(trade.shares) }</TableCell>
                <TableCell isNumeric>{ formatCurrency(trade.price) }</TableCell>
                <TableCell isNumeric>{ formatCurrency(trade.netAmount) }</TableCell>
                <TableCell>
                  <Badge colorPalette={ settlementColor(trade.settlementStatus) } size="sm">
                    { trade.settlementStatus }
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge colorPalette={ complianceColor(trade.complianceStatus) } size="sm">
                    { trade.complianceStatus }
                  </Badge>
                </TableCell>
              </TableRow>
            )) }
          </TableBody>
        </TableRoot>
      </div>
    </>
  );
};

export default Trades;
