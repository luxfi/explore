import React from 'react';

import config from 'configs/app';
import * as cookies from 'lib/cookies';

import useProfileQuery from '../useProfileQuery';

interface InjectedProps {
  onClick: () => void;
}

interface Props {
  children: (props: InjectedProps) => React.ReactNode;
  onAuthSuccess: () => void;
  ensureEmail?: boolean;
}

function getOidcLoginUrl(): string {
  const feature = config.features.account;
  if (!feature.isEnabled || feature.authProvider !== 'oidc' || !feature.oidc) {
    return '';
  }

  const { serverUrl, clientId } = feature.oidc;
  const redirectUri = `${ window.location.origin }/auth/callback`;
  const state = crypto.randomUUID();

  // Store state for CSRF protection
  sessionStorage.setItem('oidc_state', state);

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'openid profile email',
    state,
  });

  return `${ serverUrl }/oauth/authorize?${ params.toString() }`;
}

const AuthGuardOidc = ({ children, onAuthSuccess, ensureEmail }: Props) => {
  const profileQuery = useProfileQuery();

  const handleClick = React.useCallback(() => {
    if (profileQuery.data) {
      if (ensureEmail && !profileQuery.data.email) {
        // User is logged in but has no email -- redirect to login again
        const loginUrl = getOidcLoginUrl();
        if (loginUrl) {
          window.location.href = loginUrl;
        }
      } else {
        onAuthSuccess();
      }
    } else {
      // Check if we have a token cookie (user might have logged in via callback)
      const apiToken = cookies.get(cookies.NAMES.API_TOKEN);
      if (apiToken) {
        onAuthSuccess();
        return;
      }

      // Redirect to IAM login
      const loginUrl = getOidcLoginUrl();
      if (loginUrl) {
        window.location.href = loginUrl;
      }
    }
  }, [ profileQuery.data, ensureEmail, onAuthSuccess ]);

  return (
    <>
      { children({ onClick: handleClick }) }
    </>
  );
};

export default React.memo(AuthGuardOidc);
