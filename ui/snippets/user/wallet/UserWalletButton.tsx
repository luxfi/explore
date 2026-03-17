import { Box, HStack } from '@chakra-ui/react';
import React from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';
import shortenString from 'lib/shortenString';
import { Button, type ButtonProps } from 'toolkit/chakra/button';
import { Tooltip } from 'toolkit/chakra/tooltip';
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
        <HStack gap={ 2 }>
          <UserIdenticon address={ address } isAutoConnectDisabled={ isAutoConnectDisabled }/>
          <Box display={{ base: 'none', md: 'block' }}>{ text }</Box>
        </HStack>
      );
    }

    return (
      <HStack gap={ 2 }>
        <IconSvg name="profile" boxSize={ 5 }/>
        <Box display={{ base: 'none', md: 'block' }}>Menu</Box>
      </HStack>
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
