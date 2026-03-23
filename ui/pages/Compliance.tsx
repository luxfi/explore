import { Badge } from '@luxfi/ui/badge';
import { TableBody, TableCell, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from '@luxfi/ui/table';
import React from 'react';

import { COMPLIANCE_EVENTS, COMPLIANCE_STATS, REGULATORY_FILINGS } from 'lib/mock/compliance';
import type { ComplianceEvent, RegulatoryFiling } from 'lib/mock/compliance';
import PageTitle from 'ui/shared/Page/PageTitle';

const formatNumber = (n: number): string => n.toLocaleString('en-US');
const formatDateTime = (d: string): string => new Date(d).toLocaleString('en-US', {
  year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
});

const eventTypeColor = (t: ComplianceEvent['eventType']): 'green' | 'red' | 'orange' | 'blue' | 'purple' => {
  switch (t) {
    case 'KYC Verified': return 'green';
    case 'AML Alert': return 'red';
    case 'Trade Flag': return 'orange';
    case 'Restriction Check': return 'blue';
    case 'SAR Filed': return 'purple';
    case 'Offering Registered': return 'green';
  }
};

const eventStatusColor = (s: ComplianceEvent['status']): 'green' | 'orange' | 'red' | 'blue' => {
  switch (s) {
    case 'Completed': return 'green';
    case 'Pending': return 'orange';
    case 'Escalated': return 'red';
    case 'Resolved': return 'blue';
  }
};

const filingStatusBadgeColor = (c: RegulatoryFiling['statusColor']): 'green' | 'orange' | 'red' | 'blue' => c;

const StatCard = ({ label, value }: { label: string; value: string | number }) => (
  <div className="flex flex-col gap-1 p-4 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-dialog)]">
    <span className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider font-medium">{ label }</span>
    <span className="text-2xl font-bold">{ typeof value === 'number' ? formatNumber(value) : value }</span>
  </div>
);

const Compliance = () => {
  return (
    <>
      <PageTitle title="Compliance Dashboard" withTextAd/>

      { /* Stats */ }
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="KYC Verified Accounts" value={ COMPLIANCE_STATS.kycVerifiedAccounts }/>
        <StatCard label="Active AML Alerts" value={ COMPLIANCE_STATS.activeAmlAlerts }/>
        <StatCard label="Pending Reviews" value={ COMPLIANCE_STATS.pendingReviews }/>
        <StatCard label="SAR Filed (YTD)" value={ COMPLIANCE_STATS.sarFiledYtd }/>
      </div>

      { /* Recent Compliance Events */ }
      <div className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-dialog)] p-5 mb-6">
        <h2 className="text-lg font-semibold mb-4">Recent Compliance Events</h2>
        <div className="w-full overflow-x-auto">
          <TableRoot minWidth="900px">
            <TableHeaderSticky top={ 0 }>
              <TableRow>
                <TableColumnHeader>Timestamp</TableColumnHeader>
                <TableColumnHeader>Event Type</TableColumnHeader>
                <TableColumnHeader>Entity</TableColumnHeader>
                <TableColumnHeader>Status</TableColumnHeader>
                <TableColumnHeader>Reviewer</TableColumnHeader>
              </TableRow>
            </TableHeaderSticky>
            <TableBody>
              { COMPLIANCE_EVENTS.map((event) => (
                <TableRow key={ event.id }>
                  <TableCell>
                    <span className="text-sm whitespace-nowrap">{ formatDateTime(event.timestamp) }</span>
                  </TableCell>
                  <TableCell>
                    <Badge colorPalette={ eventTypeColor(event.eventType) } size="sm">
                      { event.eventType }
                    </Badge>
                  </TableCell>
                  <TableCell>{ event.entity }</TableCell>
                  <TableCell>
                    <Badge colorPalette={ eventStatusColor(event.status) } size="sm">
                      { event.status }
                    </Badge>
                  </TableCell>
                  <TableCell>{ event.reviewer }</TableCell>
                </TableRow>
              )) }
            </TableBody>
          </TableRoot>
        </div>
      </div>

      { /* Regulatory Filing Status */ }
      <div className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-dialog)] p-5 mb-6">
        <h2 className="text-lg font-semibold mb-4">Regulatory Filing Status</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          { REGULATORY_FILINGS.map((filing) => (
            <div
              key={ filing.name }
              className="flex flex-col gap-2 p-4 rounded-lg border border-[var(--color-border-default)]"
            >
              <span className="text-sm font-semibold">{ filing.name }</span>
              <Badge colorPalette={ filingStatusBadgeColor(filing.statusColor) } size="sm" className="self-start">
                { filing.status }
              </Badge>
              <span className="text-xs text-[var(--color-text-secondary)]">{ filing.detail }</span>
            </div>
          )) }
        </div>
      </div>
    </>
  );
};

export default Compliance;
