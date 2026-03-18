import React from 'react';

import { useSettingsContext } from 'lib/contexts/settings';
import * as mixpanel from 'lib/mixpanel/index';
import { IconButton } from 'toolkit/chakra/icon-button';
import { Tooltip } from 'toolkit/chakra/tooltip';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  className?: string;
}

const TimeFormatToggle = ({ className, ...props }: Props) => {
  const settings = useSettingsContext();
  const timeFormat = settings?.timeFormat || 'relative';

  const handleClick = React.useCallback(() => {
    settings?.toggleTimeFormat();
    mixpanel.logEvent(mixpanel.EventTypes.BUTTON_CLICK, { Content: 'Switch time format', Source: 'Table header' });
  }, [ settings ]);

  const text = (() => {
    if (timeFormat === 'relative') {
      return null;
    }

    return <span className="text-[var(--color-icon-secondary)]">{ settings?.isLocalTime ? 'Local' : 'UTC' }</span>;
  })();

  return (
    <div className={ `inline-flex gap-1 ml-2 align-bottom ${ className ?? '' }`.trim() } { ...props }>
      <Tooltip content="Toggle time format">
        <IconButton
          aria-label="Toggle time format"
          variant="icon_secondary"
          onClick={ handleClick }
          selected={ timeFormat === 'absolute' }
          className="size-5 rounded-sm align-bottom"
        >
          <IconSvg name="clock-light" boxSize="14px"/>
        </IconButton>
      </Tooltip>
      { text }
    </div>
  );
};

export default React.memo(TimeFormatToggle);
