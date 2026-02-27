import React from 'react';

import { getCurrentChain } from 'configs/app/chainRegistry';

/**
 * Dynamically sets the favicon SVG based on the current chain's branding.
 * Generates an inline data: URI SVG favicon so each chain gets its own icon.
 */
export default function useChainFavicon(): void {
  React.useEffect(() => {
    const chain = getCurrentChain();
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">${ chain.branding.faviconSvg }</svg>`;
    const dataUri = `data:image/svg+xml,${ encodeURIComponent(svg) }`;

    // Update the SVG favicon link (browsers prefer SVG when available)
    const svgLink = document.querySelector<HTMLLinkElement>('link[rel="icon"][type="image/svg+xml"]');
    if (svgLink) {
      svgLink.href = dataUri;
    }
  }, []);
}
