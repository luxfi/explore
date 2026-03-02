import React from 'react';

import { Separator } from '@luxfi/ui/separator';
import { IconButton } from '@luxfi/ui/icon-button';
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from '@luxfi/ui/popover';
import { Tooltip } from '@luxfi/ui/tooltip';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';
import IconSvg from 'ui/shared/IconSvg';

import SettingsAddressFormat from './SettingsAddressFormat';
import SettingsColorTheme from './SettingsColorTheme';
import SettingsIdentIcon from './SettingsIdentIcon';
import SettingsLocalTime from './SettingsLocalTime';
import SettingsPoorReputationTokens from './SettingsPoorReputationTokens';
import SettingsScamTokens from './SettingsScamTokens';

const Settings = () => {
  const popover = useDisclosure();
  const tooltip = useDisclosure();

  const handlePopoverOpenChange = React.useCallback(({ open }: { open: boolean }) => {
    open && tooltip.onClose();
    popover.onOpenChange({ open });
  }, [ popover, tooltip ]);

  const handleTooltipOpenChange = React.useCallback(({ open }: { open: boolean }) => {
    if (!popover.open) {
      tooltip.onOpenChange({ open });
    }
  }, [ popover, tooltip ]);

  return (
    <PopoverRoot
      positioning={{ placement: 'bottom-start' }}
      open={ popover.open }
      onOpenChange={ handlePopoverOpenChange }
      // should be false to enable auto-switch to default color theme
      lazyMount={ false }
    >
      <Tooltip content="Website settings" disableOnMobile open={ tooltip.open } onOpenChange={ handleTooltipOpenChange }>
        <div className="flex items-center">
          <PopoverTrigger>
            <IconButton
              variant="link"
              size="2xs"
              className="rounded-sm"
              aria-label="User settings"
            >
              <IconSvg name="gear"/>
            </IconButton>
          </PopoverTrigger>
        </div>
      </Tooltip>
      <PopoverContent className="overflow-y-hidden text-sm" style={{ width: 'auto' }}>
        <PopoverBody>
          <SettingsColorTheme onSelect={ popover.onClose }/>
          <Separator className="my-3"/>
          <SettingsIdentIcon/>
          <SettingsAddressFormat/>
          <Separator className="my-3"/>
          <div className="flex flex-col gap-1">
            <SettingsScamTokens/>
            <SettingsPoorReputationTokens/>
            <SettingsLocalTime/>
          </div>
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
};

export default React.memo(Settings);
