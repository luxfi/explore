import React from 'react';

import type { TxBlob } from 'types/api/blobs';

import TxBlobListItem from './TxBlobListItem';

const TxBlobsList = ({ data, isLoading }: { data: Array<TxBlob>; isLoading?: boolean }) => {
  return (
    <div>
      { data.map((item, index) => (
        <TxBlobListItem
          key={ item.hash + (isLoading ? index : '') }
          data={ item }
          isLoading={ isLoading }
        />
      )) }
    </div>
  );
};

export default TxBlobsList;
