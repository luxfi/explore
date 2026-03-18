import { useCallback } from 'react';

import type { Address3rdPartyWidget } from 'types/views/address';

import config from 'configs/app';
import * as mixpanel from 'lib/mixpanel/index';
import { cn } from 'lib/utils/cn';
import { Image } from '@luxfi/ui/image';
import { LinkBox, LinkOverlay } from 'toolkit/chakra/link';
import { Separator } from '@luxfi/ui/separator';
import { Skeleton } from '@luxfi/ui/skeleton';
import { Hint } from 'toolkit/components/Hint/Hint';
import { ndash } from 'toolkit/utils/htmlEntities';
import IconSvg from 'ui/shared/IconSvg';

import useWidgetData from './useWidgetData';

type Props = {
  name: string;
  config: Address3rdPartyWidget | undefined;
  address: string;
  isLoading: boolean;
};

const chainId = config.chain.id || '';

function formatUrl(tpl: string, ctx: Record<string, string>) {
  return tpl.replace(/\{\s*(\w+)\s*\}/g, (_, key) => ctx[key] ?? '');
}

const Address3rdPartyWidgetCard = ({ name, config, address, isLoading }: Props) => {
  const { data, isLoading: isDataLoading } = useWidgetData(name, config?.valuePath, address, isLoading);

  const handleClick = useCallback(() => {
    mixpanel.logEvent(mixpanel.EventTypes.ADDRESS_WIDGET, { Name: name });
  }, [ name ]);

  if (!config) {
    return null;
  }

  const url = formatUrl(config.url, {
    address,
    addressLowercase: address.toLowerCase(),
    chainId: config.chainIds?.[chainId] ?? chainId,
  });

  const [ integer, decimal ] = data?.split('.') || [];

  const content = isLoading ? (
    <>
      <Skeleton loading w="88px" h="40px" mb={ 1 }/>
      <Skeleton loading w="178px" h="20px"/>
      <Separator className="mt-3 mb-2 border-black/5 dark:border-white/10"/>
      <div className="flex items-center gap-2">
        <Skeleton loading w="20px" h="20px"/>
        <Skeleton loading w="80px" h="20px"/>
      </div>
    </>
  ) : (
    <>
      <LinkOverlay href={ url } external onClick={ handleClick } noIcon/>
      <Skeleton loading={ isDataLoading } minW="88px" alignSelf="flex-start">
        { data ? (
          <span
            className={ cn(
              'text-[32px] leading-[40px] font-medium tracking-[-0.5px] overflow-hidden text-ellipsis whitespace-nowrap block',
              integer === '0' && !decimal ? 'text-[var(--chakra-colors-text-secondary)]' : 'text-[var(--chakra-colors-text-primary)]',
            ) }
          >
            { integer }
            { decimal && (
              <>
                .
                <span className="text-[var(--chakra-colors-text-secondary)]">
                  { decimal }
                </span>
              </>
            ) }
          </span>
        ) : (
          <span className="text-[32px] leading-[40px] font-medium tracking-[-0.5px] text-[var(--chakra-colors-text-secondary)] opacity-20">{ ndash }</span>
        ) }
      </Skeleton>
      <div className="flex items-center gap-1 mt-1">
        <span className="text-sm">{ config.title }</span>
        { config.hint && (
          <Hint
            label={ config.hint }
            tooltipProps={{ positioning: { placement: 'bottom' } }}
          />
        ) }
      </div>
      <Separator className="mt-3 mb-2 border-black/5 dark:border-white/10"/>
      <div className="flex items-center gap-2">
        <Image src={ config.icon } alt={ config.name } boxSize={ 5 }/>
        <div className="flex items-center justify-between flex-1">
          <span className="text-xs text-[var(--chakra-colors-text-secondary)] group-hover:text-[var(--chakra-colors-hover)]">
            { config.name }
          </span>
          <IconSvg
            name="link_external"
            className="w-3 h-3 text-[var(--color-hover)] hidden group-hover:block"
          />
        </div>
      </div>
    </>
  );

  return (
    <LinkBox
      className={ cn(
        'group flex flex-col p-3 rounded-md border border-solid transition-[border-color] duration-200',
        isLoading
          ? 'cursor-default border-black/5 dark:border-white/10 bg-transparent'
          : 'cursor-pointer border-transparent bg-black/5 dark:bg-white/10 hover:border-black/20 dark:hover:border-white/20',
      ) }
    >
      { content }
    </LinkBox>
  );
};

export default Address3rdPartyWidgetCard;
