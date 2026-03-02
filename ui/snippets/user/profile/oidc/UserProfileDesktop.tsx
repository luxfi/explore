// OIDC-specific user profile desktop component.
// Login redirects to lux.id; shows name/email + logout when authenticated.

import { Box, Flex } from '@chakra-ui/react';
import type { ButtonProps } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import shortenString from 'lib/shortenString';
import { Button } from 'toolkit/chakra/button';
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from 'toolkit/chakra/popover';
import { Separator } from 'toolkit/chakra/separator';
import { Link } from 'toolkit/chakra/link';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';
import IconSvg from 'ui/shared/IconSvg';
import useLogout from 'ui/snippets/auth/useLogout';
import useProfileQuery from 'ui/snippets/auth/useProfileQuery';

const REDIRECT_URI_PATH = '/auth/callback';

function buildOidcLoginUrl(): string {
  const feature = config.features.account;
  if (!feature.isEnabled || feature.authProvider !== 'oidc' || !feature.oidc) {
    return '';
  }
  const { serverUrl, clientId } = feature.oidc;
  const redirectUri = `${ window.location.origin }${ REDIRECT_URI_PATH }`;
  const state = crypto.randomUUID();
  sessionStorage.setItem('oidc_state', state);

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'openid profile email',
    state,
  });

  return `${ serverUrl }/login/oauth/authorize?${ params.toString() }`;
}

interface Props {
  buttonSize?: ButtonProps['size'];
  buttonVariant?: ButtonProps['variant'];
}

const UserProfileOidc = ({ buttonSize, buttonVariant = 'header' }: Props) => {
  const profileQuery = useProfileQuery();
  const profileMenu = useDisclosure();
  const logout = useLogout();

  const handleButtonClick = React.useCallback(() => {
    if (profileQuery.data) {
      profileMenu.onOpen();
      return;
    }
    const url = buildOidcLoginUrl();
    if (url) {
      window.location.href = url;
    }
  }, [ profileQuery.data, profileMenu ]);

  const handleLogout = React.useCallback(async() => {
    profileMenu.onClose();
    await logout();
  }, [ logout, profileMenu ]);

  const handleMenuOpenChange = React.useCallback(({ open }: { open: boolean }) => {
    !open && profileMenu.onOpenChange({ open });
  }, [ profileMenu ]);

  const isLoading = profileQuery.isLoading;
  const data = profileQuery.data;

  const buttonLabel = (() => {
    if (isLoading) {
      return null;
    }
    if (data) {
      const handle = data.email ? data.email.split('@')[0] : 'My account';
      return (
        <Flex align="center" gap={ 2 }>
          <IconSvg name="profile" boxSize={ 5 }/>
          <Box display={{ base: 'none', md: 'block' }}>{ handle }</Box>
        </Flex>
      );
    }
    return 'Log in';
  })();

  return (
    <PopoverRoot
      positioning={{ placement: 'bottom-end' }}
      open={ profileMenu.open }
      onOpenChange={ handleMenuOpenChange }
    >
      <PopoverTrigger>
        <Button
          size={ buttonSize }
          variant={ buttonVariant }
          onClick={ handleButtonClick }
          loading={ isLoading }
          selected={ Boolean(data) }
          px={{ base: 2.5, lg: 3 }}
          fontWeight={ data ? 700 : 600 }
        >
          { buttonLabel }
        </Button>
      </PopoverTrigger>
      { data && profileMenu.open && (
        <PopoverContent w="220px">
          <PopoverBody>
            <Flex direction="column" gap={ 2 } py={ 1 }>
              <Box fontSize="sm" color="text.secondary" px={ 1 }>
                { data.email ?? shortenString(String(data.id ?? '')) }
              </Box>
              <Separator/>
              <Link href="/auth/profile" textStyle="sm" color="text.primary" px={ 1 }>
                My profile
              </Link>
              <Button variant="ghost" size="sm" onClick={ handleLogout } colorPalette="red" justifyContent="flex-start" px={ 1 }>
                Sign out
              </Button>
            </Flex>
          </PopoverBody>
        </PopoverContent>
      ) }
    </PopoverRoot>
  );
};

export default React.memo(UserProfileOidc);
