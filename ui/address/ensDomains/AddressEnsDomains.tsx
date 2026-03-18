import type { UseQueryResult } from '@tanstack/react-query';
import { clamp } from 'es-toolkit';
import React from 'react';

import type * as bens from '@luxfi/bens-types';

import { route } from 'nextjs-routes';

import type { ResourceError } from 'lib/api/resources';
import dayjs from 'lib/date/dayjs';
import { Button } from '@luxfi/ui/button';
import { Link } from 'toolkit/next/link';
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from '@luxfi/ui/popover';
import { Skeleton } from '@luxfi/ui/skeleton';
import { Tooltip } from '@luxfi/ui/tooltip';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';
import EnsEntity from 'ui/shared/entities/ens/EnsEntity';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  query: UseQueryResult<bens.LookupAddressResponse, ResourceError<unknown>>;
  addressHash: string;
  mainDomainName: string | null | undefined;
}

const DomainsGrid = ({ data }: { data: Array<bens.Domain> }) => {
  return (
    <div
      className="gap-x-8 gap-y-4 mt-2 grid"
      style={{ gridTemplateColumns: `repeat(${ clamp(data.length, 1, 2) }, 1fr)` }}
    >
      { data.slice(0, 9).map((domain) => <EnsEntity key={ domain.id } domain={ domain.name } protocol={ domain.protocol } noCopy/>) }
    </div>
  );
};

const AddressEnsDomains = ({ query, addressHash, mainDomainName }: Props) => {
  const { data, isPending, isError } = query;
  const popover = useDisclosure();

  if (isError) {
    return null;
  }

  if (isPending) {
    return <Skeleton loading={ true } h="32px" w="50px" className="xl:w-[120px]" borderRadius="base"/>;
  }

  if (!data || data.items.length === 0) {
    return null;
  }

  const mainDomain = data.items.find((domain) => mainDomainName && domain.name === mainDomainName);
  const ownedDomains = data.items.filter((domain) => {
    if (mainDomainName && domain.name === mainDomainName) {
      return false;
    }

    // exclude resolved address
    if (domain.resolved_address && domain.resolved_address.hash.toLowerCase() === addressHash.toLowerCase()) {
      return false;
    }

    if (domain.owner && domain.owner.hash.toLowerCase() === addressHash.toLowerCase()) {
      return true;
    }

    // include wrapped owner
    if (domain.wrapped_owner?.hash.toLowerCase() === addressHash.toLowerCase()) {
      return !domain.resolved_address || domain.resolved_address.hash.toLowerCase() !== addressHash.toLowerCase();
    }

    return false;
  });
  const resolvedDomains = data.items.filter((domain) =>
    domain.resolved_address &&
    domain.resolved_address.hash.toLowerCase() === addressHash.toLowerCase() &&
    domain.name !== mainDomainName,
  );

  const totalRecords = data.items.length > 40 ? '40+' : data.items.length;

  return (
    <PopoverRoot open={ popover.open } onOpenChange={ popover.onOpenChange }>
      <Tooltip content="List of names resolved or owned by this address" disabled={ popover.open } disableOnMobile closeOnClick>
        <div>
          <PopoverTrigger>
            <Button
              size="sm"
              variant="dropdown"
              aria-label="Address domains"
              className="font-medium shrink-0 gap-1"
            >
              <IconSvg name="ENS" className="w-5 h-5"/>
              <span className="hidden xl:inline">{ totalRecords } Domain{ data.items.length > 1 ? 's' : '' }</span>
              <span className="xl:hidden">{ totalRecords }</span>
            </Button>
          </PopoverTrigger>
        </div>
      </Tooltip>
      <PopoverContent className="lg:w-[500px]">
        <PopoverBody className="text-sm flex flex-col gap-y-5 items-start">
          { mainDomain && (
            <div className="w-full">
              <span className="text-[var(--color-text-secondary)] text-xs">Primary*</span>
              <div className="flex items-center text-base mt-2">
                <EnsEntity domain={ mainDomain.name } protocol={ mainDomain.protocol } className="font-semibold" noCopy/>
                { mainDomain.expiry_date &&
                    <span className="text-[var(--color-text-secondary)] whitespace-pre"> (expires { dayjs(mainDomain.expiry_date).fromNow() })</span> }
              </div>
            </div>
          ) }
          { ownedDomains.length > 0 && (
            <div>
              <span className="text-[var(--color-text-secondary)] text-xs">Owned by this address</span>
              <DomainsGrid data={ ownedDomains }/>
            </div>
          ) }
          { resolvedDomains.length > 0 && (
            <div>
              <span className="text-[var(--color-text-secondary)] text-xs">Resolved to this address</span>
              <DomainsGrid data={ resolvedDomains }/>
            </div>
          ) }
          { (ownedDomains.length > 9 || resolvedDomains.length > 9) && (
            <Link
              href={ route({ pathname: '/name-services', query: { tab: 'domains', owned_by: 'true', resolved_to: 'true', address: addressHash } }) }
            >
              <span> More results</span>
              <span className="text-[var(--color-text-secondary)]"> ({ totalRecords })</span>
            </Link>
          ) }
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

export default React.memo(AddressEnsDomains);
