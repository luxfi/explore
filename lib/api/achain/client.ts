import type {
  AIModel,
  AIAttestation,
  AIInferenceResult,
  AIProvider,
} from './types';

import { getEnvValue } from 'configs/app/utils';

const ACHAIN_INDEXER_URL =
  getEnvValue('NEXT_PUBLIC_ACHAIN_INDEXER_URL') || 'https://api-indexer-achain.lux.network';

const DEMO_MODELS: ReadonlyArray<AIModel> = [
  {
    id: 'model-001',
    name: 'Qwen3-235B',
    version: '3.0.0',
    framework: 'PyTorch',
    modelHash: '0xab12cd34ef56789001234567890abcdef01234567890abcdef01234567890ab',
    parameters: 235_000_000_000,
    registeredAt: '2026-02-20T10:30:00Z',
    provider: '0x1234567890abcdef1234567890abcdef12345678',
  },
  {
    id: 'model-002',
    name: 'Qwen3-30B-A3B',
    version: '3.0.0',
    framework: 'PyTorch',
    modelHash: '0xcd34ef56789001234567890abcdef01234567890abcdef01234567890abcdef',
    parameters: 30_000_000_000,
    registeredAt: '2026-02-19T14:15:00Z',
    provider: '0x2345678901abcdef2345678901abcdef23456789',
  },
  {
    id: 'model-003',
    name: 'LuxVision-7B',
    version: '1.2.0',
    framework: 'Candle',
    modelHash: '0xef56789001234567890abcdef01234567890abcdef01234567890abcdef0123',
    parameters: 7_000_000_000,
    registeredAt: '2026-02-18T08:45:00Z',
    provider: '0x3456789012abcdef3456789012abcdef34567890',
  },
  {
    id: 'model-004',
    name: 'LuxAudio-3B',
    version: '0.9.1',
    framework: 'Candle',
    modelHash: '0x1234567890abcdef01234567890abcdef01234567890abcdef01234567890ab',
    parameters: 3_000_000_000,
    registeredAt: '2026-02-17T16:00:00Z',
    provider: '0x1234567890abcdef1234567890abcdef12345678',
  },
  {
    id: 'model-005',
    name: 'ZooClassifier-1B',
    version: '2.1.0',
    framework: 'PyTorch',
    modelHash: '0x567890abcdef01234567890abcdef01234567890abcdef01234567890abcdef',
    parameters: 1_000_000_000,
    registeredAt: '2026-02-16T12:30:00Z',
    provider: '0x4567890123abcdef4567890123abcdef45678901',
  },
];

const DEMO_ATTESTATIONS: ReadonlyArray<AIAttestation> = [
  {
    id: 'att-001', type: 'inference',
    provider: '0x1234567890abcdef1234567890abcdef12345678',
    modelHash: '0xab12cd34ef56789001234567890abcdef01234567890abcdef01234567890ab',
    timestamp: '2026-02-26T09:15:00Z', blockHeight: 142, status: 'verified',
  },
  {
    id: 'att-002', type: 'compute',
    provider: '0x2345678901abcdef2345678901abcdef23456789',
    modelHash: '0xcd34ef56789001234567890abcdef01234567890abcdef01234567890abcdef',
    timestamp: '2026-02-26T09:10:00Z', blockHeight: 141, status: 'verified',
  },
  {
    id: 'att-003', type: 'training',
    provider: '0x3456789012abcdef3456789012abcdef34567890',
    modelHash: '0xef56789001234567890abcdef01234567890abcdef01234567890abcdef0123',
    timestamp: '2026-02-26T09:05:00Z', blockHeight: 140, status: 'pending',
  },
  {
    id: 'att-004', type: 'inference',
    provider: '0x4567890123abcdef4567890123abcdef45678901',
    modelHash: '0x567890abcdef01234567890abcdef01234567890abcdef01234567890abcdef',
    timestamp: '2026-02-26T09:00:00Z', blockHeight: 139, status: 'verified',
  },
  {
    id: 'att-005', type: 'compute',
    provider: '0x1234567890abcdef1234567890abcdef12345678',
    modelHash: '0x1234567890abcdef01234567890abcdef01234567890abcdef01234567890ab',
    timestamp: '2026-02-26T08:55:00Z', blockHeight: 138, status: 'rejected',
  },
  {
    id: 'att-006', type: 'inference',
    provider: '0x2345678901abcdef2345678901abcdef23456789',
    modelHash: '0xab12cd34ef56789001234567890abcdef01234567890abcdef01234567890ab',
    timestamp: '2026-02-26T08:50:00Z', blockHeight: 137, status: 'verified',
  },
  {
    id: 'att-007', type: 'training',
    provider: '0x3456789012abcdef3456789012abcdef34567890',
    modelHash: '0xcd34ef56789001234567890abcdef01234567890abcdef01234567890abcdef',
    timestamp: '2026-02-26T08:45:00Z', blockHeight: 136, status: 'verified',
  },
  {
    id: 'att-008', type: 'compute',
    provider: '0x4567890123abcdef4567890123abcdef45678901',
    modelHash: '0xef56789001234567890abcdef01234567890abcdef01234567890abcdef0123',
    timestamp: '2026-02-26T08:40:00Z', blockHeight: 135, status: 'pending',
  },
];

const DEMO_INFERENCE_RESULTS: ReadonlyArray<AIInferenceResult> = [
  {
    id: 'inf-001', modelId: 'model-001',
    inputHash: '0xaaaa111122223333444455556666777788889999aaaabbbbccccddddeeee0001',
    outputHash: '0xbbbb111122223333444455556666777788889999aaaabbbbccccddddeeee0001',
    confidence: 0.97, latencyMs: 245, timestamp: '2026-02-26T09:15:00Z',
    provider: '0x1234567890abcdef1234567890abcdef12345678',
  },
  {
    id: 'inf-002', modelId: 'model-002',
    inputHash: '0xaaaa111122223333444455556666777788889999aaaabbbbccccddddeeee0002',
    outputHash: '0xbbbb111122223333444455556666777788889999aaaabbbbccccddddeeee0002',
    confidence: 0.94, latencyMs: 180, timestamp: '2026-02-26T09:10:00Z',
    provider: '0x2345678901abcdef2345678901abcdef23456789',
  },
  {
    id: 'inf-003', modelId: 'model-003',
    inputHash: '0xaaaa111122223333444455556666777788889999aaaabbbbccccddddeeee0003',
    outputHash: '0xbbbb111122223333444455556666777788889999aaaabbbbccccddddeeee0003',
    confidence: 0.91, latencyMs: 120, timestamp: '2026-02-26T09:05:00Z',
    provider: '0x3456789012abcdef3456789012abcdef34567890',
  },
  {
    id: 'inf-004', modelId: 'model-005',
    inputHash: '0xaaaa111122223333444455556666777788889999aaaabbbbccccddddeeee0004',
    outputHash: '0xbbbb111122223333444455556666777788889999aaaabbbbccccddddeeee0004',
    confidence: 0.88, latencyMs: 95, timestamp: '2026-02-26T09:00:00Z',
    provider: '0x4567890123abcdef4567890123abcdef45678901',
  },
];

const DEMO_PROVIDERS: ReadonlyArray<AIProvider> = [
  {
    address: '0x1234567890abcdef1234567890abcdef12345678',
    reputation: 98, capacity: 8, totalJobs: 1247, totalEarnings: '42500000000000000000', isActive: true,
  },
  {
    address: '0x2345678901abcdef2345678901abcdef23456789',
    reputation: 95, capacity: 4, totalJobs: 893, totalEarnings: '31200000000000000000', isActive: true,
  },
  {
    address: '0x3456789012abcdef3456789012abcdef34567890',
    reputation: 92, capacity: 16, totalJobs: 2156, totalEarnings: '78900000000000000000', isActive: true,
  },
  {
    address: '0x4567890123abcdef4567890123abcdef45678901',
    reputation: 87, capacity: 2, totalJobs: 456, totalEarnings: '12800000000000000000', isActive: false,
  },
];

interface AChainStatsResponse {
  readonly chain_stats: {
    readonly total_attestations?: number;
    readonly total_models?: number;
    readonly total_inferences?: number;
    readonly total_compute_units?: number;
    readonly unique_providers?: number;
    readonly attestations_by_type?: Record<string, number>;
  };
  readonly dag_stats: {
    readonly total_vertices: number;
  };
}

interface AChainVertex {
  readonly id: string;
  readonly data?: Record<string, unknown>;
  readonly timestamp?: string;
  readonly height?: number;
}

async function fetchIndexerStats(): Promise<AChainStatsResponse | null> {
  try {
    const res = await fetch(`${ ACHAIN_INDEXER_URL }/api/v2/stats`);
    if (!res.ok) return null;
    return await res.json() as AChainStatsResponse;
  } catch {
    return null;
  }
}

async function fetchIndexerVertices(): Promise<ReadonlyArray<AChainVertex>> {
  try {
    const res = await fetch(`${ ACHAIN_INDEXER_URL }/api/v2/vertices`);
    if (!res.ok) return [];
    const data = await res.json() as { items: ReadonlyArray<AChainVertex> | null };
    return data.items ?? [];
  } catch {
    return [];
  }
}

export async function fetchModels(): Promise<ReadonlyArray<AIModel>> {
  const stats = await fetchIndexerStats();
  if (stats && (stats.chain_stats.total_models ?? 0) > 0) {
    const vertices = await fetchIndexerVertices();
    const models = vertices
      .filter((v) => v.data && (v.data as Record<string, unknown>).type === 'model')
      .map((v) => v.data as unknown as AIModel);
    if (models.length > 0) return models;
  }
  return DEMO_MODELS;
}

export async function fetchAttestations(): Promise<ReadonlyArray<AIAttestation>> {
  const stats = await fetchIndexerStats();
  if (stats && (stats.chain_stats.total_attestations ?? 0) > 0) {
    const vertices = await fetchIndexerVertices();
    const attestations = vertices
      .filter((v) => v.data && (v.data as Record<string, unknown>).type === 'attestation')
      .map((v) => v.data as unknown as AIAttestation);
    if (attestations.length > 0) return attestations;
  }
  return DEMO_ATTESTATIONS;
}

export async function fetchInferenceResults(): Promise<ReadonlyArray<AIInferenceResult>> {
  const stats = await fetchIndexerStats();
  if (stats && (stats.chain_stats.total_inferences ?? 0) > 0) {
    const vertices = await fetchIndexerVertices();
    const inferences = vertices
      .filter((v) => v.data && (v.data as Record<string, unknown>).type === 'inference')
      .map((v) => v.data as unknown as AIInferenceResult);
    if (inferences.length > 0) return inferences;
  }
  return DEMO_INFERENCE_RESULTS;
}

export async function fetchProviders(): Promise<ReadonlyArray<AIProvider>> {
  const stats = await fetchIndexerStats();
  if (stats && (stats.chain_stats.unique_providers ?? 0) > 0) {
    const vertices = await fetchIndexerVertices();
    const providers = vertices
      .filter((v) => v.data && (v.data as Record<string, unknown>).type === 'provider')
      .map((v) => v.data as unknown as AIProvider);
    if (providers.length > 0) return providers;
  }
  return DEMO_PROVIDERS;
}

export { ACHAIN_INDEXER_URL };
