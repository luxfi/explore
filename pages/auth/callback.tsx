import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

import config from 'configs/app';
import * as cookies from 'lib/cookies';
import { Link } from 'toolkit/next/link';

const COOKIE_MAX_AGE_DAYS = 7;

const OidcCallback: NextPage = () => {
  const router = useRouter();
  const [ error, setError ] = React.useState<string | null>(null);

  React.useEffect(() => {
    const feature = config.features.account;
    if (!feature.isEnabled || feature.authProvider !== 'oidc' || !feature.oidc) {
      setError('OIDC authentication is not configured');
      return;
    }

    const { code, state, error: oauthError, error_description: oauthErrorDesc } = router.query;

    if (oauthError) {
      setError(typeof oauthErrorDesc === 'string' ? oauthErrorDesc : String(oauthError));
      return;
    }

    if (!code || typeof code !== 'string') {
      // Query params not yet populated on initial render
      return;
    }

    // Verify CSRF state
    const savedState = sessionStorage.getItem('oidc_state');
    if (!savedState || state !== savedState) {
      setError('Invalid state parameter - possible CSRF attack');
      return;
    }
    sessionStorage.removeItem('oidc_state');

    const exchangeCode = async() => {
      try {
        const oidc = feature.oidc;
        if (!oidc) {
          return;
        }
        const { serverUrl, clientId } = oidc;
        const redirectUri = `${ window.location.origin }/auth/callback`;

        const tokenResponse = await fetch(`${ serverUrl }/oauth/token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: redirectUri,
            client_id: clientId,
          }),
        });

        if (!tokenResponse.ok) {
          const errorBody = await tokenResponse.text();
          throw new Error(`Token exchange failed: ${ errorBody }`);
        }

        const tokenData = await tokenResponse.json() as {
          access_token: string;
          id_token?: string;
          refresh_token?: string;
          expires_in?: number;
        };

        // Store the access token in the API_TOKEN cookie
        const expiresInDays = tokenData.expires_in ?
          Math.ceil(tokenData.expires_in / 86400) :
          COOKIE_MAX_AGE_DAYS;
        cookies.set(cookies.NAMES.API_TOKEN, tokenData.access_token, { expires: expiresInDays });

        // Redirect to profile page
        router.replace('/auth/profile');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Authentication failed');
      }
    };

    exchangeCode();
  }, [ router ]);

  if (error) {
    return (
      <PageNextJs pathname="/auth/callback">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="flex flex-col items-center gap-4">
            <span className="text-xl font-bold text-red-500">Authentication Error</span>
            <span className="text-gray-400">{ error }</span>
            <Link href="/" color="gray.400">
              Return to home
            </Link>
          </div>
        </div>
      </PageNextJs>
    );
  }

  return (
    <PageNextJs pathname="/auth/callback">
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full border-2 border-current border-t-transparent h-10 w-10"/>
          <span className="text-lg">Completing sign in...</span>
        </div>
      </div>
    </PageNextJs>
  );
};

export default OidcCallback;
