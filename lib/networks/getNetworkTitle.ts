import config from 'configs/app';

export default function getNetworkTitle(): string {
  const name = config.chain.name || 'Explorer';
  return name + (config.chain.shortName ? ` (${ config.chain.shortName })` : '') + ' Explorer';
}
