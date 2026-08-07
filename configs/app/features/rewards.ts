import type { Feature } from './types';

const title = 'Rewards service integration';

const config: Feature<{}> = (() => {
  // Off, permanently. Merits is Blockscout's hosted rewards service and its
  // sign-in was auth0's — email + OTP against /account/*, which this deployment
  // does not run. The gate here used to read `authProvider === 'auth0'`, so
  // deleting that provider already made this unreachable; stating it is honest
  // about the fact rather than leaving a condition that can never be true.
  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
