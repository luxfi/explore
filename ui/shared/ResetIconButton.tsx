import React from 'react';

import { CloseButton } from '@luxfi/ui/close-button';
import { Tooltip } from '@luxfi/ui/tooltip';

type Props = {
  onClick: () => void;
};

const ResetIconButton = ({ onClick }: Props) => {
  return (
    <Tooltip content="Reset filter">
      <CloseButton onClick={ onClick } className="ml-1"/>
    </Tooltip>
  );
};

export default ResetIconButton;
