import React from 'react';

import type { SolidityScanReportSeverityDistribution } from 'lib/solidityScan/schema';

type DistributionItem = {
  id: keyof SolidityScanReportSeverityDistribution;
  name: string;
  color: string;
};

// Severity is ORDERED data, so it reads as one sequential ramp: darkest is
// worst. Only `critical` keeps a hue, because red is the one state colour Lux
// spends on danger. The warm middle of this scale is gone — it used to be
// high #EC672C, medium #FBE74D, low #68C88E, informational #A3AEBE, gas
// #A47585, six unrelated hues pretending to be a scale.
const DISTRIBUTION_ITEMS: Array<DistributionItem> = [
  { id: 'critical', name: 'Critical', color: 'var(--color-status-bad)' },
  { id: 'high', name: 'High', color: 'var(--color-gray-800)' },
  { id: 'medium', name: 'Medium', color: 'var(--color-gray-600)' },
  { id: 'low', name: 'Low', color: 'var(--color-gray-500)' },
  { id: 'informational', name: 'Informational', color: 'var(--color-gray-400)' },
  { id: 'gas', name: 'Gas', color: 'var(--color-gray-300)' },
];

interface Props {
  vulnerabilities: SolidityScanReportSeverityDistribution;
  vulnerabilitiesCount: number;
}

type ItemProps = {
  item: DistributionItem;
  vulnerabilities: SolidityScanReportSeverityDistribution;
  vulnerabilitiesCount: number;
};

const SolidityScanReportItem = ({ item, vulnerabilities, vulnerabilitiesCount }: ItemProps) => {
  const vulnerability = vulnerabilities[item.id];

  if (vulnerability === undefined) {
    return null;
  }

  return (
    <>
      <div className="mr-2" style={{ width: '12px', height: '12px', backgroundColor: item.color, borderRadius: '6px' }}/>
      <div className="flex justify-between mr-3">
        <span>{ item.name }</span>
        <span style={{ color: vulnerability > 0 ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}>{ vulnerabilities[item.id] }</span>
      </div>
      <div className="bg-[var(--color-blackAlpha-50)] dark:bg-[var(--color-whiteAlpha-50)] h-[10px] rounded-lg">
        <div className="h-[10px] rounded-lg" style={{ width: `${ vulnerability / vulnerabilitiesCount * 100 }%`, backgroundColor: item.color }}/>
      </div>
    </>
  );
};

const SolidityscanReportDetails = ({ vulnerabilities, vulnerabilitiesCount }: Props) => {
  return (
    <div className="grid items-center gap-y-2" style={{ gridTemplateColumns: '20px 1fr 100px' }}>
      { DISTRIBUTION_ITEMS.map(item => (
        <SolidityScanReportItem item={ item } key={ item.id } vulnerabilities={ vulnerabilities } vulnerabilitiesCount={ vulnerabilitiesCount }/>
      )) }
    </div>
  );
};

export default SolidityscanReportDetails;
