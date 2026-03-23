// Mock data for regulator compliance pages

export interface BrokerDealer {
  name: string;
  crd: string;
}

export interface Security {
  id: string;
  name: string;
  issuer: string;
  type: 'Preferred Stock' | 'Common Stock' | 'Convertible Note' | 'LP Interest';
  regulation: 'Reg D 506(b)' | 'Reg D 506(c)' | 'Reg A+' | 'Reg CF' | 'Reg S';
  shareClass: string;
  outstandingShares: number;
  authorizedShares: number;
  lastTradePrice: number;
  lastValuation: number;
  valuationDate: string;
  restrictionStatus: 'Restricted' | 'Unrestricted' | 'Partial';
  transferAgent: string;
  cusip: string;
  isin: string;
  issuerType: string;
  rule144HoldingPeriod: string;
  legendRequired: boolean;
  lockUpExpiry: string;
  boardApprovalRequired: boolean;
  rofrStatus: string;
  restrictionText: string;
}

export interface Trade {
  id: string;
  date: string;
  securityName: string;
  securityId: string;
  buyerBd: BrokerDealer;
  sellerBd: BrokerDealer;
  shares: number;
  price: number;
  netAmount: number;
  settlementStatus: 'Settled' | 'Pending' | 'Failed' | 'In Transit';
  complianceStatus: 'Cleared' | 'Flagged' | 'Under Review' | 'Blocked';
}

export interface ComplianceEvent {
  id: string;
  timestamp: string;
  eventType: 'KYC Verified' | 'AML Alert' | 'Trade Flag' | 'Restriction Check' | 'SAR Filed' | 'Offering Registered';
  entity: string;
  status: 'Completed' | 'Pending' | 'Escalated' | 'Resolved';
  reviewer: string;
}

export interface RegulatoryFiling {
  name: string;
  status: string;
  statusColor: 'green' | 'orange' | 'red' | 'blue';
  detail: string;
}

export interface SecurityTimelineEvent {
  date: string;
  description: string;
}

export const BROKER_DEALERS: Record<string, BrokerDealer> = {
  raymond_james: { name: 'Raymond James', crd: '705' },
  edward_jones: { name: 'Edward Jones', crd: '250' },
  goldman_sachs: { name: 'Goldman Sachs', crd: '361' },
  morgan_stanley: { name: 'Morgan Stanley', crd: '149728' },
  apex_clearing: { name: 'Apex Clearing', crd: '151823' },
  pershing: { name: 'Pershing', crd: '7534' },
  bridgewater: { name: 'Bridgewater Capital', crd: '24418' },
  meridian: { name: 'Meridian Growth', crd: '38291' },
};

export const TRANSFER_AGENT = 'Computershare Trust Company (SEC 84-01234)';

export const SECURITIES: Array<Security> = [
  {
    id: 'sec-001',
    name: 'Meridian Growth Series A',
    issuer: 'Meridian Growth Partners LLC',
    type: 'Preferred Stock',
    regulation: 'Reg D 506(c)',
    shareClass: 'Class A',
    outstandingShares: 2450000,
    authorizedShares: 5000000,
    lastTradePrice: 24.50,
    lastValuation: 60025000,
    valuationDate: '2026-02-15',
    restrictionStatus: 'Restricted',
    transferAgent: TRANSFER_AGENT,
    cusip: '58463K108',
    isin: 'US58463K1089',
    issuerType: 'Private Fund',
    rule144HoldingPeriod: '6 months remaining',
    legendRequired: true,
    lockUpExpiry: '2026-09-15',
    boardApprovalRequired: true,
    rofrStatus: 'Active - 30 day notice',
    restrictionText: 'Shares subject to Rule 144 holding period and contractual lock-up. Board approval required for all transfers.',
  },
  {
    id: 'sec-002',
    name: 'Bridgewater Capital Fund II',
    issuer: 'Bridgewater Capital Management',
    type: 'LP Interest',
    regulation: 'Reg D 506(b)',
    shareClass: 'Limited Partner',
    outstandingShares: 850000,
    authorizedShares: 1000000,
    lastTradePrice: 112.75,
    lastValuation: 95837500,
    valuationDate: '2026-01-31',
    restrictionStatus: 'Restricted',
    transferAgent: TRANSFER_AGENT,
    cusip: '10827A205',
    isin: 'US10827A2051',
    issuerType: 'Investment Fund',
    rule144HoldingPeriod: 'Completed',
    legendRequired: true,
    lockUpExpiry: '2026-06-30',
    boardApprovalRequired: false,
    rofrStatus: 'Active - GP consent required',
    restrictionText: 'LP interests subject to partnership agreement transfer restrictions and GP consent.',
  },
  {
    id: 'sec-003',
    name: 'NovaTech Industries Common',
    issuer: 'NovaTech Industries Inc.',
    type: 'Common Stock',
    regulation: 'Reg A+',
    shareClass: 'Common',
    outstandingShares: 12500000,
    authorizedShares: 25000000,
    lastTradePrice: 8.25,
    lastValuation: 103125000,
    valuationDate: '2026-03-01',
    restrictionStatus: 'Unrestricted',
    transferAgent: TRANSFER_AGENT,
    cusip: '66987P301',
    isin: 'US66987P3016',
    issuerType: 'Operating Company',
    rule144HoldingPeriod: 'N/A - Reg A+ qualified',
    legendRequired: false,
    lockUpExpiry: 'N/A',
    boardApprovalRequired: false,
    rofrStatus: 'None',
    restrictionText: 'Freely tradeable under Reg A+ Tier 2 qualification.',
  },
  {
    id: 'sec-004',
    name: 'Apex Ventures Seed',
    issuer: 'Apex Ventures GP LLC',
    type: 'Convertible Note',
    regulation: 'Reg D 506(c)',
    shareClass: 'Convertible',
    outstandingShares: 500000,
    authorizedShares: 500000,
    lastTradePrice: 1.00,
    lastValuation: 500000,
    valuationDate: '2026-02-28',
    restrictionStatus: 'Restricted',
    transferAgent: TRANSFER_AGENT,
    cusip: '03768M400',
    isin: 'US03768M4009',
    issuerType: 'Venture Fund',
    rule144HoldingPeriod: '11 months remaining',
    legendRequired: true,
    lockUpExpiry: '2027-01-15',
    boardApprovalRequired: true,
    rofrStatus: 'Active - 60 day notice',
    restrictionText: 'Convertible notes subject to full Rule 144 holding period. No conversion until maturity.',
  },
  {
    id: 'sec-005',
    name: 'Pacific Realty Trust Units',
    issuer: 'Pacific Realty Trust LLC',
    type: 'LP Interest',
    regulation: 'Reg D 506(b)',
    shareClass: 'Class B Units',
    outstandingShares: 3200000,
    authorizedShares: 5000000,
    lastTradePrice: 15.80,
    lastValuation: 50560000,
    valuationDate: '2026-03-10',
    restrictionStatus: 'Partial',
    transferAgent: TRANSFER_AGENT,
    cusip: '69420B202',
    isin: 'US69420B2024',
    issuerType: 'REIT',
    rule144HoldingPeriod: 'Completed',
    legendRequired: true,
    lockUpExpiry: '2026-04-30',
    boardApprovalRequired: false,
    rofrStatus: 'Waived for accredited investors',
    restrictionText: 'Units partially restricted. Lock-up expires April 2026. Accredited investor transfers permitted.',
  },
  {
    id: 'sec-006',
    name: 'GreenTech Solar Preferred',
    issuer: 'GreenTech Solar Holdings',
    type: 'Preferred Stock',
    regulation: 'Reg CF',
    shareClass: 'Series Seed',
    outstandingShares: 750000,
    authorizedShares: 2000000,
    lastTradePrice: 4.20,
    lastValuation: 3150000,
    valuationDate: '2026-03-05',
    restrictionStatus: 'Restricted',
    transferAgent: TRANSFER_AGENT,
    cusip: '39530T109',
    isin: 'US39530T1097',
    issuerType: 'Operating Company',
    rule144HoldingPeriod: '12 months - holding required',
    legendRequired: true,
    lockUpExpiry: '2027-03-05',
    boardApprovalRequired: true,
    rofrStatus: 'Active - company ROFR',
    restrictionText: 'Reg CF securities subject to 12-month holding period. Company right of first refusal on all transfers.',
  },
  {
    id: 'sec-007',
    name: 'Atlas Infrastructure Fund',
    issuer: 'Atlas Infrastructure GP',
    type: 'LP Interest',
    regulation: 'Reg S',
    shareClass: 'Class A Units',
    outstandingShares: 1800000,
    authorizedShares: 3000000,
    lastTradePrice: 52.30,
    lastValuation: 94140000,
    valuationDate: '2026-02-20',
    restrictionStatus: 'Restricted',
    transferAgent: TRANSFER_AGENT,
    cusip: '04940R306',
    isin: 'US04940R3068',
    issuerType: 'Infrastructure Fund',
    rule144HoldingPeriod: 'N/A - Reg S offshore',
    legendRequired: true,
    lockUpExpiry: '2026-08-20',
    boardApprovalRequired: false,
    rofrStatus: 'Active - GP consent',
    restrictionText: 'Reg S offshore offering. Distribution period restrictions apply. US person transfers prohibited.',
  },
  {
    id: 'sec-008',
    name: 'Horizon BioSciences Common',
    issuer: 'Horizon BioSciences Inc.',
    type: 'Common Stock',
    regulation: 'Reg D 506(c)',
    shareClass: 'Common',
    outstandingShares: 4200000,
    authorizedShares: 10000000,
    lastTradePrice: 18.90,
    lastValuation: 79380000,
    valuationDate: '2026-03-15',
    restrictionStatus: 'Partial',
    transferAgent: TRANSFER_AGENT,
    cusip: '44052L108',
    isin: 'US44052L1089',
    issuerType: 'Operating Company',
    rule144HoldingPeriod: '2 months remaining',
    legendRequired: true,
    lockUpExpiry: '2026-05-15',
    boardApprovalRequired: true,
    rofrStatus: 'None',
    restrictionText: 'Partial restriction. Rule 144 holding period nearly complete. Board approval still required.',
  },
];

export const TRADES: Array<Trade> = [
  {
    id: 'TRD-2026-00847',
    date: '2026-03-22T14:32:00Z',
    securityName: 'NovaTech Industries Common',
    securityId: 'sec-003',
    buyerBd: BROKER_DEALERS.raymond_james,
    sellerBd: BROKER_DEALERS.goldman_sachs,
    shares: 15000,
    price: 8.25,
    netAmount: 123750,
    settlementStatus: 'Pending',
    complianceStatus: 'Cleared',
  },
  {
    id: 'TRD-2026-00846',
    date: '2026-03-22T11:15:00Z',
    securityName: 'Meridian Growth Series A',
    securityId: 'sec-001',
    buyerBd: BROKER_DEALERS.morgan_stanley,
    sellerBd: BROKER_DEALERS.meridian,
    shares: 5000,
    price: 24.50,
    netAmount: 122500,
    settlementStatus: 'In Transit',
    complianceStatus: 'Under Review',
  },
  {
    id: 'TRD-2026-00845',
    date: '2026-03-21T16:45:00Z',
    securityName: 'Pacific Realty Trust Units',
    securityId: 'sec-005',
    buyerBd: BROKER_DEALERS.apex_clearing,
    sellerBd: BROKER_DEALERS.pershing,
    shares: 25000,
    price: 15.80,
    netAmount: 395000,
    settlementStatus: 'Settled',
    complianceStatus: 'Cleared',
  },
  {
    id: 'TRD-2026-00844',
    date: '2026-03-21T10:20:00Z',
    securityName: 'Bridgewater Capital Fund II',
    securityId: 'sec-002',
    buyerBd: BROKER_DEALERS.edward_jones,
    sellerBd: BROKER_DEALERS.bridgewater,
    shares: 2000,
    price: 112.75,
    netAmount: 225500,
    settlementStatus: 'Settled',
    complianceStatus: 'Cleared',
  },
  {
    id: 'TRD-2026-00843',
    date: '2026-03-20T15:30:00Z',
    securityName: 'Horizon BioSciences Common',
    securityId: 'sec-008',
    buyerBd: BROKER_DEALERS.goldman_sachs,
    sellerBd: BROKER_DEALERS.raymond_james,
    shares: 10000,
    price: 18.90,
    netAmount: 189000,
    settlementStatus: 'Settled',
    complianceStatus: 'Flagged',
  },
  {
    id: 'TRD-2026-00842',
    date: '2026-03-20T09:50:00Z',
    securityName: 'Atlas Infrastructure Fund',
    securityId: 'sec-007',
    buyerBd: BROKER_DEALERS.pershing,
    sellerBd: BROKER_DEALERS.apex_clearing,
    shares: 3500,
    price: 52.30,
    netAmount: 183050,
    settlementStatus: 'Failed',
    complianceStatus: 'Blocked',
  },
  {
    id: 'TRD-2026-00841',
    date: '2026-03-19T13:10:00Z',
    securityName: 'GreenTech Solar Preferred',
    securityId: 'sec-006',
    buyerBd: BROKER_DEALERS.morgan_stanley,
    sellerBd: BROKER_DEALERS.edward_jones,
    shares: 50000,
    price: 4.20,
    netAmount: 210000,
    settlementStatus: 'Settled',
    complianceStatus: 'Cleared',
  },
  {
    id: 'TRD-2026-00840',
    date: '2026-03-19T08:45:00Z',
    securityName: 'Apex Ventures Seed',
    securityId: 'sec-004',
    buyerBd: BROKER_DEALERS.bridgewater,
    sellerBd: BROKER_DEALERS.meridian,
    shares: 100000,
    price: 1.00,
    netAmount: 100000,
    settlementStatus: 'Pending',
    complianceStatus: 'Under Review',
  },
];

export const COMPLIANCE_EVENTS: Array<ComplianceEvent> = [
  {
    id: 'CE-001',
    timestamp: '2026-03-22T14:45:00Z',
    eventType: 'KYC Verified',
    entity: 'Bridgewater Capital (CRD 24418)',
    status: 'Completed',
    reviewer: 'M. Chen',
  },
  {
    id: 'CE-002',
    timestamp: '2026-03-22T13:20:00Z',
    eventType: 'AML Alert',
    entity: 'TRD-2026-00843 - Horizon BioSciences',
    status: 'Escalated',
    reviewer: 'S. Patel',
  },
  {
    id: 'CE-003',
    timestamp: '2026-03-22T11:30:00Z',
    eventType: 'Trade Flag',
    entity: 'TRD-2026-00846 - Meridian Growth Series A',
    status: 'Pending',
    reviewer: 'Unassigned',
  },
  {
    id: 'CE-004',
    timestamp: '2026-03-22T10:05:00Z',
    eventType: 'Restriction Check',
    entity: 'Atlas Infrastructure Fund - Transfer Request',
    status: 'Completed',
    reviewer: 'J. Rodriguez',
  },
  {
    id: 'CE-005',
    timestamp: '2026-03-21T16:50:00Z',
    eventType: 'KYC Verified',
    entity: 'Apex Clearing (CRD 151823)',
    status: 'Completed',
    reviewer: 'M. Chen',
  },
  {
    id: 'CE-006',
    timestamp: '2026-03-21T14:15:00Z',
    eventType: 'SAR Filed',
    entity: 'TRD-2026-00842 - Atlas Infrastructure Fund',
    status: 'Completed',
    reviewer: 'K. Thompson',
  },
  {
    id: 'CE-007',
    timestamp: '2026-03-21T09:30:00Z',
    eventType: 'Offering Registered',
    entity: 'GreenTech Solar Preferred - Reg CF',
    status: 'Completed',
    reviewer: 'L. Kim',
  },
  {
    id: 'CE-008',
    timestamp: '2026-03-20T15:40:00Z',
    eventType: 'AML Alert',
    entity: 'TRD-2026-00842 - Atlas Infrastructure Fund',
    status: 'Resolved',
    reviewer: 'S. Patel',
  },
];

export const REGULATORY_FILINGS: Array<RegulatoryFiling> = [
  {
    name: 'FINRA OATS',
    status: 'Up to date',
    statusColor: 'green',
    detail: 'Last reported: March 22, 2026',
  },
  {
    name: 'ATS-N',
    status: 'Filed Q1 2026',
    statusColor: 'green',
    detail: 'Amendment 4 filed January 15, 2026',
  },
  {
    name: 'CAT Reporting',
    status: 'Active',
    statusColor: 'green',
    detail: 'Real-time reporting enabled. 99.97% uptime.',
  },
  {
    name: 'Form ATS',
    status: 'Annual filed',
    statusColor: 'green',
    detail: 'Annual amendment filed December 2025',
  },
];

export const SECURITY_TIMELINE_EVENTS: Record<string, Array<SecurityTimelineEvent>> = {
  'sec-001': [
    { date: '2025-09-15', description: 'Offering registered with SEC under Reg D 506(c)' },
    { date: '2025-10-01', description: 'First trade executed - 50,000 shares at $20.00' },
    { date: '2025-12-15', description: 'Board approved secondary transfer policy' },
    { date: '2026-01-20', description: 'Restriction waiver granted for institutional block trade' },
    { date: '2026-02-15', description: '409A valuation updated - $24.50 per share' },
  ],
  'sec-002': [
    { date: '2025-06-30', description: 'Fund II offering closed under Reg D 506(b)' },
    { date: '2025-07-15', description: 'First LP interest transfer recorded' },
    { date: '2025-11-30', description: 'Q3 NAV update distributed to LPs' },
    { date: '2026-01-31', description: 'Annual valuation completed - $112.75 per unit' },
  ],
  'sec-003': [
    { date: '2025-03-01', description: 'Reg A+ Tier 2 qualification effective' },
    { date: '2025-03-15', description: 'First public trade - 100,000 shares at $5.50' },
    { date: '2025-08-01', description: 'Semi-annual report filed with SEC' },
    { date: '2026-03-01', description: 'Annual report filed. Current price: $8.25' },
  ],
};

export const SECURITIES_STATS = {
  totalSecurities: 847,
  activeOfferings: 23,
  transferRestricted: 156,
  pendingSettlements: 12,
};

export const TRADES_STATS = {
  totalTrades: 12847,
  todayVolume: 1847329,
  pendingSettlement: 34,
  complianceFlags: 7,
};

export const COMPLIANCE_STATS = {
  kycVerifiedAccounts: 4291,
  activeAmlAlerts: 3,
  pendingReviews: 18,
  sarFiledYtd: 7,
};
