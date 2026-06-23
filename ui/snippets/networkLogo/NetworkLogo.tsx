import React from 'react';

import { route } from 'nextjs-routes';

import { getCurrentChain } from 'configs/app/chainRegistry';

type Props = {
  className?: string;
};

// Renders the resolved chain's brand mark + name (inline SVG from
// chainRegistry), matching the desktop TopBar. No image-URL dependency /
// triangle fallback — the per-host branding (e.g. the Hanzo H) is authoritative.
const NetworkLogo = ({ className }: Props) => {
  const chain = getCurrentChain();

  return (
    <a
      className={ className }
      href={ route({ pathname: '/' }) }
      aria-label={ `${ chain.branding.brandName } home` }
    >
      <div className="flex items-center gap-2 h-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox={ chain.branding.logoViewBox }
          width="24"
          height="24"
          className="shrink-0 text-[var(--color-text-primary)]"
          dangerouslySetInnerHTML={{ __html: chain.branding.logoContent }}
        />
        <span className="font-bold text-lg tracking-tight whitespace-nowrap text-[var(--color-text-primary)]">
          { chain.branding.brandName }
        </span>
      </div>
    </a>
  );
};

export default React.memo(NetworkLogo);
