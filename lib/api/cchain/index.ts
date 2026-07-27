// C-Chain (EVM) API hooks and types.

export {
  useFeeSplit,
  burnedWei,
  deriveStatus,
  parseFeeSplitBatch,
  recordSample,
  toCoinSeries,
  FEE_REWARD_VAULT,
  FEE_COINBASE,
} from './useFeeSplit';

export type {
  FeeSplitStatus,
  FeeSplitChainConfig,
  FeeSplitReading,
  FeeSplitSample,
  FeeSplitData,
  RpcEnvelope,
} from './useFeeSplit';
