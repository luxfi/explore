import { useRouter } from 'next/router';
import type { FormEvent } from 'react';
import React from 'react';

import type { Route } from 'nextjs-routes';
import { route } from 'nextjs-routes';

import * as mixpanel from 'lib/mixpanel/index';
import { getRecentSearchKeywords, saveToRecentKeywords } from 'lib/recentSearchKeywords';
import { Button } from '@luxfi/ui/button';
import {
  DrawerRoot,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerCloseTrigger,
  DrawerBody,
  DrawerFooter,
} from '@luxfi/ui/drawer';
import { Link } from 'toolkit/next/link';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';
import IconSvg from 'ui/shared/IconSvg';
import SearchBarInput from 'ui/snippets/searchBar/SearchBarInput';

import SearchBarRecentKeywords from './SearchBarRecentKeywords';
import SearchBarSuggest from './SearchBarSuggest/SearchBarSuggest';
import useQuickSearchQuery from './useQuickSearchQuery';

type Props = {
  isHeroBanner?: boolean;
  onGoToSearchResults?: (searchTerm: string) => void;
};

const SearchBarMobile = ({ isHeroBanner, onGoToSearchResults }: Props) => {
  const inputRef = React.useRef<HTMLFormElement>(null);
  const router = useRouter();

  const { open, onOpen, onClose, onOpenChange } = useDisclosure();
  const { searchTerm, debouncedSearchTerm, handleSearchTermChange, query, zetaChainCCTXQuery, externalSearchItem } = useQuickSearchQuery();
  const recentSearchKeywords = getRecentSearchKeywords();

  const navigateToResults = React.useCallback((redirect: boolean) => {
    if (searchTerm) {
      const resultRoute: Route = { pathname: '/search-results', query: { q: searchTerm, redirect: redirect ? 'true' : 'false' } };
      const url = route(resultRoute);
      mixpanel.logEvent(mixpanel.EventTypes.SEARCH_QUERY, {
        'Search query': searchTerm,
        'Source page type': mixpanel.getPageType(router.pathname),
        'Result URL': url,
      });
      saveToRecentKeywords(searchTerm);
      router.push(resultRoute, undefined, { shallow: true });
      onGoToSearchResults?.(searchTerm);
      onClose();
    }
  }, [ searchTerm, router, onGoToSearchResults, onClose ]);

  const handleSubmit = React.useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigateToResults(true);
  }, [ navigateToResults ]);

  const handleViewAllResultsClick = React.useCallback(() => {
    navigateToResults(false);
  }, [ navigateToResults ]);

  const onTriggerClick = React.useCallback((event: React.MouseEvent) => {
    onOpen();
    event.preventDefault();
    event.stopPropagation();
  }, [ onOpen ]);

  const handleItemClick = React.useCallback((event: React.MouseEvent<HTMLAnchorElement>) => {
    onClose();
    mixpanel.logEvent(mixpanel.EventTypes.SEARCH_QUERY, {
      'Search query': searchTerm,
      'Source page type': mixpanel.getPageType(router.pathname),
      'Result URL': event.currentTarget.href,
    });
    saveToRecentKeywords(searchTerm);
  }, [ router.pathname, searchTerm, onClose ]);

  const handleClear = React.useCallback(() => {
    handleSearchTermChange('');
    inputRef.current?.querySelector('input')?.focus();
  }, [ handleSearchTermChange ]);

  const handleOverlayClick = React.useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    onTriggerClick(event);
  }, [ onTriggerClick ]);

  let trigger: React.ReactNode | null = null;
  if (isHeroBanner) {
    trigger = (
      <div className="relative w-full">
        <SearchBarInput
          isHeroBanner={ isHeroBanner }
          readOnly={ true }
        />
        <div
          onClick={ handleOverlayClick }
          aria-label="Search"
          className="cursor-pointer z-[1] absolute top-0 left-0 right-0 bottom-0"
        />
      </div>
    );
  } else {
    trigger = (
      <Button
        variant="header"
        className="shrink-0 p-0"
      >
        <IconSvg
          name="search"
          className="w-6 h-6 shrink-0"
        />
      </Button>
    );
  }

  return (
    <DrawerRoot placement="bottom" open={ open } onOpenChange={ onOpenChange } unmountOnExit={ false } lazyMount={ true }>
      <DrawerTrigger asChild>
        { trigger }
      </DrawerTrigger>
      <DrawerContent className="h-[75vh] overflow-y-hidden">
        <DrawerHeader>
          <DrawerTitle>Search</DrawerTitle>
          <DrawerCloseTrigger/>
        </DrawerHeader>
        <DrawerBody className="overflow-hidden flex flex-col">
          <SearchBarInput
            ref={ inputRef }
            onChange={ handleSearchTermChange }
            onClear={ handleClear }
            onSubmit={ handleSubmit }
            value={ searchTerm }
            mb={ 5 }
          />
          { searchTerm.trim().length === 0 && recentSearchKeywords.length > 0 && (
            <SearchBarRecentKeywords onClick={ handleSearchTermChange }/>
          ) }
          { searchTerm.trim().length > 0 && (
            <SearchBarSuggest
              query={ query }
              searchTerm={ debouncedSearchTerm }
              onItemClick={ handleItemClick }
              zetaChainCCTXQuery={ zetaChainCCTXQuery }
              externalSearchItem={ externalSearchItem }
            />
          ) }
        </DrawerBody>
        { (query.data && query.data?.length > 0) && (
          <DrawerFooter
            className="border-t border-[var(--color-border-divider)] pt-3 px-5 pb-5 justify-center"
          >
            <Link
              onClick={ handleViewAllResultsClick }
              className="text-sm"
            >
              View all results
            </Link>
          </DrawerFooter>
        ) }
      </DrawerContent>
    </DrawerRoot>
  );
};

export default SearchBarMobile;
