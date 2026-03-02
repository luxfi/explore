import React from 'react';

import type { TxAuthorization } from 'types/api/transaction';

import TxAuthorizationsListItem from './TxAuthorizationsListItem';

interface Props {
  data: Array<TxAuthorization> | undefined;
  isLoading?: boolean;
}

const TxAuthorizationsList = ({ data, isLoading }: Props) => {
  return (
    <div>
      { data?.map((item, index) => <TxAuthorizationsListItem key={ item.nonce.toString() + (isLoading ? index : '') } { ...item } isLoading={ isLoading }/>) }
    </div>
  );
};

export default TxAuthorizationsList;
