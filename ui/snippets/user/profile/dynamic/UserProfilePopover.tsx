import { DynamicConnectButton, useAuthenticateConnectedUser } from '@dynamic-labs/sdk-react-core';
import React from 'react';

import { Button } from 'toolkit/chakra/button';
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from 'toolkit/chakra/popover';

import UserWalletAutoConnectAlert from '../../UserWalletAutoConnectAlert';
import UserProfileContentWallet from '../common/UserProfileContentWallet';

interface Props {
  children: React.ReactNode;
  isAutoConnectDisabled: boolean;
}

const UserProfilePopover = ({ children, isAutoConnectDisabled }: Props) => {

  const { authenticateUser } = useAuthenticateConnectedUser();

  return (
    <PopoverRoot positioning={{ placement: 'bottom-end' }}>
      <PopoverTrigger>
        { children }
      </PopoverTrigger>
      <PopoverContent className="w-[280px]">
        <PopoverBody
          className="[&_.dynamic-login-button]:w-full"
        >
          { isAutoConnectDisabled && <UserWalletAutoConnectAlert/> }
          <UserProfileContentWallet/>
          <DynamicConnectButton buttonClassName="dynamic-login-button">
            <Button className="mt-3 w-full" onClick={ authenticateUser } size="sm">Log in</Button>
          </DynamicConnectButton>
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
};

export default React.memo(UserProfilePopover);
