import { Center, Flex, Spinner, Text } from '@chakra-ui/react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

import config from 'configs/app';
import * as cookies from 'lib/cookies';

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
    if (savedState && state !== savedState) {
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
        <Center minH="50vh">
          <Flex direction="column" alignItems="center" gap={ 4 }>
            <Text fontSize="xl" fontWeight="bold" color="red.500">Authentication Error</Text>
            <Text color="gray.400">{ error }</Text>
            <Text
              as="a"
              href="/"
              color="blue.400"
              _hover={{ textDecoration: 'underline' }}
            >
              Return to home
            </Text>
          </Flex>
        </Center>
      </PageNextJs>
    );
  }

  return (
    <PageNextJs pathname="/auth/callback">
      <Center minH="50vh">
        <Flex direction="column" alignItems="center" gap={ 4 }>
          <Spinner size="xl"/>
          <Text fontSize="lg">Completing sign in...</Text>
        </Flex>
      </Center>
    </PageNextJs>
  );
};

export default OidcCallback;
