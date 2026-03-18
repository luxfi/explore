// we use custom heading size for hero banner
// eslint-disable-next-line no-restricted-imports
import React from 'react';

import config from 'configs/app';
import useIsMobile from 'lib/hooks/useIsMobile';
import { useColorModeValue } from 'toolkit/chakra/color-mode';
import RewardsButton from 'ui/rewards/RewardsButton';
import AdBanner from 'ui/shared/ad/AdBanner';
import SearchBar from 'ui/snippets/searchBar/SearchBarDesktop';
import SearchBarMobile from 'ui/snippets/searchBar/SearchBarMobile';

export const BACKGROUND_DEFAULT = 'var(--chakra-colors-whiteAlpha-50)';
const TEXT_COLOR_DEFAULT = 'white';
const BORDER_DEFAULT = '1px solid var(--chakra-colors-whiteAlpha-100)';

const HeroBanner = () => {

  const isMobile = useIsMobile();

  const background = useColorModeValue(
    config.UI.homepage.heroBanner?.background?.[0] || BACKGROUND_DEFAULT,
    config.UI.homepage.heroBanner?.background?.[1] || config.UI.homepage.heroBanner?.background?.[0] || BACKGROUND_DEFAULT,
  );

  const textColor = useColorModeValue(
    config.UI.homepage.heroBanner?.text_color?.[0] || TEXT_COLOR_DEFAULT,
    config.UI.homepage.heroBanner?.text_color?.[1] || config.UI.homepage.heroBanner?.text_color?.[0] || TEXT_COLOR_DEFAULT,
  );

  const border = useColorModeValue(
    config.UI.homepage.heroBanner?.border?.[0] || BORDER_DEFAULT,
    config.UI.homepage.heroBanner?.border?.[1] || config.UI.homepage.heroBanner?.border?.[0] || BORDER_DEFAULT,
  );

  return (
    <div
      className="w-full rounded-md p-4 lg:p-8 gap-x-8 flex items-center"
      style={{ background, border }}
    >
      <div className="grow">
        <div className="mb-2 lg:mb-3 flex justify-between items-center gap-x-2">
          <h1
            className="text-[18px] lg:text-[30px] leading-[24px] lg:leading-[36px] font-medium lg:font-bold"
            style={{ color: textColor }}
          >
            {
              config.meta.seo.enhancedDataEnabled ?
                `${ config.chain.name } blockchain explorer` :
                `${ config.chain.name } explorer`
            }
          </h1>
          { config.UI.navigation.layout === 'vertical' && config.features.rewards.isEnabled && (
            <div className="hidden lg:flex gap-2">
              <RewardsButton variant="hero"/>
            </div>
          ) }
        </div>
        <div className="flex lg:hidden">
          <SearchBarMobile isHeroBanner/>
        </div>
        <div className="hidden lg:flex">
          <SearchBar isHeroBanner/>
        </div>
      </div>
      { !isMobile && <AdBanner format="mobile" className="w-fit shrink-0 rounded-md overflow-hidden"/> }
    </div>
  );
};

export default React.memo(HeroBanner);
