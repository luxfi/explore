import React from 'react';

import { Tooltip } from '@luxfi/ui/tooltip';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  className?: string;
  style?: React.CSSProperties;
}

const CodeEditorMainFileIndicator = ({ className, style }: Props) => {
  return (
    <Tooltip content="The main file containing verified contract">
      <div className={ className } style={ style }>
        <IconSvg name="star_filled" className="size-3 block text-[var(--color-green-500)]"/>
      </div>
    </Tooltip>
  );
};

export default CodeEditorMainFileIndicator;
