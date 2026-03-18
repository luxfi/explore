import React from 'react';

import type { ChainInfo } from 'types/api/interop';

import { route } from 'nextjs-routes';

import { Image } from 'toolkit/chakra/image';
import { Tooltip } from 'toolkit/chakra/tooltip';
import IconSvg from 'ui/shared/IconSvg';

import { distributeEntityProps } from '../base/utils';
import * as AddressEntity from './AddressEntity';

interface Props extends Omit<AddressEntity.EntityProps, 'chain'> {
  chain: ChainInfo | null;
}

const IconStub = () => {
  return (
    <div className="absolute -bottom-[2px] right-[4px] flex items-center justify-center rounded-base bg-gray-100 dark:bg-gray-700 w-[14px] h-[14px] border border-[var(--color-bg-primary)]">
      <IconSvg
        name="networks/icon-placeholder"
        className="w-[10px] h-[10px] text-[var(--color-icon-primary)]"
      />
    </div>
  );
};

const AddressEntityInterop = ({ chain, ...props }: Props) => {
  const partsProps = distributeEntityProps(props);

  const href = chain?.instance_url ? chain.instance_url.replace(/\/$/, '') + route({
    pathname: '/address/[hash]',
    query: {
      ...props.query,
      hash: props.address.hash,
    },
  }) : null;

  const addressIcon = (
    <div className="relative">
      <AddressEntity.Icon { ...partsProps.icon }/>
      { !props.isLoading && (
        chain?.chain_logo ? (
          <Image
            position="absolute"
            bottom="-3px"
            right="4px"
            src={ chain.chain_logo }
            alt={ chain.chain_name || 'external chain logo' }
            fallback={ <IconStub/> }
            width="14px"
            height="14px"
            borderRadius="base"
          />
        ) : (
          <IconStub/>
        )
      ) }
    </div>
  );

  return (
    <AddressEntity.Container className={ props.className }>
      { chain && (
        <Tooltip content={ `Address on ${ chain.chain_name ? chain.chain_name : 'external chain' } (chain id ${ chain.chain_id })` }>
          { addressIcon }
        </Tooltip>
      ) }
      { !chain && addressIcon }
      { href ? (
        <AddressEntity.Link { ...partsProps.link } href={ href } external>
          <AddressEntity.Content { ...partsProps.content }/>
        </AddressEntity.Link>
      ) : (
        <div className="overflow-hidden">
          <AddressEntity.Content { ...partsProps.content }/>
        </div>
      ) }
      <AddressEntity.Copy { ...partsProps.copy }/>
    </AddressEntity.Container>
  );
};

export default AddressEntityInterop;
