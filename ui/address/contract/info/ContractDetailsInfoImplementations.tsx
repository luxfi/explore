import React from 'react';

import type { AddressImplementation } from 'types/api/addressParams';
import type { SmartContractProxyType } from 'types/api/contract';

import ContainerWithScrollY from 'ui/shared/ContainerWithScrollY';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';

import ContractDetailsInfoItem from './ContractDetailsInfoItem';

interface Props {
  implementations: Array<AddressImplementation>;
  proxyType?: SmartContractProxyType;
}

const ContractDetailsInfoImplementations = ({ implementations, proxyType }: Props) => {
  return (
    <ContractDetailsInfoItem
      label={ `${ proxyType === 'eip7702' ? 'Delegated to' : `Implementation${ implementations.length > 1 ? 's' : '' }` }` }
      contentProps={{ className: 'lg:[grid-column:2/span_3] relative' }}
    >
      <ContainerWithScrollY gradientHeight={ 48 } className="max-h-[200px] w-full">
        { implementations.map((item) => (
          <AddressEntity
            key={ item.address_hash }
            address={{
              hash: item.address_hash,
              filecoin: { robust: item.filecoin_robust_address },
              name: item.name,
              is_contract: true,
            }}
            noIcon
          />
        )) }
      </ContainerWithScrollY>
    </ContractDetailsInfoItem>
  );
};

export default React.memo(ContractDetailsInfoImplementations);
