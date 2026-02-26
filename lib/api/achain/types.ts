// A-Chain (AI Chain) type definitions.
// These match the Lux indexer A-Chain adapter schema.

export interface AIModel {
  readonly id: string;
  readonly name: string;
  readonly version: string;
  readonly framework: string;
  readonly modelHash: string;
  readonly parameters: number;
  readonly registeredAt: string;
  readonly provider: string;
}

export interface AIAttestation {
  readonly id: string;
  readonly type: 'compute' | 'training' | 'inference';
  readonly provider: string;
  readonly modelHash: string;
  readonly timestamp: string;
  readonly blockHeight: number;
  readonly status: 'pending' | 'verified' | 'rejected';
}

export interface AIInferenceResult {
  readonly id: string;
  readonly modelId: string;
  readonly inputHash: string;
  readonly outputHash: string;
  readonly confidence: number;
  readonly latencyMs: number;
  readonly timestamp: string;
  readonly provider: string;
}

export interface AIProvider {
  readonly address: string;
  readonly reputation: number;
  readonly capacity: number;
  readonly totalJobs: number;
  readonly totalEarnings: string;
  readonly isActive: boolean;
}

export interface AIChainStats {
  readonly totalModels: number;
  readonly activeProviders: number;
  readonly totalAttestations: number;
  readonly avgLatencyMs: number;
}
