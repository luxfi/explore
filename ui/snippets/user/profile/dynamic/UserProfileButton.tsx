import React from 'react';

import { useMarketplaceContext } from 'lib/contexts/marketplace';
import { cn } from 'lib/utils/cn';
import shortenString from 'lib/shortenString';
import useAccountWithDomain from 'lib/web3/useAccountWithDomain';
import { Button, type ButtonProps } from 'toolkit/chakra/button';
import IconSvg from 'ui/shared/IconSvg';

import UserIdenticon from '../../UserIdenticon';
import { getUserHandle } from '../common/utils';

interface Props extends ButtonProps {
  email?: string;
}

const UserProfileButton = ({ selected, email, className, ...rest }: Props) => {
  const { isAutoConnectDisabled } = useMarketplaceContext();
  const accountWithDomain = useAccountWithDomain(true);

  const isLoading = accountWithDomain.isLoading;

  const content = (() => {
    if (selected && !isLoading) {
      return accountWithDomain.address ? (
        <div>
          <UserIdenticon address={ accountWithDomain.address } isAutoConnectDisabled={ isAutoConnectDisabled }/>
          <div>
            { accountWithDomain.domain || shortenString(accountWithDomain.address) }
          </div>
        </div>
      ) : (
        <div>
          <IconSvg name="profile"/>
          <div>{ email ? getUserHandle(email) : 'My profile' }</div>
        </div>
      );
    }

    return 'Log in';
  })();

  return (
    <Button
      className={ cn('px-2.5 lg:px-3', selected && 'font-bold', className) }
      selected={ selected }
      highlighted={ isAutoConnectDisabled }
      loading={ isLoading }
      { ...rest }
    >
      { content }
    </Button>
  );
};

export default React.memo(UserProfileButton);
