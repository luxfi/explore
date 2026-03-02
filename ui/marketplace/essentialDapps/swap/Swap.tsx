import React, { useMemo, useRef, useEffect, useState } from 'react';

import { getFeaturePayload } from 'configs/app/features/types';

import config from 'configs/app';
import essentialDappsChainsConfig from 'configs/essential-dapps-chains';
import useIsMobile from 'lib/hooks/useIsMobile';
import { useColorMode } from 'toolkit/next/color-mode';
import { BODY_TYPEFACE } from 'toolkit/theme/foundations/typography';
import MarketplaceAppIframe from 'ui/marketplace/MarketplaceAppIframe';
import AdBanner from 'ui/shared/ad/AdBanner';

const feature = getFeaturePayload(config.features.marketplace);
const dappConfig = feature?.essentialDapps?.swap;

const defaultChainId = Number(
  dappConfig?.chains.includes(config.chain.id as string) ?
    config.chain.id :
    dappConfig?.chains[0],
);

function getExplorerUrls() {
  return Object.fromEntries(dappConfig?.chains.map((chainId) => {
    const chainConfig = essentialDappsChainsConfig()?.chains.find(
      (chain) => chain.id === chainId,
    );
    return [ Number(chainId), [ chainConfig?.explorer_url ] ];
  }) || []);
}

export default function Swap() {
  const isMobile = useIsMobile();
  const { colorMode } = useColorMode();
  const colorRef = useRef<HTMLDivElement>(null);
  const [ mainColor, setMainColor ] = useState('#2563eb');
  const [ borderColor, setBorderColor ] = useState('rgba(0,0,0,0.06)');

  useEffect(() => {
    if (colorRef.current) {
      const styles = getComputedStyle(colorRef.current);
      setMainColor(styles.getPropertyValue('--color-blue-600').trim() || '#2563eb');
      setBorderColor(
        colorMode === 'light'
          ? 'rgba(0,0,0,0.06)'
          : 'rgba(255,255,255,0.06)',
      );
    }
  }, [ colorMode ]);

  const message = useMemo(() => ({
    type: 'config',
    integrator: dappConfig?.integrator,
    fee: Number(dappConfig?.fee),
    chains: dappConfig?.chains.map((chainId) => Number(chainId)),
    explorerUrls: getExplorerUrls(),
    mainColor,
    borderColor,
    fontFamily: BODY_TYPEFACE,
    defaultChainId,
  }), [ mainColor, borderColor ]);

  return (
    <div ref={ colorRef } className="flex flex-1 flex-col justify-between gap-6">
      <MarketplaceAppIframe
        appId="swap"
        appUrl={ dappConfig?.url }
        message={ message }
        isEssentialDapp
      />
      { (feature?.essentialDappsAdEnabled && !isMobile) && (
        <AdBanner
          format="mobile"
          className="w-fit rounded-md overflow-hidden ml-auto"
        />
      ) }
    </div>
  );
};
