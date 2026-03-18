import React from 'react';

import { Tooltip } from 'toolkit/chakra/tooltip';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  className?: string;
}

const CodeEditorMainFileIndicator = ({ className }: Props) => {
  return (
    <Tooltip content="The main file containing verified contract">
      <div className={ className } >
        <IconSvg name="star_filled" boxSize={ 3 } display="block" color="green.500"/>
      </div>
    </Tooltip>
  );
};

export default CodeEditorMainFileIndicator;
