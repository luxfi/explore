import { Separator } from '@luxfi/ui/separator';
import React from 'react';

import delay from 'lib/delay';
import { Button } from '@luxfi/ui/button';
import { IconButton } from '@luxfi/ui/icon-button';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import IconSvg from 'ui/shared/IconSvg';
import SettingsAddressFormat from 'ui/snippets/topBar/settings/SettingsAddressFormat';
import SettingsColorTheme from 'ui/snippets/topBar/settings/SettingsColorTheme';
import SettingsIdentIcon from 'ui/snippets/topBar/settings/SettingsIdentIcon';
import SettingsLocalTime from 'ui/snippets/topBar/settings/SettingsLocalTime';
import SettingsScamTokens from 'ui/snippets/topBar/settings/SettingsScamTokens';

import UserWalletAutoConnectAlert from '../UserWalletAutoConnectAlert';

interface Props {
  address?: string;
  domain?: string;
  isAutoConnectDisabled?: boolean;
  isReconnecting?: boolean;
  isWalletEnabled?: boolean;
  onDisconnect: () => void;
  onOpenWallet: () => void;
  onCloseMenu: () => void;
}

const UserWalletMenuContent = ({
  isAutoConnectDisabled,
  address,
  domain,
  isReconnecting,
  isWalletEnabled,
  onDisconnect,
  onOpenWallet,
  onCloseMenu,
}: Props) => {

  const handleOpenWalletClick = React.useCallback(async() => {
    await delay(100);
    onOpenWallet();
  }, [ onOpenWallet ]);

  const handleConnectClick = React.useCallback(() => {
    onCloseMenu();
    onOpenWallet();
  }, [ onCloseMenu, onOpenWallet ]);

  return (
    <div>
      { /* Wallet section */ }
      { isWalletEnabled && address && (
        <>
          { isAutoConnectDisabled && <UserWalletAutoConnectAlert/> }
          <span>My wallet</span>
          <div>
            <AddressEntity
              address={{ hash: address, ens_domain_name: domain }}
              truncation="dynamic"
            />
            { isReconnecting ? <div className="animate-spin rounded-full border-2 border-current border-t-transparent h-4 w-4 m-[2px] shrink-0"/> : (
              <IconButton
                aria-label="Open wallet"
                variant="icon_secondary"
                size="2xs"
                onClick={ handleOpenWalletClick }
              >
                <IconSvg name="gear"/>
              </IconButton>
            ) }
          </div>
          <Button size="sm" className="w-full mt-3" variant="outline" onClick={ onDisconnect }>
            Disconnect
          </Button>
          <Separator/>
        </>
      ) }
      { isWalletEnabled && !address && (
        <>
          <Button size="sm" className="w-full" variant="outline" onClick={ handleConnectClick }>
            Connect wallet
          </Button>
          <Separator/>
        </>
      ) }
      { /* Settings section */ }
      <SettingsColorTheme onSelect={ onCloseMenu }/>
      <Separator/>
      <SettingsIdentIcon/>
      <SettingsAddressFormat/>
      <Separator/>
      <div>
        <SettingsScamTokens/>
        <SettingsLocalTime/>
      </div>
    </div>
  );
};

export default React.memo(UserWalletMenuContent);
