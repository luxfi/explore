import React from 'react';

import { Button } from '@luxfi/ui/button';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';

import AuthModal from './AuthModal';
import useIsAuth from './useIsAuth';

interface Props {
  flow: 'email_login' | 'email_link';
}

const AuthModalStory = ({ flow }: Props) => {
  const authModal = useDisclosure();
  const isAuth = useIsAuth();

  const initialScreen = flow === 'email_login' ? { type: 'select_method' as const } : { type: 'email' as const, isAuth: true };

  const handleClose = React.useCallback(() => {
    authModal.onClose();
  }, [ authModal ]);

  return (
    <>
      <Button onClick={ authModal.onOpen }>{ flow === 'email_login' ? 'Log in' : 'Link email' }</Button>
      { authModal.open && <AuthModal initialScreen={ initialScreen } onClose={ handleClose }/> }
      <div>Status: { isAuth ? 'Authenticated' : 'Not authenticated' }</div>
    </>
  );
};

export default AuthModalStory;
