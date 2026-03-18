import React from 'react';

import type { EntityTag as TEntityTag } from './types';

import config from 'configs/app';
import useIsMobile from 'lib/hooks/useIsMobile';
import { Badge } from 'toolkit/chakra/badge';
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from 'toolkit/chakra/popover';

import EntityTag from './EntityTag';

interface Props {
  className?: string;
  tags: Array<TEntityTag>;
  addressHash?: string;
  isLoading?: boolean;
  noColors?: boolean;
}

const EntityTags = ({ tags, addressHash, className, isLoading, noColors }: Props) => {
  const isMobile = useIsMobile();
  const visibleNum = isMobile ? 2 : 3;

  const metaSuitesPlaceholder = config.features.metasuites.isEnabled ?
    <div className="hidden" id="meta-suites__address-tag" data-ready={ !isLoading }/> :
    null;

  if (tags.length === 0) {
    return metaSuitesPlaceholder;
  }

  const tagMaxW = (() => {
    if (tags.length === 1) {
      return { base: '100%', lg: '300px' };
    }

    if (tags.length === 2) {
      return { base: 'calc((100% - 8px) / 2)', lg: '300px' };
    }
    return { base: 'calc((100% - 40px) / 2)', lg: '300px' };
  })();

  const content = (() => {
    if (tags.length > visibleNum) {
      return (
        <>
          { tags.slice(0, visibleNum).map((tag) => (
            <EntityTag
              key={ tag.slug }
              data={ tag }
              addressHash={ addressHash }
              isLoading={ isLoading }
              maxW={ tagMaxW }
              noColors={ noColors }
            />
          )) }
          { metaSuitesPlaceholder }
          <PopoverRoot>
            <PopoverTrigger>
              <Badge loading={ isLoading } className="cursor-pointer hover:text-[var(--color-hover)]">
                +{ tags.length - visibleNum }
              </Badge>
            </PopoverTrigger>
            <PopoverContent className="max-w-[300px] w-fit">
              <PopoverBody>
                <div className="flex flex-wrap gap-x-2 gap-y-2">
                  { tags.slice(visibleNum).map((tag) => <EntityTag key={ tag.slug } data={ tag } addressHash={ addressHash } noColors={ noColors }/>) }
                </div>
              </PopoverBody>
            </PopoverContent>
          </PopoverRoot>
        </>
      );
    }

    return (
      <>
        { tags.map((tag) => (
          <EntityTag
            key={ tag.slug }
            data={ tag }
            addressHash={ addressHash }
            isLoading={ isLoading }
            maxW={ tagMaxW }
            noColors={ noColors }
          />
        )) }
        { metaSuitesPlaceholder }
      </>
    );
  })();

  return (
    <div className="flex items-center flex-nowrap overflow-hidden gap-x-2 gap-y-2 grow" className={ className } maxW="100%">
      { content }
    </div>
  );
};

export default React.memo(EntityTags);
