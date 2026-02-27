// B-Chain (Bridge Chain) API response types.

export interface BridgeSignerSetInfo {
  readonly threshold: number;
  readonly signers: ReadonlyArray<string>;
  readonly epoch: number;
}

export interface BridgeEpochInfo {
  readonly epoch: number;
  readonly startBlock: number;
  readonly endBlock: number;
  readonly signerCount: number;
}

export interface BridgeOverviewStats {
  readonly signerCount: number;
  readonly threshold: number;
  readonly epoch: number;
  readonly waitlistSize: number;
}
