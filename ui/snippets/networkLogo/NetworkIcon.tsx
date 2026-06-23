import React from 'react';

import { route } from 'nextjs-routes';

import { getCurrentChain } from 'configs/app/chainRegistry';

type Props = {
  className?: string;
};

// Renders the resolved chain's brand mark (inline SVG from chainRegistry),
// matching the desktop TopBar. No image-URL dependency / triangle fallback —
// the per-host branding (e.g. the Hanzo H) is authoritative.
const NetworkIcon = ({ className }: Props) => {
  const chain = getCurrentChain();

  return (
    <a
      className={ className }
      href={ route({ pathname: '/' }) }
      aria-label={ `${ chain.branding.brandName } home` }
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={ chain.branding.logoViewBox }
        width="30"
        height="30"
        className="shrink-0 text-[var(--color-text-primary)]"
        aria-label={ `${ chain.branding.brandName } icon` }
        dangerouslySetInnerHTML={{ __html: chain.branding.logoContent }}
      />
    </a>
  );
};

export default React.memo(NetworkIcon);
