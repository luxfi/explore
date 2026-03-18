import React from 'react';

import type { SmartContractCreationStatus } from 'types/api/contract';

import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import ContractCreationStatus from 'ui/shared/statusTag/ContractCreationStatus';

import ContractDetailsInfoItem from './ContractDetailsInfoItem';

interface Props {
  addressHash: string;
  txHash: string;
  creationStatus: SmartContractCreationStatus | null;
  isLoading: boolean;
}

const ContractDetailsInfoCreator = ({ addressHash, txHash, creationStatus, isLoading }: Props) => {
  return (
    <ContractDetailsInfoItem
      label="Creator"
      isLoading={ isLoading }
      contentProps={{ className: 'lg:[grid-column:2/span_3]' }}
    >
      <div className="flex" alignItems="center" flexWrap="wrap" columnGap={ 2 } rowGap={ 2 }>
        <AddressEntity
          address={{ hash: addressHash }}
          truncation="constant"
          noIcon
        />
        <span whiteSpace="pre" color="text.secondary">at txn</span>
        <TxEntity hash={ txHash } truncation="constant" noIcon/>
        { creationStatus && <ContractCreationStatus status={ creationStatus }/> }
      </div>
    </ContractDetailsInfoItem>
  );
};

export default React.memo(ContractDetailsInfoCreator);
