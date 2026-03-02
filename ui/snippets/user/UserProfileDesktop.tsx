import dynamic from 'next/dynamic';

import config from 'configs/app';
import type { ButtonProps } from '@luxfi/ui/button';
import UserProfileAuth0 from 'ui/snippets/user/profile/auth0/UserProfileDesktop';
import UserProfileOidc from 'ui/snippets/user/profile/oidc/UserProfileDesktop';
import UserWalletDesktop from 'ui/snippets/user/wallet/UserWalletDesktop';

const UserProfileDynamic = dynamic(() => import('ui/snippets/user/profile/dynamic/UserProfile'), { ssr: false });

interface Props {
  buttonSize?: ButtonProps['size'];
  buttonVariant?: ButtonProps['variant'];
}

const UserProfileDesktop = ({ buttonSize, buttonVariant = 'header' }: Props) => {
  const accountFeature = config.features.account;
  if (accountFeature.isEnabled) {
    switch (accountFeature.authProvider) {
      case 'auth0':
        return <UserProfileAuth0 buttonSize={ buttonSize } buttonVariant={ buttonVariant }/>;
      case 'dynamic':
        return <UserProfileDynamic buttonSize={ buttonSize } buttonVariant={ buttonVariant }/>;
      case 'oidc':
        return <UserProfileOidc buttonSize={ buttonSize } buttonVariant={ buttonVariant }/>;
    }
  }
  // Always render the wallet/settings menu — it handles both wallet and settings
  return <UserWalletDesktop buttonSize={ buttonSize } buttonVariant={ buttonVariant }/>;
};

export default UserProfileDesktop;
