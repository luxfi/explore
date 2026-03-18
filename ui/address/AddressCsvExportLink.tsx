import React from 'react';

import type { CsvExportParams } from 'types/client/address';
import type { ClusterChainConfig } from 'types/multichain';

import { route } from 'nextjs/routes';

import config from 'configs/app';
import { useMultichainContext } from 'lib/contexts/multichain';
import useIsInitialLoading from 'lib/hooks/useIsInitialLoading';
import useIsMobile from 'lib/hooks/useIsMobile';
import { Link } from 'toolkit/chakra/link';
import { Tooltip } from 'toolkit/chakra/tooltip';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  address: string;
  params: CsvExportParams;
  className?: string;
  isLoading?: boolean;
  chainData?: ClusterChainConfig;
  // Chakra-style props forwarded from parent (ml, etc.) - kept for compat
  [key: string]: unknown;
}

const AddressCsvExportLink = ({ className, address, params, isLoading, chainData, ...rest }: Props) => {
  const isMobile = useIsMobile();
  const isInitialLoading = useIsInitialLoading(isLoading);
  const multichainContext = useMultichainContext();

  const chainConfig = chainData?.app_config || multichainContext?.chain.app_config || config;

  if (!chainConfig.features.csvExport.isEnabled) {
    return null;
  }

  return (
    <Tooltip disabled={ !isMobile } content="Download CSV">
      <Link
        className={ className }
        whiteSpace="nowrap"
        href={ route({ pathname: '/csv-export', query: { ...params, address } }, { chain: chainData ?? multichainContext?.chain }) }
        flexShrink={ 0 }
        loading={ isInitialLoading }
        minW={ 8 }
        justifyContent="center"
        textStyle="sm"
        { ...rest }
      >
        <IconSvg name="files/csv" boxSize={ 5 }/>
        <span className="ml-1 hidden lg:inline">Download</span>
      </Link>
    </Tooltip>
  );
};

export default React.memo(AddressCsvExportLink);
