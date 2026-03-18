import React from 'react';
import type { AbiParameter } from 'viem';

interface Props {
  abiParameter: AbiParameter;
}

const ItemLabel = ({ abiParameter }: Props) => {
  return (
    <>
      { abiParameter.name && <span className="font-medium">{ abiParameter.name } </span> }
      <span>({ abiParameter.type }) : </span>
    </>
  );
};

export default React.memo(ItemLabel);
