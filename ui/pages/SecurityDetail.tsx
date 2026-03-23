import { Badge } from '@luxfi/ui/badge';
import { TableBody, TableCell, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from '@luxfi/ui/table';
import { useRouter } from 'next/router';
import React from 'react';

import { SECURITIES, TRADES, SECURITY_TIMELINE_EVENTS } from 'lib/mock/compliance';
import type { Trade } from 'lib/mock/compliance';
import getQueryParamString from 'lib/router/getQueryParamString';
import { Link } from 'toolkit/next/link';
import PageTitle from 'ui/shared/Page/PageTitle';

const formatNumber = (n: number): string => n.toLocaleString('en-US');
const formatCurrency = (n: number): string => `$${ n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }`;
const formatDate = (d: string): string => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
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

const DetailRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-2 border-b border-[var(--color-border-default)]">
    <span className="text-sm text-[var(--color-text-secondary)] font-medium sm:w-48 shrink-0">{ label }</span>
    <span className="text-sm">{ children }</span>
  </div>
);

const SecurityDetail = () => {
  const router = useRouter();
  const id = getQueryParamString(router.query.id);

  const security = SECURITIES.find((s) => s.id === id);
  const securityTrades = TRADES.filter((t) => t.securityId === id);
  const timeline = SECURITY_TIMELINE_EVENTS[id] || [];

  if (!security) {
    return (
      <>
        <PageTitle title="Security Not Found"/>
        <p className="text-[var(--color-text-secondary)]">No security found with ID: { id }</p>
      </>
    );
  }

  return (
    <>
      <PageTitle title={ security.name }/>

      { /* Security Overview */ }
      <div className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-dialog)] p-5 mb-6">
        <h2 className="text-lg font-semibold mb-4">Security Overview</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
          <div>
            <DetailRow label="Issuer">{ security.issuer }</DetailRow>
            <DetailRow label="Issuer Type">{ security.issuerType }</DetailRow>
            <DetailRow label="Type">
              <Badge colorPalette="blue" size="sm">{ security.type }</Badge>
            </DetailRow>
            <DetailRow label="Regulation">
              <Badge colorPalette="purple" size="sm">{ security.regulation }</Badge>
            </DetailRow>
            <DetailRow label="Share Class">{ security.shareClass }</DetailRow>
            <DetailRow label="CUSIP">{ security.cusip }</DetailRow>
            <DetailRow label="ISIN">{ security.isin }</DetailRow>
          </div>
          <div>
            <DetailRow label="Outstanding Shares">{ formatNumber(security.outstandingShares) }</DetailRow>
            <DetailRow label="Authorized Shares">{ formatNumber(security.authorizedShares) }</DetailRow>
            <DetailRow label="Last Trade Price">{ formatCurrency(security.lastTradePrice) }</DetailRow>
            <DetailRow label="Last Valuation">{ formatCurrency(security.lastValuation) }</DetailRow>
            <DetailRow label="Valuation Date">{ formatDate(security.valuationDate) }</DetailRow>
            <DetailRow label="Transfer Agent">{ security.transferAgent }</DetailRow>
          </div>
        </div>
      </div>

      { /* Transfer Restrictions */ }
      <div className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-dialog)] p-5 mb-6">
        <h2 className="text-lg font-semibold mb-4">Transfer Restrictions</h2>
        <DetailRow label="Rule 144 Holding Period">{ security.rule144HoldingPeriod }</DetailRow>
        <DetailRow label="Legend Required">
          <Badge colorPalette={ security.legendRequired ? 'orange' : 'green' } size="sm">
            { security.legendRequired ? 'Yes' : 'No' }
          </Badge>
        </DetailRow>
        <DetailRow label="Lock-up Expiry">{ security.lockUpExpiry }</DetailRow>
        <DetailRow label="Board Approval Required">
          <Badge colorPalette={ security.boardApprovalRequired ? 'orange' : 'green' } size="sm">
            { security.boardApprovalRequired ? 'Yes' : 'No' }
          </Badge>
        </DetailRow>
        <DetailRow label="ROFR Status">{ security.rofrStatus }</DetailRow>
        <DetailRow label="Restriction Text">
          <span className="text-[var(--color-text-secondary)] italic">{ security.restrictionText }</span>
        </DetailRow>
      </div>

      { /* Recent Trades */ }
      { securityTrades.length > 0 && (
        <div className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-dialog)] p-5 mb-6">
          <h2 className="text-lg font-semibold mb-4">Recent Trades</h2>
          <div className="w-full overflow-x-auto">
            <TableRoot minWidth="900px">
              <TableHeaderSticky top={ 0 }>
                <TableRow>
                  <TableColumnHeader>Date</TableColumnHeader>
                  <TableColumnHeader>Buyer BD</TableColumnHeader>
                  <TableColumnHeader>Seller BD</TableColumnHeader>
                  <TableColumnHeader isNumeric>Shares</TableColumnHeader>
                  <TableColumnHeader isNumeric>Price</TableColumnHeader>
                  <TableColumnHeader isNumeric>Amount</TableColumnHeader>
                  <TableColumnHeader>Settlement</TableColumnHeader>
                </TableRow>
              </TableHeaderSticky>
              <TableBody>
                { securityTrades.map((trade) => (
                  <TableRow key={ trade.id }>
                    <TableCell>{ formatDateTime(trade.date) }</TableCell>
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
                  </TableRow>
                )) }
              </TableBody>
            </TableRoot>
          </div>
        </div>
      ) }

      { /* Compliance Events Timeline */ }
      { timeline.length > 0 && (
        <div className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-dialog)] p-5 mb-6">
          <h2 className="text-lg font-semibold mb-4">Compliance Events Timeline</h2>
          <ol className="relative border-l-2 border-[var(--color-border-default)] ml-4">
            { timeline.map((event, index) => (
              <li key={ index } className="mb-6 ml-6">
                <span className={
                  'absolute -left-[9px] flex h-4 w-4 items-center justify-center ' +
                  'rounded-full bg-[var(--color-border-default)] ring-4 ring-[var(--color-bg-dialog)]'
                }/>
                <time className="mb-1 text-xs text-[var(--color-text-secondary)] font-medium">
                  { formatDate(event.date) }
                </time>
                <p className="text-sm">{ event.description }</p>
              </li>
            )) }
          </ol>
        </div>
      ) }

      <div className="mt-4">
        <Link href="/securities" variant="primary">Back to Securities Registry</Link>
      </div>
    </>
  );
};

export default SecurityDetail;
