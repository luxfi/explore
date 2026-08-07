import config from 'configs/app';

const feature = config.features.blockchainInteraction;

const useWallet = (feature.isEnabled && feature.connectorType === 'reown') ?
  (await import('./wallet/useWalletReown')).default :
  (await import('./wallet/useWalletFallback')).default;

export default useWallet;
