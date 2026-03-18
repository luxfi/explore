// we use custom heading size for hero banner
// eslint-disable-next-line no-restricted-imports
import React from 'react';

import config from 'configs/app';
import useIsMobile from 'lib/hooks/useIsMobile';
import RewardsButton from 'ui/rewards/RewardsButton';
import AdBanner from 'ui/shared/ad/AdBanner';
import SearchBar from 'ui/snippets/searchBar/SearchBarDesktop';
import SearchBarMobile from 'ui/snippets/searchBar/SearchBarMobile';

export const BACKGROUND_DEFAULT = 'var(--chakra-colors-whiteAlpha-50)';
const TEXT_COLOR_DEFAULT = 'white';
const BORDER_DEFAULT = '1px solid var(--chakra-colors-whiteAlpha-100)';

const HeroBanner = () => {

  const isMobile = useIsMobile();

  const background = {
    _light:
      config.UI.homepage.heroBanner?.background?.[0] ||
      BACKGROUND_DEFAULT,
    _dark:
      config.UI.homepage.heroBanner?.background?.[1] ||
      config.UI.homepage.heroBanner?.background?.[0] ||
      BACKGROUND_DEFAULT,
  };

  const textColor = {
    _light:
      // light mode
      config.UI.homepage.heroBanner?.text_color?.[0] ||
      TEXT_COLOR_DEFAULT,
    // dark mode
    _dark:
      config.UI.homepage.heroBanner?.text_color?.[1] ||
      config.UI.homepage.heroBanner?.text_color?.[0] ||
      TEXT_COLOR_DEFAULT,
  };

  const border = {
    _light:
      config.UI.homepage.heroBanner?.border?.[0] || BORDER_DEFAULT,
    _dark:
      config.UI.homepage.heroBanner?.border?.[1] || config.UI.homepage.heroBanner?.border?.[0] || BORDER_DEFAULT,
  };

  return (
    <div
      w="100%"
      background={ background }
      border={ border }
      borderRadius="md"
      p={{ base: 4, lg: 8 }}
      columnGap={ 8 }
      alignItems="center"
    >
      <div flexGrow={ 1 }>
        <div mb={{ base: 2, lg: 3 }} justifyContent="space-between" alignItems="center" columnGap={ 2 }>
          <h1
            fontSize={{ base: '18px', lg: '30px' }}
            lineHeight={{ base: '24px', lg: '36px' }}
            fontWeight={{ base: 500, lg: 700 }}
            color={ textColor }
          >
            {
              config.meta.seo.enhancedDataEnabled ?
                `${ config.chain.name } blockchain explorer` :
                `${ config.chain.name } explorer`
            }
          </h1>
          { config.UI.navigation.layout === 'vertical' && config.features.rewards.isEnabled && (
            <div display={{ base: 'none', lg: 'flex' }} gap={ 2 }>
              <RewardsButton variant="hero"/>
            </div>
          ) }
        </div>
        <div display={{ base: 'flex', lg: 'none' }}>
          <SearchBarMobile isHeroBanner/>
        </div>
        <div display={{ base: 'none', lg: 'flex' }}>
          <SearchBar isHeroBanner/>
        </div>
      </div>
      { !isMobile && <AdBanner format="mobile" w="fit-content" flexShrink={ 0 } borderRadius="md" overflow="hidden"/> }
    </div>
  );
};

export default React.memo(HeroBanner);
