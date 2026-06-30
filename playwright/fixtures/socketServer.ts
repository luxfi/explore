import type { TestFixture, Page } from '@playwright/test';
import http from 'node:http';

import type { AddressCoinBalanceHistoryItem, AddressTokensBalancesSocketMessage } from 'types/api/address';
import type { NewBlockSocketResponse } from 'types/api/block';
import type { SmartContractVerificationResponse } from 'types/api/contract';
import type { TokenInstanceMetadataSocketMessage } from 'types/api/token';
import type { TokenTransfer } from 'types/api/tokenTransfer';
import type { Transaction } from 'types/api/transaction';

import { port as socketPort } from '../utils/socket';

// Component-test realtime harness. The app speaks Server-Sent Events to the
// Lux explorer backend's multiplexed `/v1/base/realtime` endpoint (see
// lib/socket/sse.ts), so this fixture is a minimal SSE server rather than a
// Phoenix WebSocket mock. `createSocket` / `joinChannel` / `sendMessage`
// keep their signatures so the consumer specs are unchanged; `sendMessage`
// emits the backend's `{ event, topic, data }` envelope, addressing a
// channel directly via the optional `topic` field the adapter routes off.

// SSEStream is the server side of one open EventSource stream. Tests
// push frames into it with sendMessage().
export class SSEStream {
  constructor(private readonly res: http.ServerResponse) {}

  send(frame: string) {
    this.res.write(frame);
  }
}

export type CreateSocketFixture = () => Promise<SSEStream>;

type Channel = [string, string, string];

export interface SocketServerFixture {
  createSocket: CreateSocketFixture;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createSocket: TestFixture<CreateSocketFixture, { page: Page }> = async({ page }, use) => {
  const openResponses = new Set<http.ServerResponse>();
  let resolveConnection: (conn: SSEStream) => void;
  const connectionPromise = new Promise<SSEStream>((resolve) => {
    resolveConnection = resolve;
  });

  const server = http.createServer((req, res) => {
    if (req.method === 'HEAD') {
      res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Access-Control-Allow-Origin': '*' });
      res.end();
      return;
    }

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    });
    res.write('event: CONNECT\ndata: {}\n\n');

    openResponses.add(res);
    res.on('close', () => openResponses.delete(res));
    resolveConnection(new SSEStream(res));
  });

  await new Promise<void>((resolve) => server.listen(socketPort, resolve));

  await use(() => connectionPromise);

  openResponses.forEach((res) => res.end());
  await new Promise<void>((resolve) => server.close(() => resolve()));
};

// SSE is a single read-only multiplexed stream — there is no per-topic join
// handshake. `socket` is kept for call-site compatibility; the returned token
// is what sendMessage() addresses.
export const joinChannel = (socket: SSEStream, channelName: string): Promise<Channel> => {
  return Promise.resolve([ '', '', channelName ]);
};

export function sendMessage(socket: SSEStream, channel: Channel, msg: 'coin_balance', payload: { coin_balance: AddressCoinBalanceHistoryItem }): void;
export function sendMessage(socket: SSEStream, channel: Channel, msg: 'token_balance', payload: { block_number: number }): void;
export function sendMessage(socket: SSEStream, channel: Channel, msg: `updated_token_balances_${ string }`, payload: AddressTokensBalancesSocketMessage): void;
export function sendMessage(socket: SSEStream, channel: Channel, msg: 'transaction', payload: { transaction: number }): void;
export function sendMessage(socket: SSEStream, channel: Channel, msg: 'transaction', payload: { transactions: Array<Transaction> }): void;
export function sendMessage(socket: SSEStream, channel: Channel, msg: 'pending_transaction', payload: { pending_transaction: number }): void;
export function sendMessage(socket: SSEStream, channel: Channel, msg: 'pending_transaction', payload: { pending_transactions: Array<Transaction> }): void;
export function sendMessage(socket: SSEStream, channel: Channel, msg: 'new_block', payload: NewBlockSocketResponse): void;
export function sendMessage(socket: SSEStream, channel: Channel, msg: 'verification_result', payload: SmartContractVerificationResponse): void;
export function sendMessage(socket: SSEStream, channel: Channel, msg: 'total_supply', payload: { total_supply: number }): void;
export function sendMessage(socket: SSEStream, channel: Channel, msg: 'changed_bytecode', payload: Record<string, never>): void;
export function sendMessage(socket: SSEStream, channel: Channel, msg: 'fetched_bytecode', payload: { fetched_bytecode: string }): void;
export function sendMessage(socket: SSEStream, channel: Channel, msg: 'eth_bytecode_db_lookup_started', payload: Record<string, never>): void;
export function sendMessage(socket: SSEStream, channel: Channel, msg: 'smart_contract_was_verified', payload: Record<string, never>): void;
export function sendMessage(socket: SSEStream, channel: Channel, msg: 'smart_contract_was_not_verified', payload: Record<string, never>): void;
export function sendMessage(socket: SSEStream, channel: Channel, msg: 'token_transfer', payload: { token_transfers: Array<TokenTransfer> }): void;
export function sendMessage(socket: SSEStream, channel: Channel, msg: 'fetched_token_instance_metadata', payload: TokenInstanceMetadataSocketMessage): void;
export function sendMessage(socket: SSEStream, channel: Channel, msg: string, payload: unknown): void {
  socket.send(`data: ${ JSON.stringify({ event: msg, topic: channel[2], data: payload }) }\n\n`);
}
