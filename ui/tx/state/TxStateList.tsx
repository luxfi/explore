import React from 'react';

import type { TxStateChange } from 'types/api/txStateChanges';

import TxStateListItem from 'ui/tx/state/TxStateListItem';

interface Props {
  data: Array<TxStateChange>;
  isLoading?: boolean;
}

const TxStateList = ({ data, isLoading }: Props) => {
  return (
    <div>
      { data.map((item, index) => <TxStateListItem key={ index } data={ item } isLoading={ isLoading }/>) }
    </div>
  );
};

export default TxStateList;
