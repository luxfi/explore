import React from 'react';

import config from 'configs/app';
import { getCurrentChain, isSubnetExplorer } from 'configs/app/chainRegistry';
import RewardsButton from 'ui/rewards/RewardsButton';

export const BACKGROUND_DEFAULT = 'var(--color-whiteAlpha-50)';

const HeroBanner = () => {
  // On subnet white-labels (Zoo, Pars, Hanzo, SPC), show the chain brand name.
  // On the primary C-Chain explorer, show the generic network name from env.
  const displayName = isSubnetExplorer() ? getCurrentChain().branding.brandName : config.chain.name;

  return (
    <div className="w-full rounded-lg px-4 py-3 lg:px-6 lg:py-4 flex items-center border border-[var(--color-border-divider)] bg-[var(--color-stats-bg)]">
      <div className="grow">
        <div className="flex justify-between items-center gap-x-2">
          <span className="text-sm lg:text-base font-semibold tracking-wide uppercase text-[var(--color-text-secondary)]">
            { displayName }
          </span>
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
