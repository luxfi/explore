import React from 'react';

import type * as multichain from '@luxfi/multichain-aggregator-types';

import { route } from 'nextjs/routes';

import multichainConfig from 'configs/multichain';
import { Button } from '@luxfi/ui/button';
import { Link } from 'toolkit/next/link';
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from '@luxfi/ui/popover';
import ChainIcon from 'ui/shared/externalChains/ChainIcon';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  addressHash: string;
  data: multichain.GetAddressResponse | undefined;
  isLoading: boolean;
}

const ClusterChainsPopover = ({ addressHash, data, isLoading }: Props) => {

  if (!data) {
    return null;
  }

  const chains = multichainConfig()?.chains;
  const activeChainsIds = Object.keys(data.chain_infos ?? {});
  const activeChains = chains?.filter((chain) => activeChainsIds.includes(String(chain.id))) ?? [];

  if (!isLoading && activeChains.length === 0) {
    return null;
  }

  return (
    <PopoverRoot>
      <div>
        <PopoverTrigger>
          <Button
            size="sm"
            variant="dropdown"
            aria-label="Chains this address has interacted with"
            className="px-2 font-medium shrink-0 gap-x-1"
            loadingSkeleton={ isLoading }
          >
            <IconSvg name="pie_chart" className="w-5 h-5"/>
            { activeChains.length } Chain{ activeChains.length > 1 ? 's' : '' }
          </Button>
        </PopoverTrigger>
      </div>
      <PopoverContent className="w-auto max-h-[400px] overflow-y-auto">
        <PopoverBody >
          <span className="text-[var(--color-text-secondary)] text-xs">Chains this address has interacted with</span>
          <div className="flex flex-col gap-2 mt-1 items-start">
            { activeChains.map((chain) => (
              <Link
                key={ chain.id }
                href={ route({
                  pathname: '/address/[hash]',
                  query: {
                    hash: addressHash,
                    utm_source: 'multichain-explorer',
                    utm_medium: 'address',
                  },
                }, { chain, external: true }) }
                external
                className="flex items-center py-[7px]"
              >
                <ChainIcon data={ chain } mr={ 2 }/>
                { chain.name }
              </Link>
            )) }
          </div>
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
};

export default React.memo(ClusterChainsPopover);
