import React from 'react';

import { Tooltip } from '@luxfi/ui/tooltip';
import * as EntityBase from 'ui/shared/entities/base/components';

import type { ContentProps } from './AddressEntity';
import AddressEntity from './AddressEntity';

const AddressEntityContentProxy = (props: ContentProps) => {
  const implementations = props.address.implementations;

  if (!implementations || implementations.length === 0) {
    return null;
  }

  const colNum = Math.min(implementations.length, 3);
  const nameTag = props.address.metadata?.tags.find(tag => tag.tagType === 'name')?.name;

  const implementationName = implementations.length === 1 && implementations[0].name ? implementations[0].name : undefined;

  const content = (
    <>
      <div className="font-semibold">
        Proxy contract
        { props.address.name ? ` (${ props.address.name })` : '' }
      </div>
      <AddressEntity
        address={{ hash: props.address.hash, filecoin: props.address.filecoin }}
        noLink
        noIcon
        noHighlight
        noTooltip
        className="justify-center w-full"
      />
      <div className="font-semibold mt-2">
        Implementation{ implementations.length > 1 ? 's' : '' }
        { implementationName ? ` (${ implementationName })` : '' }
      </div>
      <div className="flex flex-wrap gap-x-3">
        { implementations.map((item) => (
          <AddressEntity
            key={ item.address_hash }
            address={{ hash: item.address_hash, filecoin: { robust: item.filecoin_robust_address } }}
            noLink
            noIcon
            noHighlight
            noTooltip
            className={ `flex-1 ${ colNum === 1 ? 'justify-center' : '' }` }
          />
        )) }
      </div>
    </>
  );

  return (
    <Tooltip content={ content } interactive contentProps={{ className: 'max-w-[calc(100vw-8px)] lg:max-w-[410px]' }} triggerProps={{ className: 'min-w-0' }}>
      <span className="inline-flex w-full">
        <EntityBase.Content
          { ...props }
          truncation={ nameTag || implementationName || props.address.name ? 'tail' : props.truncation }
          text={ nameTag || implementationName || props.address.name || props.altHash || props.address.hash }
          noTooltip
        />
      </span>
    </Tooltip>
  );
};

export default React.memo(AddressEntityContentProxy);
