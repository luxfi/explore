import React from 'react';

import config from 'configs/app';
import { useColorModeValue } from 'toolkit/chakra/color-mode';
import RewardsButton from 'ui/rewards/RewardsButton';

export const BACKGROUND_DEFAULT = 'var(--chakra-colors-whiteAlpha-50)';
const TEXT_COLOR_DEFAULT = 'white';
const BORDER_DEFAULT = '1px solid var(--chakra-colors-whiteAlpha-100)';

const HeroBanner = () => {

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
      className="w-full rounded-md p-4 lg:p-6 flex items-center"
      style={{ background, border }}
    >
      <div className="grow">
        <div className="flex justify-between items-center gap-x-2">
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
      </div>
    </div>
  );
};

export default React.memo(HeroBanner);
