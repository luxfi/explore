import React from 'react';

import type { ScreenSuccess } from '../types';
import type { UserInfo } from 'types/api/account';

import type * as mixpanel from 'lib/mixpanel';
import ReCaptcha from 'ui/shared/reCaptcha/ReCaptcha';
import useReCaptcha from 'ui/shared/reCaptcha/useReCaptcha';

import useSignInWithWallet from '../useSignInWithWallet';

interface Props {
  onSuccess: (screen: ScreenSuccess) => void;
  onError: (isAuth?: boolean) => void;
  isAuth?: boolean;
  source?: mixpanel.EventPayload<mixpanel.EventTypes.WALLET_CONNECT>['Source'];
  loginToRewards?: boolean;
}

const AuthModalScreenConnectWallet = ({ onSuccess, onError, isAuth, source, loginToRewards }: Props) => {
  const isStartedRef = React.useRef(false);
  const recaptcha = useReCaptcha();

  const handleSignInSuccess = React.useCallback(({ address, profile, rewardsToken }: { address: string; profile: UserInfo; rewardsToken?: string }) => {
    onSuccess({ type: 'success_wallet', address, isAuth, profile, rewardsToken });
  }, [ onSuccess, isAuth ]);

  const handleSignInError = React.useCallback(() => {
    onError(isAuth);
  }, [ onError, isAuth ]);

  const { start } = useSignInWithWallet({
    onSuccess: handleSignInSuccess,
    onError: handleSignInError,
    source,
    isAuth,
    fetchProtectedResource: recaptcha.fetchProtectedResource,
    loginToRewards,
  });

  React.useEffect(() => {
    if (!isStartedRef.current) {
      isStartedRef.current = true;
      start();
    }
  }, [ start ]);

  return (
    <div className="flex items-center justify-center min-h-[100px] flex-col">
      { !recaptcha.isInitError && <div className="animate-spin rounded-full border-2 border-current border-t-transparent h-8 w-8"/> }
      <ReCaptcha { ...recaptcha }/>
    </div>
  );
};

export default React.memo(AuthModalScreenConnectWallet);
