// OIDC user profile desktop component.
// Login redirects to lux.id; popover shows account, wallet, settings, and logout.

import type { ButtonProps } from 'toolkit/chakra/button';
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

  return `${ serverUrl }/oauth/authorize?${ params.toString() }`;
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
        <div>
          <IconSvg name="profile"/>
          <div>{ handle }</div>
        </div>
      );
    }
    return (
      <div>
        <IconSvg name="profile"/>
        <div>Sign in</div>
      </div>
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
          className={ `px-2.5 lg:px-3 ${ data ? 'font-bold' : 'font-semibold' }` }
        >
          { buttonLabel }
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px]">
        <PopoverBody>
          { /* Account section — shown when logged in */ }
          { data && (
            <>
              <div>
                Account
              </div>
              <div>
                { data.nickname || data.name || (data.email ? data.email.split('@')[0] : 'User') }
              </div>
              { data.email && (
                <div>
                  { data.email }
                </div>
              ) }
              <Link href="/auth/profile" className="block text-sm px-0 py-1 text-[var(--color-text-primary)] hover:text-[var(--color-link-primary-hover)]" variant="plain">
                My profile
              </Link>
              <Separator className="my-3"/>
            </>
          ) }

          { /* Sign in section — shown when not logged in */ }
          { !data && !isLoading && (
            <>
              <Button
                size="sm"
                className="w-full font-semibold"
                onClick={ handleLoginClick }
                variant="outline"
              >
                Sign in with Lux ID
              </Button>
              <Separator className="my-3"/>
            </>
          ) }

          { /* Wallet section */ }
          { isWalletEnabled && walletAddress && (
            <>
              <div>
                Wallet
              </div>
              <div>
                <AddressEntity
                  address={{ hash: walletAddress, ens_domain_name: walletDomain }}
                  truncation="dynamic"
                />
              </div>
              <Button size="sm" className="w-full" variant="outline" onClick={ handleDisconnectWallet }>
                Disconnect wallet
              </Button>
              <Separator className="my-3"/>
            </>
          ) }
          { isWalletEnabled && !walletAddress && (
            <>
              <Button size="sm" className="w-full" variant="outline" onClick={ handleConnectWallet }>
                Connect wallet
              </Button>
              <Separator className="my-3"/>
            </>
          ) }

          { /* Settings section */ }
          <div>
            Settings
          </div>
          <SettingsColorTheme onSelect={ profileMenu.onClose }/>
          <Separator className="my-3"/>
          <SettingsIdentIcon/>
          <SettingsAddressFormat/>
          <Separator className="my-3"/>
          <div>
            <SettingsScamTokens/>
            <SettingsLocalTime/>
          </div>

          { /* Sign out */ }
          { data && (
            <>
              <Separator className="my-3"/>
              <Button
                size="sm"
                className="w-full"
                variant="outline_danger"
                onClick={ handleLogout }
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
