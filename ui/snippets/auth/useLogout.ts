import { toaster } from '@luxfi/ui/toaster';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

import type { Route } from 'nextjs-routes';

import { getResourceKey } from 'lib/api/useApiQuery';
import * as cookies from 'lib/cookies';
import * as mixpanel from 'lib/mixpanel';
import { buildLogoutUrl } from 'lib/oidc';

const PROTECTED_ROUTES: Array<Route['pathname']> = [
  '/account/api-key',
  '/account/custom-abi',
  '/account/merits',
  '/account/tag-address',
  '/account/verified-addresses',
  '/account/watchlist',
];

export default function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return React.useCallback(async() => {
    try {
      cookies.remove(cookies.NAMES.API_TOKEN);

      mixpanel.logEvent(mixpanel.EventTypes.ACCOUNT_ACCESS, { Action: 'Logged out' }, { send_immediately: true });
      mixpanel.reset();

      if (
        PROTECTED_ROUTES.includes(router.pathname) ||
          (router.pathname === '/txs' && router.query.tab === 'watchlist')
      ) {
        await router.push({ pathname: '/' }, undefined, { shallow: true });
      }

      queryClient.resetQueries({ queryKey: [ 'oidc_profile' ] });
      queryClient.resetQueries({
        queryKey: getResourceKey('general:custom_abi'),
        exact: true,
      });

      // End the IdP session last: this navigates away.
      const logoutUrl = buildLogoutUrl('/');
      if (logoutUrl) {
        window.location.href = logoutUrl;
      }
    } catch (error) {
      toaster.error({
        title: 'Logout failed',
        description: 'Please try again later',
      });
    }
  }, [ queryClient, router ]);
}
