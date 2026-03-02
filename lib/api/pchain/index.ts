// P-chain API hooks and types.

export { getPChain, getInfo, getHealth } from './client';
export { useCurrentValidators } from './useCurrentValidators';
export { useBlockchains } from './useBlockchains';
export { useSubnets } from './useSubnets';
export { useChainHeights } from './useChainHeights';

export type {
  PChainValidator,
  PChainDelegator,
  PChainRewardOwner,
  PChainBlockchain,
  PChainSubnet,
  GetCurrentValidatorsResponse,
  GetBlockchainsResponse,
  GetSubnetsResponse,
  ValidatorStats,
} from './types';

export type { UseCurrentValidatorsResult } from './useCurrentValidators';
export type { UseChainHeightsResult } from './useChainHeights';
