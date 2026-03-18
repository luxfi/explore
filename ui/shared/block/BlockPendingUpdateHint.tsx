import React from 'react';

import config from 'configs/app';
import { Tooltip } from 'toolkit/chakra/tooltip';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  view?: 'block' | 'tx';
  className?: string;
}

const BlockPendingUpdateHint = ({ view = 'block', className }: Props) => {
  if (!config.UI.views.block.pendingUpdateAlertEnabled) {
    return null;
  }

  const tooltipContent = view === 'block' ?
    'Block is being re-synced. Details may be incomplete until the update is finished.' :
    'This transaction is part of a block that is being re-synced. Details may be incomplete until the update is finished.';

  return (
    <Tooltip content={ tooltipContent }>
      <IconSvg boxSize={ 5 } color="icon.secondary" name="status/warning" className={ className }/>
    </Tooltip>
  );
};

export default React.memo(BlockPendingUpdateHint);
