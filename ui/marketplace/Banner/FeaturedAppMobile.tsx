import type { MouseEvent } from 'react';
import React from 'react';

import type { MarketplaceApp } from 'types/client/marketplace';

import { useColorModeValue } from 'toolkit/chakra/color-mode';
import { Heading } from 'toolkit/chakra/heading';
import { IconButton } from 'toolkit/chakra/icon-button';
import { Image } from 'toolkit/chakra/image';
import { Link, LinkBox } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';

import FavoriteIcon from '../FavoriteIcon';
import MarketplaceAppCardLink from '../MarketplaceAppCardLink';
import MarketplaceAppIntegrationIcon from '../MarketplaceAppIntegrationIcon';

interface Props extends MarketplaceApp {
  onInfoClick: (event: MouseEvent) => void;
  isFavorite: boolean;
  onFavoriteClick: () => void;
  isLoading: boolean;
  onAppClick: (event: MouseEvent, id: string) => void;
}

const FeaturedAppMobile = ({
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
}: Props) => {
  const categoriesLabel = categories.join(', ');

  const logoUrl = useColorModeValue(logo, logoDarkMode || logo);

  return (
    <LinkBox
      className="rounded-md p-3 sm:p-5 group bg-[var(--color-purple-50)] dark:bg-white/10"
      role="group"
    >
      <div
        flexDirection="row"
        height="100%"
        alignContent="start"
        gap={ 4 }
      >
        <div
          flexDirection="column"
          alignItems="center"
          justifyContent="space-between"
        >
          <Skeleton
            loading={ isLoading }
            className="w-16 sm:w-24 h-16 sm:h-24"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Image
              src={ isLoading ? undefined : logoUrl }
              alt={ `${ title } app icon` }
              borderRadius="8px"
            />
          </Skeleton>

          { !isLoading && (
            <div
              position={{ base: 'relative', sm: 'absolute' }}
              right={{ base: 0, sm: '50px' }}
              top={{ base: 0, sm: '24px' }}
            >
              <Link
                className="text-xs sm:text-sm font-medium sm:pr-2"
                href="#"
                onClick={ onInfoClick }
              >
                More info
              </Link>
            </div>
          ) }
        </div>

        <div flexDirection="column" gap={ 2 }>
          <Skeleton
            loading={ isLoading }
            className="pr-[25px] sm:pr-[110px]"
            display="flex"
            alignItems="center"
          >
            <Heading level="3">
              <MarketplaceAppCardLink
                id={ id }
                url={ url }
                external={ external }
                title={ title }
                onClick={ onAppClick }
              />
            </Heading>
            <MarketplaceAppIntegrationIcon external={ external } internalWallet={ internalWallet }/>
          </Skeleton>

          <Skeleton
            loading={ isLoading }
            color="text.secondary"
            textStyle="xs"
          >
            <span>{ categoriesLabel }</span>
          </Skeleton>

          <Skeleton
            loading={ isLoading }
            asChild
          >
            <span lineClamp={ 3 } textStyle="xs">
              { shortDescription }
            </span>
          </Skeleton>
        </div>

        { !isLoading && (
          <IconButton
            className="flex items-center justify-center absolute right-1 sm:right-[10px] top-1 sm:top-[18px]"
            aria-label="Mark as favorite"
            title="Mark as favorite"
            variant="icon_background"
            size="md"
            onClick={ onFavoriteClick }
            selected={ isFavorite }
          >
            <FavoriteIcon isFavorite={ isFavorite }/>
          </IconButton>
        ) }
      </div>
    </LinkBox>
  );
};

export default React.memo(FeaturedAppMobile);
