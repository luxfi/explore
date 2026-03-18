import React from 'react';

import { Tooltip } from 'toolkit/chakra/tooltip';

import IconSvg from './IconSvg';

type Props = {
  iconSize: number;
  className?: string;
};

const ContractCertifiedLabel = ({ iconSize, className }: Props) => {
  return (
    <Tooltip content="This contract has been certified by the chain developers">
      <span className={ `inline-flex ${ className || '' }` }>
        <IconSvg name="certified" color="green.500" boxSize={ iconSize } cursor="pointer"/>
      </span>
    </Tooltip>
  );
};

export default ContractCertifiedLabel;
