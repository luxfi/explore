// A-Chain (AI Chain) API hooks and types.

export {
  fetchModels,
  fetchAttestations,
  fetchInferenceResults,
  fetchProviders,
} from './client';

export { useModels } from './useModels';
export { useAttestations } from './useAttestations';
export { useProviders } from './useProviders';
export { useInferenceResults } from './useInferenceResults';

export type {
  AIModel,
  AIAttestation,
  AIInferenceResult,
  AIProvider,
  AIChainStats,
} from './types';
