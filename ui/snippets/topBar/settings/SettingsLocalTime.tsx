import React from 'react';

import { useSettingsContext } from 'lib/contexts/settings';
import { Switch } from '@luxfi/ui/switch';

const SettingsLocalTime = () => {
  const settingsContext = useSettingsContext();

  if (!settingsContext) {
    return null;
  }

  const { isLocalTime, toggleIsLocalTime } = settingsContext;

  return (
    <Switch
      id="local-time"
      defaultChecked={ isLocalTime }
      onChange={ toggleIsLocalTime }
      direction="rtl"
      className="justify-between w-full min-h-[34px]"
    >
      Local time format
    </Switch>
  );
};

export default React.memo(SettingsLocalTime);
