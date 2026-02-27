import { test, expect } from '@playwright/test';

// Test configuration for live explorer endpoints.
// Use >= checks — block/tx counts only grow over time.
const explorers = [
  {
    name: 'C-Chain (Mainnet)',
    url: 'https://explore.lux.network',
    apiUrl: 'https://api-explore.lux.network',
    minBlocks: 10,
    minTxs: 45,
  },
  {
    name: 'Zoo Subnet',
    url: 'https://explore-zoo.lux.network',
    apiUrl: 'https://api-explore-zoo.lux.network',
    minBlocks: 10,
    minTxs: 45,
  },
  {
    name: 'Hanzo Subnet',
    url: 'https://explore-hanzo.lux.network',
    apiUrl: 'https://api-explore-hanzo.lux.network',
    minBlocks: 9,
    minTxs: 45,
  },
  {
    name: 'SPC Subnet',
    url: 'https://explore-spc.lux.network',
    apiUrl: 'https://api-explore-spc.lux.network',
    minBlocks: 9,
    minTxs: 45,
  },
  {
    name: 'Pars Subnet',
    url: 'https://explore-pars.lux.network',
    apiUrl: 'https://api-explore-pars.lux.network',
    minBlocks: 9,
    minTxs: 45,
  },
];

for (const explorer of explorers) {
  test.describe(explorer.name, () => {
    test('homepage loads', async({ page }) => {
      const response = await page.goto(explorer.url, { waitUntil: 'domcontentloaded' });
      expect(response?.status()).toBeLessThan(400);
    });

    test('page has title', async({ page }) => {
      await page.goto(explorer.url, { waitUntil: 'networkidle' });
      const title = await page.title();
      expect(title.length).toBeGreaterThan(0);
    });

    test('API stats endpoint', async({ request }) => {
      const response = await request.get(`${ explorer.apiUrl }/api/v2/stats`);
      expect(response.status()).toBe(200);

      const stats = await response.json();
      expect(stats).toHaveProperty('total_blocks');
      expect(stats).toHaveProperty('total_transactions');
      expect(Number(stats.total_blocks)).toBeGreaterThanOrEqual(explorer.minBlocks);
      expect(Number(stats.total_transactions)).toBeGreaterThanOrEqual(explorer.minTxs);
    });

    test('API blocks endpoint has data', async({ request }) => {
      const response = await request.get(`${ explorer.apiUrl }/api/v2/blocks`);
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.items.length).toBeGreaterThanOrEqual(1);
    });

    test('API transactions endpoint has data', async({ request }) => {
      const response = await request.get(`${ explorer.apiUrl }/api/v2/transactions`);
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.items.length).toBeGreaterThanOrEqual(1);
    });
  });
}

test('All explorers operational', async({ request }) => {
  for (const explorer of explorers) {
    const statsResponse = await request.get(`${ explorer.apiUrl }/api/v2/stats`);
    expect(statsResponse.ok()).toBe(true);
    const stats = await statsResponse.json();
    expect(Number(stats.total_blocks)).toBeGreaterThan(0);
    expect(Number(stats.total_transactions)).toBeGreaterThan(0);
  }
});
