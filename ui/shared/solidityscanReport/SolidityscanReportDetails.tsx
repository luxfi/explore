import React from 'react';

import type { SolidityScanReportSeverityDistribution } from 'lib/solidityScan/schema';

type DistributionItem = {
  id: keyof SolidityScanReportSeverityDistribution;
  name: string;
  color: string;
};

const DISTRIBUTION_ITEMS: Array<DistributionItem> = [
  { id: 'critical', name: 'Critical', color: '#891F11' },
  { id: 'high', name: 'High', color: '#EC672C' },
  { id: 'medium', name: 'Medium', color: '#FBE74D' },
  { id: 'low', name: 'Low', color: '#68C88E' },
  { id: 'informational', name: 'Informational', color: '#A3AEBE' },
  { id: 'gas', name: 'Gas', color: '#A47585' },
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
      <div w={ 3 } h={ 3 } bg={ item.color } borderRadius="6px" className="mr-2"></div>
      <div className="flex justify-between mr-3">
        <span>{ item.name }</span>
        <span style={{ color: vulnerability > 0 ? 'text.primary' : 'text.secondary'  }}>{ vulnerabilities[item.id] }</span>
      </div>
      <div className="bg-[var(--color-blackAlpha-50)] dark:bg-[var(--color-whiteAlpha-50)]" className="h-[10px]" borderRadius="8px">
        <div bg={ item.color } style={{ width: `${ vulnerability / vulnerabilitiesCount * 100 }%` }} className="h-[10px]" borderRadius="8px"/>
      </div>
    </>
  );
};

const SolidityscanReportDetails = ({ vulnerabilities, vulnerabilitiesCount }: Props) => {
  return (
    <div className="grid items-center gap-y-2" templateColumns="20px 1fr 100px">
      { DISTRIBUTION_ITEMS.map(item => (
        <SolidityScanReportItem item={ item } key={ item.id } vulnerabilities={ vulnerabilities } vulnerabilitiesCount={ vulnerabilitiesCount }/>
      )) }
    </div>
  );
};

export default SolidityscanReportDetails;
