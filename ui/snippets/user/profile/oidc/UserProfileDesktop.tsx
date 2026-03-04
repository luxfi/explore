// OIDC user profile desktop component.
// Login redirects to lux.id; popover shows account, wallet, settings, and logout.

import { Box, Flex, HStack, VStack } from '@chakra-ui/react';
import type { ButtonProps } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import useWeb3AccountWithDomain from 'lib/web3/useAccountWithDomain';
import useWeb3Wallet from 'lib/web3/useWallet';
import { Button } from 'toolkit/chakra/button';
import { Link } from 'toolkit/chakra/link';
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from 'toolkit/chakra/popover';
import { Separator } from 'toolkit/chakra/separator';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import IconSvg from 'ui/shared/IconSvg';
import useLogout from 'ui/snippets/auth/useLogout';
import useProfileQuery from 'ui/snippets/auth/useProfileQuery';
import SettingsAddressFormat from 'ui/snippets/topBar/settings/SettingsAddressFormat';
import SettingsColorTheme from 'ui/snippets/topBar/settings/SettingsColorTheme';
import SettingsIdentIcon from 'ui/snippets/topBar/settings/SettingsIdentIcon';
import SettingsLocalTime from 'ui/snippets/topBar/settings/SettingsLocalTime';
import SettingsScamTokens from 'ui/snippets/topBar/settings/SettingsScamTokens';

const REDIRECT_URI_PATH = '/auth/callback';
const isWalletEnabled = config.features.blockchainInteraction.isEnabled;

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

  const web3Wallet = useWeb3Wallet({ source: 'Header' });
  const web3AccountWithDomain = useWeb3AccountWithDomain(isWalletEnabled && web3Wallet.isConnected);
  const handleLoginClick = React.useCallback(() => {
    const url = buildOidcLoginUrl();
    if (url) {
      window.location.href = url;
    }
  }, []);

  const handleLogout = React.useCallback(async() => {
    profileMenu.onClose();
    await logout();
  }, [ logout, profileMenu ]);

  const handleOpenChange = React.useCallback(({ open }: { open: boolean }) => {
    if (open) {
      profileMenu.onOpen();
    } else {
      profileMenu.onClose();
    }
  }, [ profileMenu ]);

  const handleConnectWallet = React.useCallback(() => {
    profileMenu.onClose();
    web3Wallet.openModal();
  }, [ profileMenu, web3Wallet ]);

  const handleDisconnectWallet = React.useCallback(() => {
    web3Wallet.disconnect();
  }, [ web3Wallet ]);

  const isLoading = profileQuery.isLoading;
  const data = profileQuery.data;
  const walletAddress = isWalletEnabled ? web3AccountWithDomain.address : undefined;
  const walletDomain = isWalletEnabled ? web3AccountWithDomain.domain : undefined;

  const buttonLabel = (() => {
    if (isLoading) {
      return null;
    }
    if (data) {
      const handle = data.nickname || (data.email ? data.email.split('@')[0] : 'Account');
      return (
        <HStack gap={ 2 }>
          <IconSvg name="profile" boxSize={ 5 }/>
          <Box display={{ base: 'none', md: 'block' }}>{ handle }</Box>
        </HStack>
      );
    }
    return (
      <HStack gap={ 2 }>
        <IconSvg name="profile" boxSize={ 5 }/>
        <Box display={{ base: 'none', md: 'block' }}>Sign in</Box>
      </HStack>
    );
  })();

  return (
    <PopoverRoot
      positioning={{ placement: 'bottom-end' }}
      lazyMount={ false }
      open={ profileMenu.open }
      onOpenChange={ handleOpenChange }
    >
      <PopoverTrigger>
        <Button
          size={ buttonSize }
          variant={ buttonVariant }
          loading={ isLoading }
          selected={ Boolean(data) }
          px={{ base: 2.5, lg: 3 }}
          fontWeight={ data ? 700 : 600 }
        >
          { buttonLabel }
        </Button>
      </PopoverTrigger>
      <PopoverContent w="280px" bg={{ _light: 'white', _dark: 'gray.900' }}>
        <PopoverBody>
          { /* Account section — shown when logged in */ }
          { data && (
            <>
              <Box fontSize="xs" fontWeight={ 600 } color="text.secondary" textTransform="uppercase" letterSpacing="wider" mb={ 2 }>
                Account
              </Box>
              <Box fontSize="sm" fontWeight={ 600 } mb={ 1 }>
                { data.nickname || data.name || (data.email ? data.email.split('@')[0] : 'User') }
              </Box>
              { data.email && (
                <Box fontSize="xs" color="text.secondary" mb={ 2 }>
                  { data.email }
                </Box>
              ) }
              <Link href="/auth/profile" display="block" textStyle="sm" px={ 0 } py={ 1 } color="text.primary" _hover={{ color: 'link.primary.hover' }}>
                My profile
              </Link>
              <Separator my={ 3 }/>
            </>
          ) }

          { /* Sign in section — shown when not logged in */ }
          { !data && !isLoading && (
            <>
              <Button
                size="sm"
                width="full"
                onClick={ handleLoginClick }
                variant="outline"
                fontWeight={ 600 }
              >
                Sign in with Lux ID
              </Button>
              <Separator my={ 3 }/>
            </>
          ) }

          { /* Wallet section */ }
          { isWalletEnabled && walletAddress && (
            <>
              <Box fontSize="xs" fontWeight={ 600 } color="text.secondary" textTransform="uppercase" letterSpacing="wider" mb={ 2 }>
                Wallet
              </Box>
              <Flex alignItems="center" columnGap={ 2 } justifyContent="space-between" mb={ 2 }>
                <AddressEntity
                  address={{ hash: walletAddress, ens_domain_name: walletDomain }}
                  truncation="dynamic"
                  fontSize="sm"
                  fontWeight={ 700 }
                />
              </Flex>
              <Button size="sm" width="full" variant="outline" onClick={ handleDisconnectWallet }>
                Disconnect wallet
              </Button>
              <Separator my={ 3 }/>
            </>
          ) }
          { isWalletEnabled && !walletAddress && (
            <>
              <Button size="sm" width="full" variant="outline" onClick={ handleConnectWallet }>
                Connect wallet
              </Button>
              <Separator my={ 3 }/>
            </>
          ) }

          { /* Settings section */ }
          <Box fontSize="xs" fontWeight={ 600 } color="text.secondary" textTransform="uppercase" letterSpacing="wider" mb={ 2 }>
            Settings
          </Box>
          <SettingsColorTheme onSelect={ profileMenu.onClose }/>
          <Separator my={ 3 }/>
          <SettingsIdentIcon/>
          <SettingsAddressFormat/>
          <Separator my={ 3 }/>
          <VStack gap={ 1 }>
            <SettingsScamTokens/>
            <SettingsLocalTime/>
          </VStack>

          { /* Sign out */ }
          { data && (
            <>
              <Separator my={ 3 }/>
              <Button
                size="sm"
                width="full"
                variant="outline"
                onClick={ handleLogout }
                color="red.400"
                borderColor="red.400"
                _hover={{ bg: 'red.400', color: 'white' }}
              >
                Sign out
              </Button>
            </>
          ) }
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
};

export default React.memo(UserProfileOidc);
