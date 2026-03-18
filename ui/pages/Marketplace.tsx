import React from 'react';
import type { MouseEvent } from 'react';

import type { TabItemRegular } from 'toolkit/components/AdaptiveTabs/types';
import { MarketplaceCategory } from 'types/client/marketplace';

import config from 'configs/app';
import throwOnResourceLoadError from 'lib/errors/throwOnResourceLoadError';
import useGraphLinks from 'lib/hooks/useGraphLinks';
import useIsMobile from 'lib/hooks/useIsMobile';
import { Heading } from '@luxfi/ui/heading';
import { IconButton } from '@luxfi/ui/icon-button';
import { Link } from 'toolkit/chakra/link';
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from '@luxfi/ui/menu';
import AdaptiveTabs from 'toolkit/components/AdaptiveTabs/AdaptiveTabs';
import { FilterInput } from 'toolkit/components/filters/FilterInput';
import Banner from 'ui/marketplace/Banner';
import EssentialDappsList from 'ui/marketplace/essentialDapps/EssentialDappsList';
import MarketplaceAppModal from 'ui/marketplace/MarketplaceAppModal';
import MarketplaceDisclaimerModal from 'ui/marketplace/MarketplaceDisclaimerModal';
import MarketplaceList from 'ui/marketplace/MarketplaceList';
import type { SortValue } from 'ui/marketplace/utils';
import { SORT_OPTIONS } from 'ui/marketplace/utils';
import ActionBar from 'ui/shared/ActionBar';
import IconSvg from 'ui/shared/IconSvg';
import type { IconName } from 'ui/shared/IconSvg';
import PageTitle from 'ui/shared/Page/PageTitle';
import Sort from 'ui/shared/sort/Sort';

import useMarketplace from '../marketplace/useMarketplace';
import { createListCollection } from '@luxfi/ui/select';

const sortCollection = createListCollection({ items: SORT_OPTIONS });

const feature = config.features.marketplace;

const links: Array<{ label: string; href: string; icon: IconName }> = [];
if (feature.isEnabled) {
  if (feature.submitFormUrl) {
    links.push({
      label: 'Submit app',
      href: feature.submitFormUrl,
      icon: 'plus' as IconName,
    });
  }
  if (feature.suggestIdeasFormUrl) {
    links.push({
      label: 'Suggest ideas',
      href: feature.suggestIdeasFormUrl,
      icon: 'edit' as IconName,
    });
  }
}

const Marketplace = () => {
  const {
    isPlaceholderData,
    isError,
    error,
    selectedCategoryId,
    categories,
    onCategoryChange,
    filterQuery,
    onSearchInputChange,
    showAppInfo,
    apps,
    displayedApps,
    selectedAppId,
    clearSelectedAppId,
    favoriteApps,
    onFavoriteClick,
    isAppInfoModalOpen,
    isDisclaimerModalOpen,
    showDisclaimer,
    appsTotal,
    isCategoriesPlaceholderData,
    setSorting,
  } = useMarketplace();

  const isMobile = useIsMobile();

  const graphLinksQuery = useGraphLinks();

  const categoryTabs = React.useMemo(() => {
    const tabs: Array<TabItemRegular> = categories.map(category => ({
      id: category.name,
      title: category.name,
      count: category.count,
      component: null,
    }));

    tabs.unshift({
      id: MarketplaceCategory.ALL,
      title: MarketplaceCategory.ALL,
      count: appsTotal,
      component: null,
    });

    tabs.unshift({
      id: MarketplaceCategory.FAVORITES,
      title: () => <IconSvg name="heart_filled" className="size-5"/>,
      count: favoriteApps.length,
      component: null,
    });

    return tabs;
  }, [ categories, appsTotal, favoriteApps.length ]);

  const selectedTabId = React.useMemo(() => {
    const tab = categoryTabs.find(c => c.id === selectedCategoryId);
    return typeof tab?.id === 'string' ? tab.id : undefined;
  }, [ categoryTabs, selectedCategoryId ]);

  const selectedApp = displayedApps.find(app => app.id === selectedAppId);

  const handleCategoryChange = React.useCallback(({ value }: { value: string }) => {
    const tabId = categoryTabs.find(c => c.id === value)?.id;
    if (typeof tabId === 'string') {
      onCategoryChange(tabId);
    }
  }, [ categoryTabs, onCategoryChange ]);

  const handleAppClick = React.useCallback((event: MouseEvent, id: string) => {
    const isShown = window.localStorage.getItem('marketplace-disclaimer-shown');
    if (!isShown) {
      event.preventDefault();
      showDisclaimer(id);
    }
  }, [ showDisclaimer ]);

  const handleSortChange = React.useCallback(({ value }: { value: Array<string> }) => {
    setSorting(value[0] as SortValue);
  }, [ setSorting ]);

  throwOnResourceLoadError(isError && error ? { isError, error } : { isError: false, error: null });

  if (!feature.isEnabled) {
    return null;
  }

  const showSort = SORT_OPTIONS.length > 1;

  return (
    <>
      <PageTitle
        title={ feature.titles.title }
        contentAfter={ (isMobile && links.length > 1) ? (
          <MenuRoot>
            <MenuTrigger asChild>
              <IconButton
                variant="icon_background"
                size="md"
                className="ml-auto"
              >
                <IconSvg name="dots"/>
              </IconButton>
            </MenuTrigger>
            <MenuContent zIndex="banner">
              { links.map(({ label, href, icon }) => (
                <MenuItem key={ label } value={ label } asChild>
                  <Link external href={ href } variant="menu" className="gap-0">
                    <IconSvg name={ icon } className="size-4 mr-2"/>
                    { label }
                  </Link>
                </MenuItem>
              )) }
            </MenuContent>
          </MenuRoot>
        ) : (
          <div className="ml-auto">
            { links.map(({ label, href }) => (
              <Link external key={ label } href={ href } variant="underlaid" className="text-sm ml-2">
                { label }
              </Link>
            )) }
          </div>
        ) }
      />

      <Banner
        apps={ apps }
        favoriteApps={ favoriteApps }
        isLoading={ isPlaceholderData }
        onInfoClick={ showAppInfo }
        onFavoriteClick={ onFavoriteClick }
        onAppClick={ handleAppClick }
      />

      { feature.essentialDapps && (
        <>
          <Heading level="2" className="mb-6 mt-8">
            { feature.titles.subtitle_essential_dapps }
          </Heading>
          <EssentialDappsList/>
          <Heading level="2">
            { feature.titles.subtitle_list }
          </Heading>
        </>
      ) }

      <ActionBar
        showShadow
        className="flex flex-col mt-0 -mx-3 lg:-mx-12 px-3 lg:px-12 pt-4 lg:pt-6 pb-4 lg:pb-3"
      >
        <AdaptiveTabs
          tabs={ categoryTabs }
          onValueChange={ handleCategoryChange }
          defaultValue={ selectedTabId }
          className="-mb-2"
          isLoading={ isCategoriesPlaceholderData }
        />

        <div className="flex gap-2 lg:gap-3">
          { showSort && (
            <Sort
              name="dapps_sorting"
              collection={ sortCollection }
              onValueChange={ handleSortChange }
              defaultValue={ [ sortCollection.items[0].value ] }
              isLoading={ isPlaceholderData }
            />
          ) }
          <FilterInput
            initialValue={ filterQuery }
            onChange={ onSearchInputChange }
            placeholder="Find app by name or keyword..."
            loading={ isPlaceholderData }
            size="sm"
            className="w-full lg:w-[350px]"
          />
        </div>
      </ActionBar>

      <MarketplaceList
        apps={ displayedApps }
        showAppInfo={ showAppInfo }
        favoriteApps={ favoriteApps }
        onFavoriteClick={ onFavoriteClick }
        isLoading={ isPlaceholderData }
        selectedCategoryId={ selectedCategoryId }
        onAppClick={ handleAppClick }
        graphLinksQuery={ graphLinksQuery }
      />

      { (selectedApp && isAppInfoModalOpen) && (
        <MarketplaceAppModal
          onClose={ clearSelectedAppId }
          isFavorite={ favoriteApps.includes(selectedApp.id) }
          onFavoriteClick={ onFavoriteClick }
          data={ selectedApp }
          graphLinks={ graphLinksQuery.data?.[selectedApp.id] }
        />
      ) }

      { (selectedApp && isDisclaimerModalOpen) && (
        <MarketplaceDisclaimerModal
          isOpen={ isDisclaimerModalOpen }
          onClose={ clearSelectedAppId }
          appId={ selectedApp.id }
        />
      ) }
    </>
  );
};

export default Marketplace;
