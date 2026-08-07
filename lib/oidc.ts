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
 * The same held for userinfo: the profile query asked `<issuer>/api/userinfo`,
 * which is a 404 (and an /api/ path, which we do not serve). IAM's own
 * discovery document names every endpoint below:
 *
 *   userinfo_endpoint    /v1/iam/oauth/userinfo
 *   end_session_endpoint /v1/iam/oauth/logout
 *
 * Never reconstruct these paths at a call site. Import from here.
 */
const OAUTH_BASE = '/v1/iam/oauth';

const STATE_KEY = 'oidc_state';
const VERIFIER_KEY = 'oidc_code_verifier';

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
function endpoint(serverUrl: string, name: 'authorize' | 'token' | 'userinfo' | 'logout'): string {
  return `${ serverUrl.replace(/\/$/, '') }${ OAUTH_BASE }/${ name }`;
}

function base64url(bytes: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(bytes)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// PKCE. This client holds no secret — it cannot, it runs in the browser — so
// the code_verifier is the only thing binding the redeemed code to the page
// that asked for it. IAM advertises S256 in its discovery document.
async function challengeFor(verifier: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));
  return base64url(digest);
}

/**
 * Authorization-code login URL. Stores the CSRF state in sessionStorage so
 * `exchangeCode` can verify it on the way back. Returns '' when OIDC is off.
 */
export async function buildLoginUrl(redirectPath: string): Promise<string> {
  const oidc = getOidc();
  if (!oidc) {
    return '';
  }

  const state = crypto.randomUUID();
  const verifier = base64url(crypto.getRandomValues(new Uint8Array(32)).buffer);
  sessionStorage.setItem(STATE_KEY, state);
  sessionStorage.setItem(VERIFIER_KEY, verifier);

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: oidc.clientId,
    redirect_uri: `${ window.location.origin }${ redirectPath }`,
    scope: 'openid profile email',
    state,
    code_challenge: await challengeFor(verifier),
    code_challenge_method: 'S256',
  });

  return `${ endpoint(oidc.serverUrl, 'authorize') }?${ params.toString() }`;
}

/** Where to send the browser to end the IdP session, or '' when OIDC is off. */
export function buildLogoutUrl(returnPath: string): string {
  const oidc = getOidc();
  if (!oidc) {
    return '';
  }

  const params = new URLSearchParams({
    client_id: oidc.clientId,
    post_logout_redirect_uri: `${ window.location.origin }${ returnPath }`,
  });

  return `${ endpoint(oidc.serverUrl, 'logout') }?${ params.toString() }`;
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

  const verifier = sessionStorage.getItem(VERIFIER_KEY);
  sessionStorage.removeItem(VERIFIER_KEY);

  const response = await fetch(endpoint(oidc.serverUrl, 'token'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: `${ window.location.origin }${ redirectPath }`,
      client_id: oidc.clientId,
      ...(verifier ? { code_verifier: verifier } : {}),
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

export interface UserInfoResponse {
  readonly sub?: string;
  readonly name?: string;
  readonly preferred_username?: string;
  readonly displayName?: string;
  readonly email?: string;
  readonly picture?: string;
  readonly avatar?: string;
}

/** The signed-in user, straight from IAM's userinfo endpoint. */
export async function fetchUserInfo(token: string): Promise<UserInfoResponse> {
  const oidc = getOidc();
  if (!oidc) {
    throw new Error('OIDC authentication is not configured');
  }

  const response = await fetch(endpoint(oidc.serverUrl, 'userinfo'), {
    headers: { Authorization: `Bearer ${ token }` },
  });

  if (!response.ok) {
    throw new Error(`userinfo failed: ${ response.status }`);
  }

  return await response.json() as UserInfoResponse;
}
