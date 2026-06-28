import React from 'react';

import { isPrimaryNetworkExplorer } from 'configs/app/chainRegistry';
import PageTitle from 'ui/shared/Page/PageTitle';

// Primary-network VM surfaces (Chains / Chain detail / DEX) belong to the Lux
// primary network only. On a brand explorer (Hanzo / Zoo / Pars / SPC / Osage)
// these chains must never appear — see the chain-visibility rule in
// chainRegistry.ts. The nav hides the entries; this guard backstops direct-URL
// access so the primary VMs can never leak onto a brand explorer.

interface Props {
  readonly title: string;
  readonly children: React.ReactNode;
}

const PrimaryNetworkGuard = ({ title, children }: Props) => {
  if (!isPrimaryNetworkExplorer()) {
    return (
      <>
        <PageTitle title={ title }/>
        <div className="px-4 py-10 text-center text-sm text-[var(--color-text-secondary)]">
          This explorer shows only its own chain. The Lux primary-network chains
          are available on the Lux explorer.
        </div>
      </>
    );
  }
  return children;
};

export default PrimaryNetworkGuard;
