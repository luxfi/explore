import React from 'react';

import { cn } from 'lib/utils/cn';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from '@luxfi/ui/skeleton';

interface ChainRowProps {
  readonly name: string;
  readonly fullName?: string;
  readonly blockchainId?: string;
  readonly subnetId?: string;
  readonly vmId?: string;
  readonly vmLabel?: string;
  readonly chainId?: number | null;
  readonly isActive?: boolean;
  readonly isLoading?: boolean;
  readonly href?: string;
}

const TRUNCATE_PREFIX_LEN = 8;
const TRUNCATE_SUFFIX_LEN = 4;

function truncateId(id: string): string {
  if (id.length <= TRUNCATE_PREFIX_LEN + TRUNCATE_SUFFIX_LEN + 3) {
    return id;
  }
  return `${ id.slice(0, TRUNCATE_PREFIX_LEN) }...${ id.slice(-TRUNCATE_SUFFIX_LEN) }`;
}

const ChainRow = ({
  name,
  fullName,
  blockchainId,
  subnetId,
  vmLabel,
  chainId,
  isActive = true,
  isLoading = false,
  href,
}: ChainRowProps) => {
  const row = (
    <Skeleton loading={ isLoading }>
      <div
        className={ cn(
          'flex items-center py-3 px-4 border-b border-[var(--color-border-divider)]',
          'hover:bg-[var(--color-gray-50)] dark:hover:bg-[var(--color-whiteAlpha-50)]',
          'transition-colors duration-150 gap-4 flex-wrap lg:flex-nowrap',
          href ? 'cursor-pointer' : 'cursor-default',
        ) }
      >
        { /* Name column */ }
        <div className="flex flex-col min-w-full lg:min-w-[180px] lg:max-w-[220px] shrink-0">
          <div className="font-semibold text-sm text-[var(--color-text-primary)]">
            { name }
          </div>
          { fullName && (
            <div className="text-xs text-[var(--color-text-secondary)] mt-0.5">
              { fullName }
            </div>
          ) }
        </div>

        { /* Blockchain ID column */ }
        <div
          className="flex-1 min-w-0 font-mono text-sm text-[var(--color-text-secondary)] overflow-hidden text-ellipsis whitespace-nowrap"
          title={ blockchainId }
        >
          { blockchainId ? truncateId(blockchainId) : '\u2014' }
        </div>

        { /* Subnet ID column */ }
        <div
          className="flex-1 min-w-0 font-mono text-sm text-[var(--color-text-secondary)] overflow-hidden text-ellipsis whitespace-nowrap hidden lg:block"
          title={ subnetId }
        >
          { subnetId ? truncateId(subnetId) : '\u2014' }
        </div>

        { /* VM badge */ }
        <div className="flex items-center gap-2 shrink-0">
          { vmLabel && (
            <div className="bg-[var(--color-gray-100)] dark:bg-[var(--color-whiteAlpha-100)] text-[var(--color-text-secondary)] rounded-sm px-2 py-0.5 text-xs font-mono whitespace-nowrap">
              { vmLabel }
            </div>
          ) }
          { chainId != null && (
            <div className="bg-[var(--color-gray-100)] dark:bg-[var(--color-whiteAlpha-100)] text-[var(--color-text-secondary)] rounded-sm px-2 py-0.5 text-xs font-mono whitespace-nowrap">
              { chainId }
            </div>
          ) }
        </div>

        { /* Status indicator + arrow */ }
        <div className="flex items-center gap-2 shrink-0 ml-0 lg:ml-auto">
          <div className={ cn('w-2 h-2 rounded-full', isActive ? 'bg-green-400' : 'bg-gray-400') }/>
          { href && (
            <div className="text-[var(--color-text-secondary)] text-sm">{ '\u2192' }</div>
          ) }
        </div>
      </div>
    </Skeleton>
  );

  if (href) {
    return <Link href={ href } variant="plain">{ row }</Link>;
  }

  return row;
};

export default React.memo(ChainRow);
