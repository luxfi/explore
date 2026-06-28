// Single source of truth for the Lux PRIMARY-network VM chains.
//
// The Lux primary network is not one chain but a family of VM-specialized
// blockchains that share one validator set — mirrored from the node registry
// at ~/work/lux/node/node/vms.go (P/X/C core + the extended allvms set:
// A,B,D,G,I,K,M,O,Q,R,T,Z). Each chain runs its OWN vmID and therefore its own
// data model: C is EVM blocks, X is a UTXO/DAG, D is a DEX order book, etc.
//
// This axis is ORTHOGONAL to the sovereign-L1 brand axis in chainRegistry.ts
// (Lux / Zoo / Hanzo / Pars / SPC / Osage). These VM chains belong to the Lux
// primary network ONLY, so they surface ONLY on the Lux primary explorer — see
// isPrimaryNetworkExplorer(). Brand explorers never list them.
//
// `view` selects which UI renders a chain's native model. `hasBespokeView`
// derives whether that view is VM-native today or a graceful generic fallback
// (so callers can flag the chains still awaiting a bespoke explorer).

export type PrimaryVmView = 'evm' | 'platform' | 'utxo' | 'dex' | 'generic';

export interface PrimaryVm {

  /** Route slug — the chain renders at /chains/<slug>. */
  readonly slug: string;

  /** Short display name, e.g. "C-Chain". */
  readonly name: string;

  /** Full display name, e.g. "Contract Chain". */
  readonly fullName: string;

  /** VM label as the node registers it, e.g. "EVM", "DexVM". */
  readonly vm: string;

  /** P-Chain vmID where known (core chains), else '' (extended VMs). */
  readonly vmId: string;

  /** EVM chainId where the chain has one (C-Chain), else null. */
  readonly chainId: number | null;

  /** One-line description for the chain detail header. */
  readonly description: string;

  /** Which UI renders this chain's native data model. */
  readonly view: PrimaryVmView;
}

// Views backed by a VM-native render today. Everything else falls back to the
// generic chain-detail view (info + indexer stats + validators) and is FLAGGED
// by chainsAwaitingBespokeView() as still needing a bespoke explorer.
const BESPOKE_VIEWS: ReadonlySet<PrimaryVmView> = new Set<PrimaryVmView>([ 'evm', 'platform', 'dex' ]);

export const PRIMARY_VMS: ReadonlyArray<PrimaryVm> = [
  {
    slug: 'c-chain',
    name: 'C-Chain',
    fullName: 'Contract Chain',
    vm: 'EVM',
    vmId: 'mgj786NP7uDwBCcq6YwThhaN8FLyybkCa4zBWTQbNgmK6k9A6',
    chainId: 96369,
    description: 'The C-Chain is an EVM-compatible blockchain on the network used for smart contracts and DeFi applications.',
    view: 'evm',
  },
  {
    slug: 'p-chain',
    name: 'P-Chain',
    fullName: 'Platform Chain',
    vm: 'PVM',
    vmId: 'rWhpuQPF1kb72esV2momhMuTYGkEb1oL29pt2EBXWsBY6MALT',
    chainId: null,
    description: 'The P-Chain manages validators, staking, and subnet creation across the network.',
    view: 'platform',
  },
  {
    slug: 'x-chain',
    name: 'X-Chain',
    fullName: 'UTXO Chain',
    vm: 'XVM',
    vmId: 'jvYyfQTxGMJLuGWa55kdP2p2zSUYsQ5Raupu4TW34ZAUBAbtq',
    chainId: null,
    description: 'The X-Chain is a DAG-based chain for creating and exchanging digital assets on the network.',
    view: 'utxo',
  },
  {
    slug: 'd-chain',
    name: 'D-Chain',
    fullName: 'DEX Chain',
    vm: 'DexVM',
    vmId: '',
    chainId: null,
    description: 'The D-Chain is a decentralized exchange chain on the network for on-chain order books and token swaps.',
    view: 'dex',
  },
  {
    slug: 'a-chain',
    name: 'A-Chain',
    fullName: 'AI Chain',
    vm: 'AIVM',
    vmId: '',
    chainId: null,
    description: 'The A-Chain powers AI workloads on the network, providing decentralized inference and model serving.',
    view: 'generic',
  },
  {
    slug: 'b-chain',
    name: 'B-Chain',
    fullName: 'Bridge Chain',
    vm: 'BridgeVM',
    vmId: '',
    chainId: null,
    description: 'The B-Chain is the bridge relay chain on the network, enabling cross-chain asset transfers via Teleporter.',
    view: 'generic',
  },
  {
    slug: 'q-chain',
    name: 'Q-Chain',
    fullName: 'Quantum Chain',
    vm: 'QuantumVM',
    vmId: '',
    chainId: null,
    description: 'The Q-Chain provides post-quantum cryptographic primitives and quantum-resistant operations on the network.',
    view: 'generic',
  },
  {
    slug: 't-chain',
    name: 'T-Chain',
    fullName: 'Threshold Chain',
    vm: 'ThresholdVM',
    vmId: '',
    chainId: null,
    description: 'The T-Chain enables threshold signature schemes and distributed key generation on the network.',
    view: 'generic',
  },
  {
    slug: 'z-chain',
    name: 'Z-Chain',
    fullName: 'ZK Chain',
    vm: 'ZKVM',
    vmId: '',
    chainId: null,
    description: 'The Z-Chain handles zero-knowledge proof generation and verification on the network.',
    view: 'generic',
  },
  {
    slug: 'g-chain',
    name: 'G-Chain',
    fullName: 'Graph Chain',
    vm: 'GraphVM',
    vmId: '',
    chainId: null,
    description: 'The G-Chain provides decentralized graph indexing and query services on the network.',
    view: 'generic',
  },
  {
    slug: 'k-chain',
    name: 'K-Chain',
    fullName: 'Key Chain',
    vm: 'KeyVM',
    vmId: '',
    chainId: null,
    description: 'The K-Chain provides decentralized key management and custody services on the network.',
    view: 'generic',
  },
  {
    slug: 'o-chain',
    name: 'O-Chain',
    fullName: 'Oracle Chain',
    vm: 'OracleVM',
    vmId: '',
    chainId: null,
    description: 'The O-Chain provides decentralized oracle services, bringing off-chain data on-chain for the network.',
    view: 'generic',
  },
  {
    slug: 'r-chain',
    name: 'R-Chain',
    fullName: 'Relay Chain',
    vm: 'RelayVM',
    vmId: '',
    chainId: null,
    description: 'The R-Chain handles cross-chain message relay and interoperability routing on the network.',
    view: 'generic',
  },
  {
    slug: 'i-chain',
    name: 'I-Chain',
    fullName: 'Identity Chain',
    vm: 'IdentityVM',
    vmId: '',
    chainId: null,
    description: 'The I-Chain manages decentralized identity, DIDs, and verifiable credentials on the network.',
    view: 'generic',
  },
  {
    slug: 'm-chain',
    name: 'M-Chain',
    fullName: 'MPC Chain',
    vm: 'MPCVM',
    vmId: '',
    chainId: null,
    description: 'The M-Chain coordinates CGGMP21 threshold ECDSA and FROST threshold EdDSA signing sessions across validators.',
    view: 'generic',
  },
];

export function getPrimaryVm(slug: string): PrimaryVm | undefined {
  return PRIMARY_VMS.find((vm) => vm.slug === slug.toLowerCase());
}

/** True when `view` has a VM-native render today (not the generic fallback). */
export function hasBespokeView(view: PrimaryVmView): boolean {
  return BESPOKE_VIEWS.has(view);
}

/** Chains that still render via the generic fallback — the bespoke-view backlog. */
export function chainsAwaitingBespokeView(): ReadonlyArray<PrimaryVm> {
  return PRIMARY_VMS.filter((vm) => !hasBespokeView(vm.view));
}
