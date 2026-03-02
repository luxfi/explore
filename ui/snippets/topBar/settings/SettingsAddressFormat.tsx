import React from 'react';

import config from 'configs/app';
import { BECH_32_SEPARATOR } from 'lib/address/bech32';
import { useSettingsContext } from 'lib/contexts/settings';
import { Switch } from '@luxfi/ui/switch';

const SettingsAddressFormat = () => {
  const settingsContext = useSettingsContext();

  if (!settingsContext || config.UI.views.address.hashFormat.availableFormats.length < 2) {
    return null;
  }

  const { addressFormat, toggleAddressFormat } = settingsContext;

  return (
    <Switch
      id="address-format"
      defaultChecked={ addressFormat === 'bech32' }
      onChange={ toggleAddressFormat }
      className="mt-4 justify-between w-full"
      direction="rtl"
    >
      Show { config.UI.views.address.hashFormat.bech32Prefix }{ BECH_32_SEPARATOR } format
    </Switch>
  );
};

export default React.memo(SettingsAddressFormat);
