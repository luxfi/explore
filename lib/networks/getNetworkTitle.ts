import config from 'configs/app';
import { getCurrentChain } from 'configs/app/chainRegistry';

// TODO delete when page descriptions is refactored
export default function getNetworkTitle(): string {
  // Prefer chain registry brand name (hostname-aware) over env var
  const chain = getCurrentChain();
  const name = chain.branding.brandName || config.chain.name;
  return name + (config.chain.shortName ? ` (${ config.chain.shortName })` : '') + ' Explorer';
}
