import React from 'react';

import type { FeaturedNetwork, NetworkGroup } from 'types/networks';

import config from 'configs/app';
import { Link } from 'toolkit/chakra/link';
import { PopoverBody, PopoverContent } from '@luxfi/ui/popover';
import { Skeleton } from '@luxfi/ui/skeleton';
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from '@luxfi/ui/tabs';

import NetworkMenuLink from './NetworkMenuLink';

interface Props {
  tabs: Array<NetworkGroup>;
  items?: Array<FeaturedNetwork>;
}

const NetworkMenuContent = ({ items, tabs }: Props) => {
  const selectedNetwork = items?.find(({ isActive }) => isActive);
  const defaultTab = tabs.find((tab) => selectedNetwork?.group === tab);

  const [ value, setValue ] = React.useState<NetworkGroup>(defaultTab ?? 'Mainnets');

  const handleTabChange = React.useCallback(({ value }: { value: string }) => {
    setValue(value as NetworkGroup);
  }, []);

  const content = (() => {
    if (!items || items.length === 0) {
      return (
        <>
          <div className="flex items-center">
            <div className="flex h-8 w-[105px] bg-[var(--color-blackAlpha-50)] dark:bg-[var(--color-whiteAlpha-50)] rounded-base px-4 py-2">
              <Skeleton loading h="16px" w="100%"/>
            </div>
            <Skeleton loading className="mx-4" h="16px" w="68px"/>
            <Skeleton loading className="mx-4" h="16px" w="45px"/>
          </div>
          <div className="flex mt-3 flex-col gap-y-2">
            <div className="flex mx-3 my-2 items-center">
              <Skeleton loading h="30px" w="30px" borderRadius="full"/>
              <Skeleton loading h="16px" w="120px" ml={ 3 }/>
            </div>
            <div className="flex mx-3 my-2 items-center">
              <Skeleton loading h="30px" w="30px" borderRadius="full"/>
              <Skeleton loading h="16px" w="180px" ml={ 3 }/>
            </div>
            <div className="flex mx-3 my-2 items-center">
              <Skeleton loading h="30px" w="30px" borderRadius="full"/>
              <Skeleton loading h="16px" w="150px" ml={ 3 }/>
            </div>
          </div>
        </>
      );
    }

    const viewAllLink = config.UI.featuredNetworks.allLink && (
      <Link
        href={ config.UI.featuredNetworks.allLink }
        external
        noIcon
        variant="secondary"
        className="my-2 px-2 text-xs"
      >
        View all chains
      </Link>
    );

    if (tabs.length === 1) {
      return (
        <ul className="flex flex-col gap-1 items-stretch overflow-y-scroll max-h-[516px]">
          { items
            .filter((network) => network.group === tabs[0])
            .map((network) => (
              <NetworkMenuLink
                key={ network.title }
                { ...network }
              />
            )) }
          { viewAllLink }
        </ul>
      );
    }

    if (config.UI.featuredNetworks.mode === 'list') {
      return (
        <div className="flex flex-col overflow-y-scroll max-h-[516px] items-stretch gap-3">
          { tabs.map((tab, index) => {
            return (
              <div key={ tab }>
                <span className="text-sm font-semibold block mb-2">{ tab }</span>
                <ul className="flex flex-col gap-1 items-stretch">
                  { items
                    .filter((network) => network.group === tab)
                    .map((network) => (
                      <NetworkMenuLink
                        key={ network.title }
                        { ...network }
                      />
                    )) }
                  { index === tabs.length - 1 && viewAllLink }
                </ul>
              </div>
            );
          }) }
        </div>
      );
    }

    return (
      <TabsRoot
        variant="segmented"
        className="w-full"
        fitted
        size="sm"
        lazyMount
        value={ value }
        onValueChange={ handleTabChange }
      >
        { tabs.length > 1 && (
          <TabsList className="mb-2 w-full">
            { tabs.map((tab) => (
              <TabsTrigger
                key={ tab }
                className="capitalize"
                value={ tab }
              >
                { tab }
              </TabsTrigger>
            )) }
          </TabsList>
        ) }
        <div>
          { tabs.map((tab) => (
            <TabsContent key={ tab } value={ tab } className="p-0">
              <ul className="flex flex-col gap-1 items-stretch overflow-y-scroll max-h-[516px]">
                { items
                  .filter((network) => network.group === tab)
                  .map((network) => (
                    <NetworkMenuLink
                      key={ network.title }
                      { ...network }
                    />
                  )) }
                { viewAllLink }
              </ul>
            </TabsContent>
          )) }
        </div>
      </TabsRoot>
    );
  })();

  return (
    <PopoverContent style={{ width: '290px', maxHeight: 'unset' }}>
      <PopoverBody>
        { content }
      </PopoverBody>
    </PopoverContent>
  );
};

export default React.memo(NetworkMenuContent);
