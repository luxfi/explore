import type { UseQueryResult } from '@tanstack/react-query';
import React, { useCallback, useState } from 'react';

import type { UserInfo } from 'types/api/account';

import { useMarketplaceContext } from 'lib/contexts/marketplace';
import useIsMobile from 'lib/hooks/useIsMobile';
import shortenString from 'lib/shortenString';
import useWeb3AccountWithDomain from 'lib/web3/useAccountWithDomain';
import { Button } from 'toolkit/chakra/button';
import { Tooltip } from 'toolkit/chakra/tooltip';
import IconSvg from 'ui/shared/IconSvg';

import UserIdenticon from '../../UserIdenticon';
import { getUserHandle } from '../common/utils';

import type { ButtonProps } from 'toolkit/chakra/button';

interface Props {
  profileQuery: UseQueryResult<UserInfo, unknown>;
  size?: ButtonProps['size'];
  variant?: ButtonProps['variant'];
  onClick: () => void;
  isPending?: boolean;
}

const UserProfileButton = ({ profileQuery, size, variant, onClick, isPending, ...rest }: Props, ref: React.ForwardedRef<HTMLButtonElement>) => {
  const [ isFetched, setIsFetched ] = useState(false);
  const isMobile = useIsMobile();

  const { data, isLoading } = profileQuery;
  const web3AccountWithDomain = useWeb3AccountWithDomain(true);
  const { isAutoConnectDisabled } = useMarketplaceContext();

  React.useEffect(() => {
    if (!isLoading) {
      setIsFetched(true);
    }
  }, [ isLoading ]);

  const handleFocus = useCallback((e: React.FocusEvent<HTMLButtonElement>) => {
    e.preventDefault();
  }, []);

  const isButtonLoading = isPending || !isFetched || web3AccountWithDomain.isLoading;
  const dataExists = !isButtonLoading && (Boolean(data) || Boolean(web3AccountWithDomain.address));

  const content = (() => {
    if (web3AccountWithDomain.address && !isButtonLoading) {
      return (
        <div>
          <UserIdenticon address={ web3AccountWithDomain.address } isAutoConnectDisabled={ isAutoConnectDisabled }/>
          <div>
            { web3AccountWithDomain.domain || shortenString(web3AccountWithDomain.address) }
          </div>
        </div>
      );
    }

    if (!data || isButtonLoading) {
      return 'Log in';
    }

    return (
      <div>
        <IconSvg name="profile"/>
        <div>{ data.email ? getUserHandle(data.email) : 'My profile' }</div>
      </div>
    );
  })();

  return (
    <Tooltip
      content={ <span>Sign in to My Account to add tags,<br/>create watchlists, access API keys and more</span> }
      disabled={ isMobile || isLoading || Boolean(data) }
      openDelay={ 500 }
      disableOnMobile
    >
      <span>
        <Button
          ref={ ref }
          size={ size }
          variant={ variant }
          onClick={ onClick }
          onFocus={ handleFocus }
          selected={ dataExists }
          highlighted={ isAutoConnectDisabled }
          className="px-2.5 lg:px-3"
          loading={ isButtonLoading }
          { ...rest }
        >
          { content }
        </Button>
      </span>
    </Tooltip>
  );
};

export default React.forwardRef(UserProfileButton);
