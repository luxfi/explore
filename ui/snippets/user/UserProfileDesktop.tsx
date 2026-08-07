import type { ButtonProps } from '@luxfi/ui/button';

import config from 'configs/app';
import UserProfileOidc from 'ui/snippets/user/profile/oidc/UserProfileDesktop';
import UserWalletDesktop from 'ui/snippets/user/wallet/UserWalletDesktop';

interface Props {
  buttonSize?: ButtonProps['size'];
  buttonVariant?: ButtonProps['variant'];
}

// Two states, not three providers: account sign-in is Hanzo IAM, or it is off
// and this is the wallet/settings menu. The switch that used to pick between
// auth0, Dynamic and OIDC is gone with the providers themselves.
const UserProfileDesktop = ({ buttonSize, buttonVariant = 'header' }: Props) => {
  if (config.features.account.isEnabled) {
    return <UserProfileOidc buttonSize={ buttonSize } buttonVariant={ buttonVariant }/>;
  }

  return <UserWalletDesktop buttonSize={ buttonSize } buttonVariant={ buttonVariant }/>;
};

export default UserProfileDesktop;
