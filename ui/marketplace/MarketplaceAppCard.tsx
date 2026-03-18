import type { MouseEvent } from 'react';
import React, { useCallback } from 'react';

import type { MarketplaceApp } from 'types/client/marketplace';

import { cn } from 'lib/utils/cn';
import { useColorModeValue } from 'toolkit/chakra/color-mode';
import { IconButton } from 'toolkit/chakra/icon-button';
import { Image } from 'toolkit/chakra/image';
import { Link, LinkBox } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { isBrowser } from 'toolkit/utils/isBrowser';
import CopyToClipboard from 'ui/shared/CopyToClipboard';

import FavoriteIcon from './FavoriteIcon';
import MarketplaceAppCardLink from './MarketplaceAppCardLink';
import MarketplaceAppGraphLinks from './MarketplaceAppGraphLinks';
import MarketplaceAppIntegrationIcon from './MarketplaceAppIntegrationIcon';
import Rating from './Rating/Rating';

interface Props extends MarketplaceApp {
  onInfoClick: (id: string) => void;
  isFavorite: boolean;
  onFavoriteClick: (id: string, isFavorite: boolean) => void;
  isLoading: boolean;
  onAppClick: (event: MouseEvent, id: string) => void;
  className?: string;
  graphLinks?: Array<{ title: string; url: string }>;
}

const MarketplaceAppCard = ({
  id,
  url,
  external,
  title,
  logo,
  logoDarkMode,
  shortDescription,
  categories,
  onInfoClick,
  isFavorite,
  onFavoriteClick,
  isLoading,
  internalWallet,
  onAppClick,
  className,
  rating,
  ratingsTotalCount,
  userRating,
  graphLinks,
}: Props) => {
  const categoriesLabel = categories.join(', ');

  const handleInfoClick = useCallback((event: MouseEvent) => {
    event.preventDefault();
    onInfoClick(id);
  }, [ onInfoClick, id ]);

  const handleFavoriteClick = useCallback(() => {
    onFavoriteClick(id, isFavorite);
  }, [ onFavoriteClick, id, isFavorite ]);

  const logoUrl = useColorModeValue(logo, logoDarkMode || logo);

  return (
    <LinkBox
      className={ cn(
        'rounded-[var(--radius-base,8px)] p-3 border border-solid border-black/30 dark:border-white/30',
        !isLoading && 'hover:shadow-md focus-within:shadow-md',
        className,
      ) }
    >
      <div
        flexDirection="column"
        height="100%"
        alignContent="start"
        gap={ 2 }
      >
        <div gap={ 4 }>
          <Skeleton
            loading={ isLoading }
            w="64px"
            h="64px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexShrink={ 0 }
          >
            <Image
              src={ isLoading ? undefined : logoUrl }
              alt={ `${ title } app icon` }
              borderRadius="8px"
            />
          </Skeleton>

          <div flexDirection="column" gap={ 2 } pt={ 1 }>
            <Skeleton
              loading={ isLoading }
              display="inline-flex"
              alignItems="center"
            >
              <MarketplaceAppCardLink
                id={ id }
                url={ url }
                external={ external }
                title={ title }
                onClick={ onAppClick }
                className="text-sm font-semibold"
              />
              <MarketplaceAppIntegrationIcon external={ external } internalWallet={ internalWallet }/>
              <MarketplaceAppGraphLinks
                links={ graphLinks }
                className="ml-2 align-middle"
              />
            </Skeleton>

            <Skeleton
              loading={ isLoading }
              color="text.secondary"
              className="text-xs leading-4"
            >
              <span>{ categoriesLabel }</span>
            </Skeleton>
          </div>
        </div>

        <Skeleton
          loading={ isLoading }
          asChild
        >
          <span lineClamp={ 2 } textStyle="sm">
            { shortDescription }
          </span>
        </Skeleton>

        { !isLoading && (
          <div
            alignItems="center"
            justifyContent="space-between"
            marginTop="auto"
            h="30px"
          >
            <Link
              className="text-sm font-medium pr-3 h-full"
              href="#"
              onClick={ handleInfoClick }
            >
              Info
            </Link>
            <div alignItems="center" gap={ 3 }>
              <Rating
                appId={ id }
                rating={ rating }
                ratingsTotalCount={ ratingsTotalCount }
                userRating={ userRating }
                isLoading={ isLoading }
                source="Discovery"
              />
              <div gap={ 2 }>
                <IconButton
                  aria-label="Mark as favorite"
                  title="Mark as favorite"
                  variant="icon_background"
                  size="md"
                  onClick={ handleFavoriteClick }
                  selected={ isFavorite }
                >
                  <FavoriteIcon isFavorite={ isFavorite }/>
                </IconButton>
                <CopyToClipboard
                  text={ isBrowser() ? window.location.origin + `/apps/${ id }` : '' }
                  type="share"
                  variant="icon_background"
                  size="md"
                  className="rounded-[var(--radius-base,8px)] ml-0"
                />
              </div>
            </div>
          </div>
        ) }
      </div>
    </LinkBox>
  );
};

export default MarketplaceAppCard;
