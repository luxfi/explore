import React from 'react';

import { Button } from 'toolkit/chakra/button';
import { PopoverRoot, PopoverTrigger } from 'toolkit/chakra/popover';
import IconSvg from 'ui/shared/IconSvg';
import NetworkMenuContent from 'ui/snippets/networkMenu/NetworkMenuContent';
import useNetworkMenu from 'ui/snippets/networkMenu/useNetworkMenu';

const NetworkMenu = () => {
  const menu = useNetworkMenu();

  const handlePopoverOpenChange = React.useCallback(({ open }: { open: boolean }) => {
    menu.onOpenChange({ open });
  }, [ menu ]);

  return (
    <PopoverRoot
      positioning={{ placement: 'bottom-start', offset: { mainAxis: 6 } }}
      lazyMount
      open={ menu.open }
      onOpenChange={ handlePopoverOpenChange }
    >
      <PopoverTrigger>
        <Button
          variant="link"
          aria-label="Network menu"
          onClick={ menu.onToggle }
          size="2xs"
          className="font-medium"
        >
          <IconSvg name="networks" className="w-3.5 h-3.5"/>
          <span>Chains</span>
          <IconSvg name="arrows/east-mini" className="w-4 h-4 -rotate-90"/>
        </Button>
      </PopoverTrigger>
      <NetworkMenuContent items={ menu.data } tabs={ menu.availableTabs }/>
    </PopoverRoot>
  );
};

export default React.memo(NetworkMenu);
