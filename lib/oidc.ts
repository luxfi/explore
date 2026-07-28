import config from 'configs/app';

/**
 * The one place that knows where the IdP's OAuth endpoints live.
 *
 * IAM serves OAuth under `/v1/iam/oauth/*` and nothing else. The bare
 * `/oauth/authorize` and `/oauth/token` that pages used to build by hand are
 * not routes at all — the IdP's SPA catch-all answers them with `200
 * text/html`, so a hand-built authorize silently renders the wrong page and a
 * hand-built token exchange passes `response.ok` and then dies parsing HTML as
 * JSON. Measured on lux.id:
 *
 *   /oauth/authorize        200 text/html   (SPA shell — silent failure)
 *   /v1/iam/oauth/authorize 400 text/plain  (real endpoint)
 *   /oauth/token            200 text/html   (SPA shell — silent failure)
 *   /v1/iam/oauth/token     401 application/json (real endpoint)
 *
 * Never reconstruct these paths at a call site. Import from here.
 */
const OAUTH_BASE = '/v1/iam/oauth';

const STATE_KEY = 'oidc_state';

interface Oidc {
  serverUrl: string;
  clientId: string;
}

/** The configured OIDC provider, or null when account auth is off. */
export function getOidc(): Oidc | null {
  const feature = config.features.account;
  if (!feature.isEnabled || feature.authProvider !== 'oidc' || !feature.oidc) {
    return null;
  }
  return feature.oidc;
}

/** Absolute URL of an IAM OAuth endpoint on the configured issuer. */
function endpoint(serverUrl: string, name: 'authorize' | 'token'): string {
  return `${ serverUrl.replace(/\/$/, '') }${ OAUTH_BASE }/${ name }`;
}

/**
 * Authorization-code login URL. Stores the CSRF state in sessionStorage so
 * `exchangeCode` can verify it on the way back. Returns '' when OIDC is off.
 */
export function buildLoginUrl(redirectPath: string): string {
  const oidc = getOidc();
  if (!oidc) {
    return '';
  }

  const state = crypto.randomUUID();
  sessionStorage.setItem(STATE_KEY, state);

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: oidc.clientId,
    redirect_uri: `${ window.location.origin }${ redirectPath }`,
    scope: 'openid profile email',
    state,
  });

  return `${ endpoint(oidc.serverUrl, 'authorize') }?${ params.toString() }`;
}

/** True when `state` matches the nonce stored by `buildLoginUrl`. */
export function consumeState(state: string | undefined): boolean {
  const saved = sessionStorage.getItem(STATE_KEY);
  if (!saved || state !== saved) {
    return false;
  }
  sessionStorage.removeItem(STATE_KEY);
  return true;
}

export interface TokenResponse {
  access_token: string;
  id_token?: string;
  refresh_token?: string;
  expires_in?: number;
}

/** Exchange an authorization code for tokens at IAM's token endpoint. */
export async function exchangeCode(code: string, redirectPath: string): Promise<TokenResponse> {
  const oidc = getOidc();
  if (!oidc) {
    throw new Error('OIDC authentication is not configured');
  }

  const response = await fetch(endpoint(oidc.serverUrl, 'token'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: `${ window.location.origin }${ redirectPath }`,
      client_id: oidc.clientId,
    }),
  });

  if (!response.ok) {
    throw new Error(`Token exchange failed: ${ await response.text() }`);
  }

  // A 200 that is not JSON means we hit the IdP's SPA shell, not its token
  // endpoint. Say so, instead of dying inside JSON.parse.
  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    throw new Error(`Token endpoint returned ${ contentType || 'no content-type' }, not JSON`);
  }

  return await response.json() as TokenResponse;
}
