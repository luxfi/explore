import React, { useCallback } from 'react';

import type { MarketplaceApp } from 'types/client/marketplace';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import { Badge } from '@luxfi/ui/badge';
import { Button } from '@luxfi/ui/button';
import { useColorModeValue } from 'toolkit/chakra/color-mode';
import { DialogBody, DialogCloseTrigger, DialogContent, DialogFooter, DialogRoot } from '@luxfi/ui/dialog';
import { Heading } from '@luxfi/ui/heading';
import { IconButton } from '@luxfi/ui/icon-button';
import { Image } from '@luxfi/ui/image';
import { Link } from 'toolkit/chakra/link';
import { nbsp } from 'toolkit/utils/htmlEntities';
import { isBrowser } from 'toolkit/utils/isBrowser';
import { makePrettyLink } from 'toolkit/utils/url';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import type { IconName } from 'ui/shared/IconSvg';
import IconSvg from 'ui/shared/IconSvg';

import FavoriteIcon from './FavoriteIcon';
import MarketplaceAppGraphLinks from './MarketplaceAppGraphLinks';
import MarketplaceAppIntegrationIcon from './MarketplaceAppIntegrationIcon';
import Rating from './Rating/Rating';

const feature = config.features.marketplace;
const isRatingEnabled = feature.isEnabled && 'api' in feature;

type Props = {
  onClose: () => void;
  isFavorite: boolean;
  onFavoriteClick: (id: string, isFavorite: boolean, source: 'App modal') => void;
  data: MarketplaceApp;
  graphLinks?: Array<{ title: string; url: string }>;
};

const MarketplaceAppModal = ({
  onClose, isFavorite, onFavoriteClick, data, graphLinks,
}: Props) => {
  const {
    id, title, url, external, author, description, site, github, telegram,
    twitter, discord, logo, logoDarkMode, categories, rating,
    ratingsTotalCount, userRating, internalWallet,
  } = data;

  const socialLinks = [
    telegram ? { icon: 'social/telegram_filled' as IconName, url: telegram } : null,
    twitter ? { icon: 'social/twitter_filled' as IconName, url: twitter } : null,
    discord ? { icon: 'social/discord_filled' as IconName, url: discord } : null,
  ].filter(Boolean);

  if (github) {
    if (Array.isArray(github)) {
      github.forEach((url) => socialLinks.push({ icon: 'social/github_filled', url }));
    } else {
      socialLinks.push({ icon: 'social/github_filled', url: github });
    }
  }

  const handleOpenChange = React.useCallback(({ open }: { open: boolean }) => {
    if (!open) { onClose(); }
  }, [ onClose ]);

  const handleFavoriteClick = useCallback(() => {
    onFavoriteClick(id, isFavorite, 'App modal');
  }, [ onFavoriteClick, id, isFavorite ]);

  const logoUrl = useColorModeValue(logo, logoDarkMode || logo);

  return (
    <DialogRoot open={ Boolean(data.id) } onOpenChange={ handleOpenChange } size={{ lgDown: 'full', lg: 'md' }}>
      <DialogContent>
        <div className="grid mb-6 md:mb-8" style={{ gridTemplateColumns: 'auto 1fr' }}>
          <div className="flex items-center justify-center w-[72px] h-[72px] md:w-[144px] md:h-[144px] mr-6 md:mr-8 row-span-2 md:row-span-4">
            <Image src={ logoUrl } alt={ `${ title } app icon` } borderRadius="md"/>
          </div>
          <div className="flex items-center mb-0 md:mb-2 col-start-2">
            <Heading level="2" className="font-medium mr-2">{ title }</Heading>
            <MarketplaceAppIntegrationIcon external={ external } internalWallet={ internalWallet }/>
            <MarketplaceAppGraphLinks links={ graphLinks } className="ml-2"/>
            <DialogCloseTrigger className="ml-auto"/>
          </div>
          <span className="text-[var(--color-text-secondary)] col-start-2 text-sm md:text-base font-normal">
            By{ nbsp }{ author }
          </span>
          { isRatingEnabled && (
            <div className="col-span-2 md:col-start-2 md:col-span-1 mt-6 md:mt-3 py-0 md:py-1.5 w-fit">
              <Rating appId={ id } rating={ rating } ratingsTotalCount={ ratingsTotalCount } userRating={ userRating } fullView source="App modal" popoverContentProps={{ className: 'z-[1400]' }}/>
            </div>
          ) }
          <div className="col-span-2 md:col-start-2 md:col-span-1 mt-6 md:mt-3">
            <div className="flex flex-wrap gap-6">
              <div className="flex w-full md:w-auto gap-2">
                <Link href={ external ? url : route({ pathname: '/apps/[id]', query: { id: data.id } }) } external={ external } noIcon>
                  <Button size="sm">Launch app</Button>
                </Link>
                <IconButton aria-label="Mark as favorite" title="Mark as favorite" variant="icon_background" size="md" onClick={ handleFavoriteClick } selected={ isFavorite }>
                  <FavoriteIcon isFavorite={ isFavorite }/>
                </IconButton>
                <CopyToClipboard text={ isBrowser() ? window.location.origin + `/apps/${ id }` : '' } type="share" variant="icon_background" size="md" className="ml-0 rounded-[var(--radius-base,8px)]"/>
              </div>
            </div>
          </div>
        </div>
        <DialogBody className="mb-6"><span>{ description }</span></DialogBody>
        <DialogFooter className="flex flex-col md:flex-row justify-start md:justify-between items-start gap-3">
          <div className="flex gap-2 flex-wrap">
            { categories.map((category) => (<Badge colorPalette="blue" key={ category }>{ category }</Badge>)) }
          </div>
          <div className="flex items-center gap-3 my-[2px]">
            { site && (
              <Link external href={ site } className="flex items-center text-sm">
                <IconSvg name="link" className="inline align-baseline w-[18px] h-[18px] mr-2"/>
                <span className="text-inherit whitespace-nowrap overflow-hidden text-ellipsis">{ makePrettyLink(site)?.domain }</span>
              </Link>
            ) }
            { socialLinks.map(({ icon, url }) => (
              <Link aria-label={ `Link to ${ url }` } title={ url } key={ url } href={ url } className="flex items-center justify-center shrink-0" external noIcon>
                <IconSvg name={ icon } className="w-5 h-5 text-[var(--color-icon-secondary)]"/>
              </Link>
            )) }
          </div>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default MarketplaceAppModal;
