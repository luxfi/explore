import React from 'react';

import type { ChainInfo } from 'types/api/interop';

import { route } from 'nextjs-routes';

import { Image } from '@luxfi/ui/image';
import { Skeleton } from '@luxfi/ui/skeleton';
import { Tooltip } from '@luxfi/ui/tooltip';
import { stripTrailingSlash } from 'toolkit/utils/url';
import IconSvg from 'ui/shared/IconSvg';

import { distributeEntityProps } from '../base/utils';
import * as TxEntity from './TxEntity';

type Props = {
  chain?: ChainInfo | null;
  hash?: string | null;
} & Omit<TxEntity.EntityProps, 'hash' | 'chain'>;

const IconStub = ({ isLoading }: { isLoading?: boolean }) => {
  return (
    <Skeleton
      loading={ isLoading }
      display="flex"
      minWidth="20px"
      h="20px"
      borderRadius="full"
      className="bg-[var(--color-blackAlpha-100)] dark:bg-[var(--color-whiteAlpha-100)]"
      alignItems="center"
      justifyContent="center"
      mr={ 2 }
    >
      <IconSvg
        name="networks/icon-placeholder"
        className="block w-4 h-4 text-[var(--color-icon-primary)]"
      />
    </Skeleton>
  );
};

const TxEntityInterop = ({ chain, hash, ...props }: Props) => {
  const partsProps = distributeEntityProps(props);

  const href = (chain?.instance_url && hash) ? stripTrailingSlash(chain.instance_url) + route({
    pathname: '/tx/[hash]',
    query: {
      ...props.query,
      hash: hash,
    },
  }) : null;

  return (
    <TxEntity.Container { ...partsProps.container }>
      { chain && !props.noIcon && (
        <Tooltip content={ `${ chain.chain_name ? chain.chain_name : 'External chain' } (chain id ${ chain.chain_id })` }>
          <div>
            { chain.chain_logo ? (
              <Image
                src={ chain.chain_logo }
                alt={ chain.chain_name || 'external chain logo' }
                width="20px"
                height="20px"
                mr={ 2 }
                borderRadius="base"
              />
            ) : (
              <IconStub isLoading={ props.isLoading }/>
            ) }
          </div>
        </Tooltip>
      ) }
      { !chain && !props.noIcon && (
        <IconStub/>
      ) }
      { hash && (
        <>
          { href ? (
            <TxEntity.Link { ...partsProps.link } hash={ hash } href={ href } external>
              <TxEntity.Content { ...partsProps.content } hash={ hash }/>
            </TxEntity.Link>
          ) : (
            <div className="overflow-hidden">
              <TxEntity.Content { ...partsProps.content } hash={ hash }/>
            </div>
          ) }
          <TxEntity.Copy { ...partsProps.copy } hash={ hash } noCopy/>
        </>
      ) }
      { !hash && (
        'N/A'
      ) }
    </TxEntity.Container>
  );
};

export default TxEntityInterop;
