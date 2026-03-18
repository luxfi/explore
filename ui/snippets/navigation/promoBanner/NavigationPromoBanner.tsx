import React, { useCallback, useState, useEffect } from 'react';
import { keccak256, stringToBytes } from 'viem';

import config from 'configs/app';
import useIsMobile from 'lib/hooks/useIsMobile';
import { Tooltip } from 'toolkit/chakra/tooltip';
import IconSvg from 'ui/shared/IconSvg';

import NavigationPromoBannerContent from './NavigationPromoBannerContent';

const PROMO_BANNER_CLOSED_HASH_KEY = 'nav-promo-banner-closed-hash';
const promoBanner = config.UI.navigation.promoBanner;
const isHorizontal = config.UI.navigation.layout === 'horizontal';

type Props = {
  isCollapsed?: boolean;
};

const NavigationPromoBanner = ({ isCollapsed }: Props) => {
  const isMobile = useIsMobile();
  const [ isXLScreen, setIsXLScreen ] = React.useState(false);
  const isHorizontalNavigation = isHorizontal && !isMobile;

  React.useEffect(() => {
    const mql = window.matchMedia('(min-width: 1280px)');
    const handler = (e: MediaQueryListEvent) => setIsXLScreen(e.matches);
    setIsXLScreen(mql.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  const [ isShown, setIsShown ] = useState(false);
  const [ promoBannerHash, setPromoBannerHash ] = useState('');

  useEffect(() => {
    try {
      const promoBannerClosedHash = window.localStorage.getItem(PROMO_BANNER_CLOSED_HASH_KEY);
      const promoBannerHash = keccak256(stringToBytes(JSON.stringify(promoBanner)));
      setIsShown(promoBannerHash !== promoBannerClosedHash);
      setPromoBannerHash(promoBannerHash);
    } catch {}
  }, []);

  const handleClose = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    localStorage.setItem(PROMO_BANNER_CLOSED_HASH_KEY, promoBannerHash);
    setIsShown(false);
  }, [ promoBannerHash ]);

  const isTooltipDisabled = isMobile || (!isHorizontalNavigation && (isCollapsed === false || (isCollapsed === undefined && isXLScreen)));

  if (!promoBanner || !isShown) {
    return null;
  }

  return (
    <div className={ `flex flex-1 pointer-events-none ${ isHorizontalNavigation ? '' : 'mt-3' }` }>
      <a
        href={ promoBanner.link_url }
        target="_blank"
        rel="noopener noreferrer"
        className={ `pointer-events-auto w-full mt-auto overflow-hidden hover:opacity-80 ${ isHorizontalNavigation ? '' : 'sticky bottom-0 lg:bottom-6' }` }
        style={{ minWidth: isHorizontalNavigation ? 'auto' : '60px' }}
      >
        <Tooltip
          content={ !isTooltipDisabled && (
            <NavigationPromoBannerContent
              isCollapsed={ false }
              isHorizontalNavigation={ false }
            />
          ) }
          showArrow={ false }
          positioning={{
            placement: isHorizontalNavigation ? 'bottom' : 'right',
            offset: { crossAxis: 0, mainAxis: isHorizontalNavigation ? 8 : 5 },
          }}
          contentProps={{
            className: 'p-0 rounded-base bg-transparent cursor-default',
            style: { boxShadow: isHorizontalNavigation ? 'var(--shadow-2xl)' : 'none' },
          }}
          interactive
        >
          <div className="w-full relative">
            <NavigationPromoBannerContent
              isCollapsed={ isCollapsed }
              isHorizontalNavigation={ isHorizontalNavigation }
            />
            <IconSvg
              onClick={ handleClose }
              name="close"
              className={ `w-3 h-3 text-gray-300 dark:text-gray-600 bg-[var(--color-bg-primary)] rounded-bl-sm rounded-tr-sm absolute top-0 right-0 ${ isMobile ? 'block' : 'hidden' }` }
            />
          </div>
        </Tooltip>
      </a>
    </div>
  );
};

export default NavigationPromoBanner;
