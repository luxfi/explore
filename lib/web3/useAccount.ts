import config from 'configs/app';

const feature = config.features.blockchainInteraction;

const useAccount = (feature.isEnabled && feature.connectorType === 'reown') ?
  (await import('wagmi')).useAccount :
  (await import('./account/useAccountFallback')).default;

export default useAccount;
