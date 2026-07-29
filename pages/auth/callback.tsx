import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

import * as cookies from 'lib/cookies';
import { consumeState, exchangeCode, getOidc } from 'lib/oidc';
import { Link } from 'toolkit/next/link';

const COOKIE_MAX_AGE_DAYS = 7;
const REDIRECT_URI_PATH = '/auth/callback';

const OidcCallback: NextPage = () => {
  const router = useRouter();
  const [ error, setError ] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!getOidc()) {
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

    if (!consumeState(typeof state === 'string' ? state : undefined)) {
      setError('Invalid state parameter - possible CSRF attack');
      return;
    }

    const run = async() => {
      try {
        const tokenData = await exchangeCode(code, REDIRECT_URI_PATH);

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

    run();
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
