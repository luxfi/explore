import React from 'react';

import * as cookies from 'lib/cookies';
import { buildLoginUrl } from 'lib/oidc';

import useProfileQuery from '../useProfileQuery';

interface InjectedProps {
  onClick: () => void;
}

interface Props {
  children: (props: InjectedProps) => React.ReactNode;
  onAuthSuccess: () => void;
  ensureEmail?: boolean;
}

const REDIRECT_URI_PATH = '/auth/callback';

const AuthGuardOidc = ({ children, onAuthSuccess, ensureEmail }: Props) => {
  const profileQuery = useProfileQuery();

  const handleClick = React.useCallback(() => {
    if (profileQuery.data) {
      if (ensureEmail && !profileQuery.data.email) {
        // User is logged in but has no email -- redirect to login again
        const loginUrl = buildLoginUrl(REDIRECT_URI_PATH);
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
      const loginUrl = buildLoginUrl(REDIRECT_URI_PATH);
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
