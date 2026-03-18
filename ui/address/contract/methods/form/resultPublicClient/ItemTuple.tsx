import React from 'react';
import type { AbiParameter } from 'viem';

import type { ResultViewMode } from '../../types';

import Item from './Item';
import { printRowOffset } from './utils';

interface Props {
  abiParameter: AbiParameter;
  data: unknown;
  level: number;
  mode: ResultViewMode;
}

const ItemTuple = ({ abiParameter, data, mode, level }: Props) => {
  return (
    <span display="block">
      <span display="block">
        <span>{ printRowOffset(level) }</span>
        <span fontWeight={ 500 }>{ abiParameter.name || abiParameter.internalType }</span>
        <span> { '{' }</span>
      </span>
      { 'components' in abiParameter && abiParameter.components.map((component, index) => {
        const itemData = (() => {
          if (typeof data !== 'object' || data === null) {
            return;
          }

          if (Array.isArray(data)) {
            return data[index];
          }

          if (component.name && component.name in data) {
            return data[component.name as keyof typeof data];
          }
        })();

        return (
          <Item
            key={ index }
            abiParameter={ component }
            data={ itemData }
            mode={ mode }
            level={ level + 1 }
          />
        );
      }) }
      <span display="block">{ printRowOffset(level) }{ '}' }</span>
    </span>
  );
};

export default React.memo(ItemTuple);
