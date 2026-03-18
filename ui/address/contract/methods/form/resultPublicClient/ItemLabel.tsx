import React from 'react';
import type { AbiParameter } from 'viem';

interface Props {
  abiParameter: AbiParameter;
}

const ItemLabel = ({ abiParameter }: Props) => {
  return (
    <>
      { abiParameter.name && <span fontWeight={ 500 }>{ abiParameter.name } </span> }
      <span>({ abiParameter.type }) : </span>
    </>
  );
};

export default React.memo(ItemLabel);
