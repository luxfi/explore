import { clamp } from 'es-toolkit';
import React from 'react';

import type * as multichain from '@luxfi/multichain-aggregator-types';

import { Button } from '@luxfi/ui/button';
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from '@luxfi/ui/popover';
import { Tooltip } from '@luxfi/ui/tooltip';
import { ContentLoader } from 'toolkit/components/loaders/ContentLoader';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';
import EnsEntity from 'ui/shared/entities/ens/EnsEntity';
import IconSvg from 'ui/shared/IconSvg';
import useLazyLoadedList from 'ui/shared/pagination/useLazyLoadedList';

const DomainsGrid = ({ data }: { data: Array<multichain.Domain> }) => {
  return (
    <div
      className="mt-2"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${ clamp(data.length, 1, 2) }, 1fr)`,
        columnGap: '12px',
        rowGap: '14px',
      }}
    >
      { data.map((domain) => <EnsEntity key={ domain.name } domain={ domain.name } protocol={ domain.protocol } noLink/>) }
    </div>
  );
};

interface Props {
  isLoading: boolean;
  mainDomain: multichain.BasicDomainInfo | undefined;
  hash: string;
}

const MultichainAddressEnsDomains = ({ mainDomain, isLoading, hash }: Props) => {
  const rootRef = React.useRef<HTMLDivElement>(null);

  const popover = useDisclosure();

  const { cutRef, query: { data, isFetching, isError } } = useLazyLoadedList({
    rootRef,
    resourceName: 'multichainAggregator:address_domains',
    pathParams: { hash },
    queryOptions: {
      refetchOnMount: false,
    },
  });

  const items = data?.pages.map((page) => page.items).flat();

  if (!isLoading && (!items || items.length === 0)) {
    return null;
  }

  const totalRecords = data?.pages[0]?.items.length ?? 0;
  const totalRecordsPostfix = data?.pages[0]?.next_page_params ? '+' : '';
  const ownedDomains = (items ?? []).filter((domain) => domain.name !== mainDomain?.name);

  return (
    <PopoverRoot open={ popover.open } onOpenChange={ popover.onOpenChange }>
      <Tooltip content="List of names resolved or owned by this address" disabled={ popover.open } disableOnMobile closeOnClick>
        <div>
          <PopoverTrigger>
            <Button
              size="sm"
              variant="dropdown"
              aria-label="Address domains"
              className="font-medium shrink-0 gap-x-1"
              loadingSkeleton={ isLoading }
            >
              <IconSvg name="ENS" className="w-5 h-5"/>
              <span className="hidden xl:inline">{ totalRecords }{ totalRecordsPostfix } Domain{ totalRecords > 1 ? 's' : '' }</span>
              <span className="inline xl:hidden">{ totalRecords }{ totalRecordsPostfix }</span>
            </Button>
          </PopoverTrigger>
        </div>
      </Tooltip>
      <PopoverContent className="lg:w-[500px] max-h-[400px] overflow-y-auto" ref={ rootRef }>
        <PopoverBody className="text-sm flex flex-col gap-y-5 items-start">
          { mainDomain && (
            <div className="w-full">
              <span className="text-[var(--color-text-secondary)] text-xs">Primary*</span>
              <div className="flex items-center text-base mt-2">
                <EnsEntity
                  domain={ mainDomain.name }
                  protocol={ mainDomain.protocol }
                  className="font-semibold"
                  noCopy
                  noLink
                />
              </div>
            </div>
          ) }
          { ownedDomains.length > 0 && (
            <div>
              <span className="text-[var(--color-text-secondary)] text-xs">Owned by this address</span>
              <DomainsGrid data={ ownedDomains }/>
            </div>
          ) }

          { isFetching && <ContentLoader className="max-w-[200px] mt-3"/> }

          { isError && <span className="text-[var(--color-text-error)] mt-3">Something went wrong. Unable to load next page.</span> }

          <div className="h-0 w-[100px]" ref={ cutRef }/>

          { mainDomain && (
            <span className="text-xs -mt-1">
              *A domain name is not necessarily held by a person popularly associated with the name
            </span>
          ) }
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
};

export default React.memo(MultichainAddressEnsDomains);
