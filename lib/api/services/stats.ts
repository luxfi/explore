import type { ApiResource } from '../types';
import type * as stats from '@luxfi/stats-types';

export const STATS_API_RESOURCES = {
  counters: {
    path: '/v1/counters',
  },
  lines: {
    path: '/v1/lines',
  },
  line: {
    path: '/v1/lines/:id',
    pathParams: [ 'id' as const ],
  },
  pages_main: {
    path: '/v1/pages/main',
  },
  pages_transactions: {
    path: '/v1/pages/transactions',
  },
  pages_contracts: {
    path: '/v1/pages/contracts',
  },
} satisfies Record<string, ApiResource>;

export type StatsApiResourceName = `stats:${ keyof typeof STATS_API_RESOURCES }`;

/* eslint-disable @stylistic/indent */
export type StatsApiResourcePayload<R extends StatsApiResourceName> =
R extends 'stats:counters' ? stats.Counters :
R extends 'stats:lines' ? stats.LineCharts :
R extends 'stats:line' ? stats.LineChart :
R extends 'stats:pages_main' ? stats.MainPageStats :
R extends 'stats:pages_transactions' ? stats.TransactionsPageStats :
R extends 'stats:pages_contracts' ? stats.ContractsPageStats :
never;
/* eslint-enable @stylistic/indent */
