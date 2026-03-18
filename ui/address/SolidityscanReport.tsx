import React from 'react';

// This icon doesn't work properly when it is in the sprite
// Probably because of the gradient
// eslint-disable-next-line no-restricted-imports
import SolidityScanIcon from 'icons/brands/solidity_scan.svg';
import useFetchReport from 'lib/solidityScan/useFetchReport';
import { Link } from 'toolkit/chakra/link';
import { PopoverBody, PopoverContent, PopoverRoot } from 'toolkit/chakra/popover';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';
import SolidityscanReportButton from 'ui/shared/solidityscanReport/SolidityscanReportButton';
import SolidityscanReportDetails from 'ui/shared/solidityscanReport/SolidityscanReportDetails';
import SolidityscanReportScore from 'ui/shared/solidityscanReport/SolidityscanReportScore';

interface Props {
  hash: string;
}

const SolidityscanReport = ({ hash }: Props) => {
  const popover = useDisclosure();
  const { data, isPlaceholderData, isError } = useFetchReport({ hash });

  if (isError || !data) {
    return null;
  }

  const score = Number(data.scan_report.scan_summary.score_v2);

  if (!score) {
    return null;
  }

  const vulnerabilities = data.scan_report.scan_summary.issue_severity_distribution;
  const vulnerabilitiesCounts = vulnerabilities ? Object.values(vulnerabilities) : [];
  const vulnerabilitiesCount = vulnerabilitiesCounts.reduce((acc, val) => acc + val, 0);

  return (
    <PopoverRoot open={ popover.open } onOpenChange={ popover.onOpenChange }>
      <SolidityscanReportButton
        score={ score }
        isLoading={ isPlaceholderData }
        tooltipDisabled={ popover.open }
      />
      <PopoverContent className="w-screen lg:w-[328px]">
        <PopoverBody className="text-sm">
          <div className="mb-5 leading-[25px]">
            Contract analyzed for 240+ vulnerability patterns by
            <span className="inline-block align-middle mr-1 ml-[6px] w-[23px] h-[20px]"><SolidityScanIcon/></span>
            <span className="font-semibold inline-block">SolidityScan</span>
          </div>
          <SolidityscanReportScore score={ score } className="mb-5"/>
          { vulnerabilities && vulnerabilitiesCount > 0 && (
            <div className="mb-5">
              <span className="py-[7px] text-[var(--color-text-secondary)] text-xs font-medium">Vulnerabilities distribution</span>
              <SolidityscanReportDetails vulnerabilities={ vulnerabilities } vulnerabilitiesCount={ vulnerabilitiesCount }/>
            </div>
          ) }
          <Link href={ data.scan_report.scanner_reference_url } external>View full report</Link>
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
};

export default React.memo(SolidityscanReport);
