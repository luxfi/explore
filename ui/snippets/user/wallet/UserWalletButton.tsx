import { Button, type ButtonProps } from '@luxfi/ui/button';
import { Tooltip } from '@luxfi/ui/tooltip';
import React from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';
import shortenString from 'lib/shortenString';
import IconSvg from 'ui/shared/IconSvg';

import UserIdenticon from '../UserIdenticon';

interface Props {
  size?: ButtonProps['size'];
  variant?: ButtonProps['variant'];
  isPending?: boolean;
  isAutoConnectDisabled?: boolean;
  address?: string;
  domain?: string;
}

const UserWalletButton = ({ size, variant, isPending, isAutoConnectDisabled, address, domain, ...rest }: Props, ref: React.ForwardedRef<HTMLButtonElement>) => {

  const isMobile = useIsMobile();

  const content = (() => {
    if (address) {
      const text = domain || shortenString(address);
      return (
        <div className="flex items-center gap-2 min-w-0">
          <UserIdenticon address={ address } isAutoConnectDisabled={ isAutoConnectDisabled }/>
          <div className="truncate">{ text }</div>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <IconSvg name="profile" className="w-5 h-5 shrink-0"/>
        <div>Menu</div>
      </div>
    );
  })();

  return (
    <Tooltip
      content="Settings & wallet"
      disabled={ isMobile || Boolean(address) }
      openDelay={ 500 }
      disableOnMobile
    >
      <span>
        <Button
          ref={ ref }
          size={ size }
          variant={ variant }
          selected={ Boolean(address) }
          highlighted={ isAutoConnectDisabled }
          className={ `px-2.5 lg:px-3 ${ address ? 'font-bold' : 'font-semibold' }` }
          loading={ isPending }
          loadingText={ isMobile ? undefined : 'Connecting' }
          { ...rest }
        >
          { content }
        </Button>
      </span>
    </Tooltip>
  );
};

export default React.memo(React.forwardRef(UserWalletButton));
