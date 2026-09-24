// P-Chain wire types: GET /v1/chain/P/ops/{validators,blockchains,height}.
// The contract is the node's OpenAPI document at ops/.well-known/openapi.json;
// the Go shapes are ~/work/lux/node/vms/platformvm/api/static_service.go.

export interface PChainRewardOwner {
  readonly locktime: string;
  readonly threshold: string;
  readonly addresses: ReadonlyArray<string>;
}

export interface PChainDelegator {
  readonly txID: string;
  readonly startTime: string;
  readonly endTime: string;
  readonly weight: string;
  readonly nodeID: string;
  readonly potentialReward?: string;
  readonly rewardOwner?: PChainRewardOwner;
}

export interface PChainValidator {
  readonly txID: string;
  readonly startTime: string;
  readonly endTime: string;

  /** The validator's own stake in nLUX; its delegators' is delegatorWeight. */
  readonly weight: string;
  readonly nodeID: string;
  readonly delegationFee: string;
  readonly potentialReward?: string;
  readonly connected?: boolean;
  readonly uptime: string;
  readonly delegatorCount?: string;
  readonly delegatorWeight?: string;

  /** Only on a read that names this one validator (?nodeIDs=<its NodeID>). */
  readonly delegators?: ReadonlyArray<PChainDelegator>;
}

// Wire field is `netID` (Lux nomenclature: a sovereign L1 is a Network).
export interface PChainBlockchain {
  readonly id: string;
  readonly name: string;
  readonly netID: string;
  readonly vmID: string;
}

export interface GetCurrentValidatorsResponse {
  readonly validators: ReadonlyArray<PChainValidator>;
}

export interface GetBlockchainsResponse {
  readonly blockchains: ReadonlyArray<PChainBlockchain>;
}

/** An unsigned 64-bit integer, carried as a decimal string. */
export interface GetHeightResponse {
  readonly height: string;
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
