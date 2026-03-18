import { useRouter } from 'next/router';
import React from 'react';

import type { MarketplaceApp } from 'types/client/marketplace';

import { route } from 'nextjs-routes';

import highlightText from 'lib/highlightText';
import { useColorModeValue } from 'toolkit/chakra/color-mode';
import { Image } from '@luxfi/ui/image';
import IconSvg from 'ui/shared/IconSvg';

import SearchBarSuggestItemLink from './SearchBarSuggestItemLink';
interface Props {
  data: MarketplaceApp;
  isMobile: boolean | undefined;
  searchTerm: string;
  onClick: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

const SearchBarSuggestApp = ({ data, isMobile, searchTerm, onClick }: Props) => {
  const router = useRouter();
  const logo = (
    <Image
      borderRadius="base"
      boxSize={ 5 }
      src={ useColorModeValue(data.logo, data.logoDarkMode || data.logo) }
      alt={ `${ data.title } app icon` }
    />
  );

  const content = (() => {
    if (isMobile) {
      return (
        <>
          <div className="flex items-center">
            { logo }
            <span className="font-bold overflow-hidden whitespace-nowrap text-ellipsis ml-2">
              <span dangerouslySetInnerHTML={{ __html: highlightText(data.title, searchTerm) }}/>
            </span>
            { data.external && <IconSvg name="link_external" className="w-3 h-3 align-middle shrink-0 text-[var(--color-icon-secondary)]"/> }
          </div>
          <p className="text-[var(--color-text-secondary)] line-clamp-3">
            { data.description }
          </p>
        </>
      );
    }
    return (
      <div className="flex gap-2 items-center">
        { logo }
        <span className="font-bold overflow-hidden whitespace-nowrap text-ellipsis w-[200px] shrink-0">
          <span dangerouslySetInnerHTML={{ __html: highlightText(data.title, searchTerm) }}/>
        </span>
        <span className="text-[var(--color-text-secondary)] overflow-hidden whitespace-nowrap text-ellipsis grow">
          { data.description }
        </span>
        { data.external && (
          <IconSvg
            name="link_external"
            className="w-3 h-3 align-middle shrink-0 text-[var(--color-icon-secondary)]"
          />
        ) }
      </div>
    );
  })();

  return (
    <SearchBarSuggestItemLink
      onClick={ onClick }
      href={ data.external ? route({ pathname: '/apps', query: { selectedAppId: data.id } }) : route({ pathname: '/apps/[id]', query: { id: data.id } }) }
      shallow={ data.external && router.pathname === '/apps' }
    >
      { content }
    </SearchBarSuggestItemLink>
  );
};

export default React.memo(SearchBarSuggestApp);
