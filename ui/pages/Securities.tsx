import { Badge } from '@luxfi/ui/badge';
import { TableBody, TableCell, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from '@luxfi/ui/table';
import React from 'react';

import { SECURITIES, SECURITIES_STATS } from 'lib/mock/compliance';
import type { Security } from 'lib/mock/compliance';
import { Link } from 'toolkit/next/link';
import PageTitle from 'ui/shared/Page/PageTitle';

const regulationColor = (reg: Security['regulation']): 'blue' | 'purple' | 'orange' | 'teal' | 'cyan' => {
  switch (reg) {
    case 'Reg D 506(c)': return 'blue';
    case 'Reg D 506(b)': return 'purple';
    case 'Reg A+': return 'orange';
    case 'Reg CF': return 'teal';
    case 'Reg S': return 'cyan';
  }
};

const restrictionColor = (status: Security['restrictionStatus']): 'red' | 'green' | 'orange' => {
  switch (status) {
    case 'Restricted': return 'red';
    case 'Unrestricted': return 'green';
    case 'Partial': return 'orange';
  }
};

const typeColor = (type: Security['type']): 'blue' | 'green' | 'purple' | 'orange' => {
  switch (type) {
    case 'Preferred Stock': return 'blue';
    case 'Common Stock': return 'green';
    case 'Convertible Note': return 'purple';
    case 'LP Interest': return 'orange';
  }
};

const formatNumber = (n: number): string => n.toLocaleString('en-US');
const formatCurrency = (n: number): string => `$${ n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }`;

const StatCard = ({ label, value }: { label: string; value: string | number }) => (
  <div className="flex flex-col gap-1 p-4 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-dialog)]">
    <span className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider font-medium">{ label }</span>
    <span className="text-2xl font-bold">{ typeof value === 'number' ? formatNumber(value) : value }</span>
  </div>
);

const Securities = () => {
  return (
    <>
      <PageTitle title="Registered Securities" withTextAd/>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Securities" value={ SECURITIES_STATS.totalSecurities }/>
        <StatCard label="Active Offerings" value={ SECURITIES_STATS.activeOfferings }/>
        <StatCard label="Transfer Restricted" value={ SECURITIES_STATS.transferRestricted }/>
        <StatCard label="Pending Settlements" value={ SECURITIES_STATS.pendingSettlements }/>
      </div>

      <div className="w-full overflow-x-auto">
        <TableRoot minWidth="1200px">
          <TableHeaderSticky top={ 0 }>
            <TableRow>
              <TableColumnHeader>Security Name</TableColumnHeader>
              <TableColumnHeader>Issuer</TableColumnHeader>
              <TableColumnHeader>Type</TableColumnHeader>
              <TableColumnHeader>Regulation</TableColumnHeader>
              <TableColumnHeader>Share Class</TableColumnHeader>
              <TableColumnHeader isNumeric>Outstanding Shares</TableColumnHeader>
              <TableColumnHeader isNumeric>Last Trade Price</TableColumnHeader>
              <TableColumnHeader>Restriction Status</TableColumnHeader>
              <TableColumnHeader>Transfer Agent</TableColumnHeader>
            </TableRow>
          </TableHeaderSticky>
          <TableBody>
            { SECURITIES.map((sec) => (
              <TableRow key={ sec.id }>
                <TableCell>
                  <Link href={ `/securities/${ sec.id }` } variant="primary">
                    { sec.name }
                  </Link>
                </TableCell>
                <TableCell>{ sec.issuer }</TableCell>
                <TableCell>
                  <Badge colorPalette={ typeColor(sec.type) } size="sm">{ sec.type }</Badge>
                </TableCell>
                <TableCell>
                  <Badge colorPalette={ regulationColor(sec.regulation) } size="sm">{ sec.regulation }</Badge>
                </TableCell>
                <TableCell>{ sec.shareClass }</TableCell>
                <TableCell isNumeric>{ formatNumber(sec.outstandingShares) }</TableCell>
                <TableCell isNumeric>{ formatCurrency(sec.lastTradePrice) }</TableCell>
                <TableCell>
                  <Badge colorPalette={ restrictionColor(sec.restrictionStatus) } size="sm">
                    { sec.restrictionStatus }
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-xs text-[var(--color-text-secondary)]">{ sec.transferAgent }</span>
                </TableCell>
              </TableRow>
            )) }
          </TableBody>
        </TableRoot>
      </div>
    </>
  );
};

export default Securities;
