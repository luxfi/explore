import { Separator } from '@luxfi/ui/separator';
import React, { useState, useCallback, useMemo } from 'react';

import type { EssentialDappsChainConfig } from 'types/client/marketplace';
import type { AllowanceType } from 'types/client/revoke';

import { route } from 'nextjs/routes';

import useIsMobile from 'lib/hooks/useIsMobile';
import { Badge } from '@luxfi/ui/badge';
import { Heading } from '@luxfi/ui/heading';
import { Image } from '@luxfi/ui/image';
import { Link } from 'toolkit/next/link';
import { Skeleton } from '@luxfi/ui/skeleton';
import { Tooltip } from '@luxfi/ui/tooltip';
import TokenLogoPlaceholder from 'ui/shared/TokenLogoPlaceholder';

import type useApprovalsQuery from '../hooks/useApprovalsQuery';
import type useCoinBalanceQuery from '../hooks/useCoinBalanceQuery';
import AddressEntity from './AddressEntity';
import Approvals from './Approvals';

type Props = {
  searchAddress: string;
  selectedChain: EssentialDappsChainConfig | undefined;
  isAddressMatch: boolean;
  coinBalanceQuery: ReturnType<typeof useCoinBalanceQuery>;
  approvalsQuery: ReturnType<typeof useApprovalsQuery>;
};

const Content = ({
  searchAddress,
  selectedChain,
  isAddressMatch,
  coinBalanceQuery,
  approvalsQuery,
}: Props) => {
  const isMobile = useIsMobile();
  const [ hiddenApprovals, setHiddenApprovals ] = useState<Array<AllowanceType>>([]);

  const approvals = useMemo(() => {
    return approvalsQuery.data?.filter((approval) => !hiddenApprovals.includes(approval));
  }, [ approvalsQuery.data, hiddenApprovals ]);

  const totalValueAtRiskUsd = useMemo(() => {
    if (approvalsQuery.isPlaceholderData || !approvals) return 0;

    const maxValues: Record<`0x${ string }`, number> = {};

    approvals.forEach((item) => {
      const { address, valueAtRiskUsd } = item;

      if (!valueAtRiskUsd) return;

      if (
        maxValues[address] === undefined ||
        valueAtRiskUsd > maxValues[address]
      ) {
        maxValues[address] = valueAtRiskUsd;
      }
    });

    const sum = Object.values(maxValues).reduce((sum, val) => sum + val, 0);

    return Number(sum.toFixed(2)).toLocaleString();
  }, [ approvalsQuery.isPlaceholderData, approvals ]);

  const hideApproval = useCallback((approval: AllowanceType) => {
    setHiddenApprovals((prev) => [ ...prev, approval ]);
  }, []);

  return (
    <div className="flex flex-col w-full">
      <div
        className="flex flex-col lg:flex-row gap-2 -mt-2 pt-2 pb-6 bg-white dark:bg-black"
        style={ !isMobile && approvals?.length ? { position: 'sticky', top: 0, zIndex: 1 } : undefined }
      >
        <div className="flex flex-col items-start flex-1 bg-black/5 dark:bg-white/5 gap-3 p-6 rounded">
          <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-start md:justify-between w-full flex-wrap">
            <div className="flex gap-2 items-center">
              <AddressEntity
                address={{ hash: searchAddress }}
                truncation="constant"
                className="text-lg lg:text-xl font-medium"
                icon={{ size: isMobile ? undefined : 30 }}
                noLink
              />
              <Tooltip content="Connect a wallet to revoke approvals" disabled={ isAddressMatch } disableOnMobile>
                <Badge colorPalette={ isAddressMatch ? 'green' : 'gray' }>
                  { isAddressMatch ? 'Connected' : 'Not connected' }
                </Badge>
              </Tooltip>
            </div>
          </div>
          <div className="flex gap-3 items-center flex-wrap">
            <Skeleton
              loading={ coinBalanceQuery.isPlaceholderData }
              display="flex"
              className="gap-3"
            >
              { (coinBalanceQuery.isPlaceholderData ||
                coinBalanceQuery.data) && (
                <>
                  <div className="flex gap-2 items-center lg:ml-[5px]">
                    <Image
                      src={ coinBalanceQuery.data.coinImage }
                      alt={ coinBalanceQuery.data.symbol }
                      boxSize={ 5 }
                      fallback={ <TokenLogoPlaceholder/> }
                    />
                    <span className="text-sm font-medium">
                      { coinBalanceQuery.data.balance }{ ' ' }
                      { coinBalanceQuery.data.symbol }
                    </span>
                  </div>
                  <span className="text-sm font-medium text-[var(--color-text-secondary)]">
                    ${ coinBalanceQuery.data.balanceUsd }
                  </span>
                </>
              ) }
            </Skeleton>
            <Link
              href={ route({ pathname: '/address/[hash]', query: { hash: searchAddress } }, { chain: selectedChain, external: true }) }
              external
              className="text-sm font-medium"
              noIcon
            >
              View details
            </Link>
          </div>
        </div>
        <div className="flex w-full lg:w-[400px] bg-black/5 dark:bg-white/5 p-6 rounded">
          <div className="flex flex-col flex-1 justify-center items-center gap-2">
            <span className="text-sm font-medium text-[var(--color-text-secondary)]">
              Total approvals
            </span>
            <Skeleton
              loading={ approvalsQuery.isPlaceholderData }
              minW="40px"
              className="text-center"
            >
              <Heading level="3">
                { approvals?.length || 0 }
              </Heading>
            </Skeleton>
          </div>
          <Separator
            orientation="vertical"
            className="mx-4 md:mx-8"
          />
          <div className="flex flex-col flex-1 justify-center items-center gap-2">
            <span className="text-sm font-medium text-[var(--color-text-secondary)]">
              Total value at risk
            </span>
            <Skeleton
              loading={ approvalsQuery.isPlaceholderData }
              minW="40px"
              className="text-center"
            >
              <Heading level="3">
                ${ totalValueAtRiskUsd }
              </Heading>
            </Skeleton>
          </div>
        </div>
      </div>
      <Approvals
        selectedChain={ selectedChain }
        approvals={ approvals || [] }
        isLoading={ approvalsQuery.isPlaceholderData }
        isAddressMatch={ isAddressMatch }
        hideApproval={ hideApproval }
      />
    </div>
  );
};

export default Content;
