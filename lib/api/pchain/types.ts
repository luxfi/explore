// P-chain API response types for the Lux platform JSON-RPC API.

export interface PChainRewardOwner {
  readonly locktime: string;
  readonly threshold: string;
  readonly addresses: ReadonlyArray<string>;
}

export interface PChainDelegator {
  readonly txID: string;
  readonly startTime: string;
  readonly endTime: string;
  readonly stakeAmount: string;
  readonly nodeID: string;
  readonly potentialReward: string;
  readonly rewardOwner: PChainRewardOwner;
}

export interface PChainValidator {
  readonly txID: string;
  readonly startTime: string;
  readonly endTime: string;
  readonly stakeAmount?: string; // may be absent; use weight instead
  readonly nodeID: string;
  readonly weight: string;
  readonly delegationFee: string;
  readonly potentialReward: string;
  readonly connected?: boolean;
  readonly uptime: string;
  readonly delegators: ReadonlyArray<PChainDelegator> | null;
}

export interface PChainBlockchain {
  readonly id: string;
  readonly name: string;
  readonly subnetID: string;
  readonly vmID: string;
}

export interface PChainSubnet {
  readonly id: string;
  readonly controlKeys: ReadonlyArray<string>;
  readonly threshold: string;
}

// JSON-RPC response wrappers

export interface GetCurrentValidatorsResponse {
  readonly validators: ReadonlyArray<PChainValidator>;
}

export interface GetBlockchainsResponse {
  readonly blockchains: ReadonlyArray<PChainBlockchain>;
}

export interface GetSubnetsResponse {
  readonly subnets: ReadonlyArray<PChainSubnet>;
}

// Aggregated validator statistics

export interface ValidatorStats {
  readonly totalStake: bigint;
  readonly validatorCount: number;
  readonly connectedCount: number;
  readonly delegatorCount: number;
  readonly totalDelegatedStake: bigint;
  readonly averageUptime: number;
}
