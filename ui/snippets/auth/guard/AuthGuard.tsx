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

// The one gate. Sign-in is Hanzo IAM and nothing else: there is no local
// password, no OTP, no wallet-signature login and no second provider to pick
// between. An unauthenticated click leaves for the IdP and comes back through
// /auth/callback.
const AuthGuard = ({ children, onAuthSuccess, ensureEmail }: Props) => {
  const profileQuery = useProfileQuery();

  const handleClick = React.useCallback(async() => {
    const login = async() => {
      // async because the PKCE challenge is a SubtleCrypto digest.
      const loginUrl = await buildLoginUrl(REDIRECT_URI_PATH);
      if (loginUrl) {
        window.location.href = loginUrl;
      }
    };

    if (profileQuery.data) {
      if (ensureEmail && !profileQuery.data.email) {
        // Signed in, but the IdP released no email — send them back to it
        // rather than asking for one here.
        await login();
      } else {
        onAuthSuccess();
      }
      return;
    }

    // The callback may have written the token before the profile query ran.
    if (cookies.get(cookies.NAMES.API_TOKEN)) {
      onAuthSuccess();
      return;
    }

    await login();
  }, [ profileQuery.data, ensureEmail, onAuthSuccess ]);

  return (
    <>
      { children({ onClick: handleClick }) }
    </>
  );
};

export default React.memo(AuthGuard);
