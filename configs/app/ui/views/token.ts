import { getEnvValue } from 'configs/app/utils';

const TEST_TOKEN_ADDRESSES: ReadonlySet<string> = new Set([
  // UsdCoin (USDC) — test/fake deployments
  '0x3569c06a80c148d7b4b67f8a06125f6d59774243',
  '0x8031e9b0d02a792cfefaa2bdca6e1289d385426f',
  '0xa85eb8e163f4d70bfc43a4f3fcc9a8dfc42b1ae4',
  // Tether (USDT) — test/fake deployments
  '0x724f4ef0400386fc8c1011788af733bd367ac00f',
  '0x79608e442d046ea6d3125931a33ce971ad99c6f9',
  '0xdf1de693c31e2a5eb869c329529623556b20abf3',
]);

const config = Object.freeze({
  hideScamTokensEnabled: getEnvValue('NEXT_PUBLIC_VIEWS_TOKEN_SCAM_TOGGLE_ENABLED') === 'true',
  testTokenAddresses: TEST_TOKEN_ADDRESSES,
});

export default config;
