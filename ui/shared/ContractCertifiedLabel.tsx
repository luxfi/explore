import { Tooltip } from '@luxfi/ui/tooltip';
import React from 'react';

import IconSvg from './IconSvg';

type Props = {
  iconSize: number;
  className?: string;
};

const ContractCertifiedLabel = ({ iconSize, className }: Props) => {
  return (
    <Tooltip content="This contract has been certified by the chain developers">
      <span className={ `inline-flex ${ className || '' }` }>
        <IconSvg name="certified" className="text-good cursor-pointer" style={{ width: `${ iconSize * 4 }px`, height: `${ iconSize * 4 }px` }}/>
      </span>
    </Tooltip>
  );
};

export default ContractCertifiedLabel;
