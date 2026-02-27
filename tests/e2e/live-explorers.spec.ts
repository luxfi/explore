import { test, expect } from '@playwright/test';

// Test configuration for live explorer endpoints
const explorers = [
  {
    name: 'C-Chain (Mainnet)',
    url: 'https://explore.lux.network',
    apiUrl: 'https://api-explore.lux.network',
    expectedBlocks: 17,
    expectedTxs: 86,
    expectedAddresses: 43,
  },
  {
    name: 'Zoo Subnet',
    url: 'https://explore-zoo.lux.network',
    apiUrl: 'https://api-explore-zoo.lux.network',
    expectedBlocks: 14,
    expectedTxs: 82,
    expectedAddresses: 43,
  },
  {
    name: 'Hanzo Subnet',
    url: 'https://explore-hanzo.lux.network',
    apiUrl: 'https://api-explore-hanzo.lux.network',
    expectedBlocks: 10,
    expectedTxs: 46,
    expectedAddresses: 24,
  },
  {
    name: 'SPC Subnet',
    url: 'https://explore-spc.lux.network',
    apiUrl: 'https://api-explore-spc.lux.network',
    expectedBlocks: 10,
    expectedTxs: 45,
    expectedAddresses: 23,
  },
  {
    name: 'Pars Subnet',
    url: 'https://explore-pars.lux.network',
    apiUrl: 'https://api-explore-pars.lux.network',
    expectedBlocks: 9,
    expectedTxs: 45,
    expectedAddresses: 23,
  },
];

test('C-Chain: Load homepage', async({ page }) => {
  const response = await page.goto(explorers[0].url, { waitUntil: 'domcontentloaded' });
  expect(response?.status()).toBeLessThan(400);
});

test('C-Chain: Display page title', async({ page }) => {
  await page.goto(explorers[0].url, { waitUntil: 'domcontentloaded' });
  const title = await page.title();
  expect(title.length).toBeGreaterThan(0);

});

test('C-Chain: API stats endpoint valid', async({ request }) => {
  const response = await request.get(`${ explorers[0].apiUrl }/api/v2/stats`);
  expect(response.status()).toBe(200);

  const stats = await response.json();
  expect(stats).toHaveProperty('total_blocks');
  expect(stats).toHaveProperty('total_transactions');
  expect(stats.total_blocks).toBe(17);
  expect(stats.total_transactions).toBe(86);
  expect(stats.total_addresses).toBe(43);

});

test('C-Chain: API blocks endpoint has data', async({ request }) => {
  const response = await request.get(`${ explorers[0].apiUrl }/api/v2/blocks`);
  expect(response.status()).toBe(200);
  const data = await response.json();
  expect(data.items.length).toBe(17);

});

test('C-Chain: API transactions endpoint has data', async({ request }) => {
  const response = await request.get(`${ explorers[0].apiUrl }/api/v2/transactions`);
  expect(response.status()).toBe(200);
  const data = await response.json();
  expect(data.items.length).toBeGreaterThanOrEqual(50);

});

test('Zoo: Load homepage', async({ page }) => {
  const response = await page.goto(explorers[1].url, { waitUntil: 'domcontentloaded' });
  expect(response?.status()).toBeLessThan(400);
});

test('Zoo: API stats endpoint valid', async({ request }) => {
  const response = await request.get(`${ explorers[1].apiUrl }/api/v2/stats`);
  expect(response.status()).toBe(200);

  const stats = await response.json();
  expect(stats.total_blocks).toBe(14);
  expect(stats.total_transactions).toBe(82);
  expect(stats.total_addresses).toBe(43);

});

test('Zoo: API blocks endpoint has data', async({ request }) => {
  const response = await request.get(`${ explorers[1].apiUrl }/api/v2/blocks`);
  expect(response.status()).toBe(200);
  const data = await response.json();
  expect(data.items.length).toBe(14);

});

test('Zoo: API transactions endpoint has data', async({ request }) => {
  const response = await request.get(`${ explorers[1].apiUrl }/api/v2/transactions`);
  expect(response.status()).toBe(200);
  const data = await response.json();
  expect(data.items.length).toBeGreaterThanOrEqual(50);

});

test('Hanzo: Load homepage', async({ page }) => {
  const response = await page.goto(explorers[2].url, { waitUntil: 'domcontentloaded' });
  expect(response?.status()).toBeLessThan(400);
});

test('Hanzo: API stats endpoint valid', async({ request }) => {
  const response = await request.get(`${ explorers[2].apiUrl }/api/v2/stats`);
  expect(response.status()).toBe(200);

  const stats = await response.json();
  expect(stats.total_blocks).toBe(10);
  expect(stats.total_transactions).toBe(46);
  expect(stats.total_addresses).toBe(24);

});

test('Hanzo: API blocks endpoint has data', async({ request }) => {
  const response = await request.get(`${ explorers[2].apiUrl }/api/v2/blocks`);
  expect(response.status()).toBe(200);
  const data = await response.json();
  expect(data.items.length).toBe(10);

});

test('Hanzo: API transactions endpoint has data', async({ request }) => {
  const response = await request.get(`${ explorers[2].apiUrl }/api/v2/transactions`);
  expect(response.status()).toBe(200);
  const data = await response.json();
  expect(data.items.length).toBeGreaterThanOrEqual(46);

});

test('SPC: Load homepage', async({ page }) => {
  const response = await page.goto(explorers[3].url, { waitUntil: 'domcontentloaded' });
  expect(response?.status()).toBeLessThan(400);
});

test('SPC: API stats endpoint valid', async({ request }) => {
  const response = await request.get(`${ explorers[3].apiUrl }/api/v2/stats`);
  expect(response.status()).toBe(200);

  const stats = await response.json();
  expect(stats.total_blocks).toBe(10);
  expect(stats.total_transactions).toBe(45);
  expect(stats.total_addresses).toBe(23);

});

test('SPC: API blocks endpoint has data', async({ request }) => {
  const response = await request.get(`${ explorers[3].apiUrl }/api/v2/blocks`);
  expect(response.status()).toBe(200);
  const data = await response.json();
  expect(data.items.length).toBe(10);

});

test('SPC: API transactions endpoint has data', async({ request }) => {
  const response = await request.get(`${ explorers[3].apiUrl }/api/v2/transactions`);
  expect(response.status()).toBe(200);
  const data = await response.json();
  expect(data.items.length).toBeGreaterThanOrEqual(45);

});

test('Pars: Load homepage', async({ page }) => {
  const response = await page.goto(explorers[4].url, { waitUntil: 'domcontentloaded' });
  expect(response?.status()).toBeLessThan(400);
});

test('Pars: API stats endpoint valid', async({ request }) => {
  const response = await request.get(`${ explorers[4].apiUrl }/api/v2/stats`);
  expect(response.status()).toBe(200);

  const stats = await response.json();
  expect(stats.total_blocks).toBe(9);
  expect(stats.total_transactions).toBe(45);
  expect(stats.total_addresses).toBe(23);

});

test('Pars: API blocks endpoint has data', async({ request }) => {
  const response = await request.get(`${ explorers[4].apiUrl }/api/v2/blocks`);
  expect(response.status()).toBe(200);
  const data = await response.json();
  expect(data.items.length).toBe(9);

});

test('Pars: API transactions endpoint has data', async({ request }) => {
  const response = await request.get(`${ explorers[4].apiUrl }/api/v2/transactions`);
  expect(response.status()).toBe(200);
  const data = await response.json();
  expect(data.items.length).toBeGreaterThanOrEqual(45);

});

test('Summary: All explorers operational', async({ request }) => {
  for (const explorer of explorers) {
    const statsResponse = await request.get(`${ explorer.apiUrl }/api/v2/stats`);
    expect(statsResponse.ok).toBe(true);
    const stats = await statsResponse.json();
    expect(stats.total_blocks).toBeGreaterThan(0);
    expect(stats.total_transactions).toBeGreaterThan(0);
  }
});
