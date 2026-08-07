import type { Feature } from './types';
import type { AuthProvider } from 'types/client/account';

import app from '../app';
import { getEnvValue } from '../utils';

const title = 'My account';

const apiKeysButton = (() => {
  const value = getEnvValue('NEXT_PUBLIC_ACCOUNT_API_KEYS_BUTTON');
  if (value === undefined || value === 'true') {
    return true;
  }
  if (value === 'false') {
    return false;
  }
  return value;
})();

const config: Feature<{
  isEnabled: true;
  authProvider: AuthProvider;
  oidc: {
    serverUrl: string;
    clientId: string;
  };
  apiKeysButton: boolean | string;
}> = (() => {

  // Sign-in is Hanzo IAM over OIDC and nothing else. The auth0 (email + OTP +
  // reCAPTCHA) and Dynamic.xyz branches that used to sit here are gone with
  // their implementations: both spoke to Blockscout's /account/* backend, which
  // this deployment does not run — every one of those endpoints 404s — and both
  // were a second gate beside the one we own.
  //
  // NEXT_PUBLIC_ACCOUNT_AUTH_PROVIDER is still read so an explicit `oidc` is
  // honoured and an explicit anything-else is a visible no-op rather than a
  // silent fallback into a provider that no longer exists.
  const authProvider = getEnvValue('NEXT_PUBLIC_ACCOUNT_AUTH_PROVIDER');
  const serverUrl = getEnvValue('NEXT_PUBLIC_OIDC_SERVER_URL');
  const clientId = getEnvValue('NEXT_PUBLIC_OIDC_CLIENT_ID');

  if (
    !app.isPrivateMode &&
    getEnvValue('NEXT_PUBLIC_IS_ACCOUNT_SUPPORTED') === 'true' &&
    (authProvider === undefined || authProvider === 'oidc') &&
    serverUrl &&
    clientId
  ) {
    return Object.freeze({
      title,
      isEnabled: true,
      authProvider: 'oidc',
      oidc: { serverUrl, clientId },
      apiKeysButton,
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
