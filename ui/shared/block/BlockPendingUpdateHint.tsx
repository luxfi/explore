import React from 'react';

import config from 'configs/app';
import { Tooltip } from '@luxfi/ui/tooltip';
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
      <IconSvg name="status/warning" className={ `w-5 h-5 text-[var(--color-icon-secondary)] ${ className || '' }` }/>
    </Tooltip>
  );
};

export default React.memo(BlockPendingUpdateHint);
