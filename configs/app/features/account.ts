import type { Feature } from './types';
import type { AuthProvider } from 'types/client/account';

import app from '../app';
import services from '../services';
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
  dynamic?: {
    environmentId: string;
  };
  oidc?: {
    serverUrl: string;
    clientId: string;
  };
  apiKeysButton: boolean | string;
}> = (() => {

  if (
    !app.isPrivateMode &&
    getEnvValue('NEXT_PUBLIC_IS_ACCOUNT_SUPPORTED') === 'true'
  ) {
    const authProvider = getEnvValue('NEXT_PUBLIC_ACCOUNT_AUTH_PROVIDER');
    const dynamicEnvironmentId = getEnvValue('NEXT_PUBLIC_ACCOUNT_DYNAMIC_ENVIRONMENT_ID');
    const oidcServerUrl = getEnvValue('NEXT_PUBLIC_OIDC_SERVER_URL');
    const oidcClientId = getEnvValue('NEXT_PUBLIC_OIDC_CLIENT_ID');

    if (authProvider === 'dynamic' && dynamicEnvironmentId) {
      return Object.freeze({
        title,
        isEnabled: true,
        authProvider: 'dynamic',
        dynamic: {
          environmentId: dynamicEnvironmentId,
        },
        apiKeysButton,
      });
    }

    if (authProvider === 'oidc' && oidcServerUrl && oidcClientId) {
      return Object.freeze({
        title,
        isEnabled: true,
        authProvider: 'oidc',
        oidc: {
          serverUrl: oidcServerUrl,
          clientId: oidcClientId,
        },
      });
    }

    if (services.reCaptchaV2.siteKey) {
      return Object.freeze({
        title,
        isEnabled: true,
        authProvider: 'auth0',
        apiKeysButton,
      });
    }

    // Fallback: if OIDC env vars are set without explicit provider, enable OIDC
    if (oidcServerUrl && oidcClientId) {
      return Object.freeze({
        title,
        isEnabled: true,
        authProvider: 'oidc',
        oidc: {
          serverUrl: oidcServerUrl,
          clientId: oidcClientId,
        },
      });
    }
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
