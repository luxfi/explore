import React from 'react';

import type { EntityProps } from 'ui/shared/entities/address/AddressEntity';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import AddressEntityWithTokenFilter from 'ui/shared/entities/address/AddressEntityWithTokenFilter';

import useIsMobile from 'lib/hooks/useIsMobile';
import AddressEntityZetaChain from '../entities/address/AddressEntityZetaChain';
import AddressFromToIcon from './AddressFromToIcon';
import { getTxCourseType } from './utils';

type Mode = 'compact' | 'long';

interface Props {
  from: { hash: string } | { hash: string; chainId: string; chainType: 'zeta' };
  to: { hash: string } | { hash: string; chainId: string; chainType: 'zeta' } | null;
  current?: string;
  mode?: Mode | { base?: Mode; lg?: Mode; xl?: Mode };
  className?: string;
  isLoading?: boolean;
  tokenHash?: string;
  tokenSymbol?: string;
  truncation?: EntityProps['truncation'];
  noIcon?: boolean;
}

const AddressFromTo = ({
  from,
  to,
  current,
  mode: modeProp,
  className, isLoading, tokenHash = '', tokenSymbol = '', noIcon }: Props) => {
  const isMobile = useIsMobile();
  const mode = (() => {
    if (typeof modeProp === 'object' && modeProp !== null) {
      return isMobile ? (modeProp.base ?? 'long') : (modeProp.lg ?? modeProp.base ?? 'long');
    }
    return modeProp ?? 'long';
  })();

  const EntityFrom = (() => {
    if ('chainType' in from && from.chainType === 'zeta') {
      return AddressEntityZetaChain;
    }
    if (tokenHash && tokenSymbol) {
      return AddressEntityWithTokenFilter;
    }
    return AddressEntity;
  })();

  const EntityTo = (() => {
    if (to && 'chainType' in to && to.chainType === 'zeta') {
      return AddressEntityZetaChain;
    }
    if (tokenHash && tokenSymbol) {
      return AddressEntityWithTokenFilter;
    }
    return AddressEntity;
  })();

  const isOutgoing = current ? current.toLowerCase() === from.hash.toLowerCase() : false;
  const isIncoming = current ? current.toLowerCase() === to?.hash?.toLowerCase() : false;

  const fromChainId = 'chainType' in from && from.chainType === 'zeta' ? from.chainId : undefined;
  const toChainId = to && 'chainType' in to && to.chainType === 'zeta' ? to.chainId : undefined;

  if (mode === 'compact') {
    return (
      <div className={ `flex flex-col gap-y-3 ${ className || '' }` }>
        <div className="flex items-center gap-x-2">
          <AddressFromToIcon
            isLoading={ isLoading }
            type={ getTxCourseType(from.hash, to?.hash, current) }
            className="rotate-90"
          />
          <EntityFrom
            address={ from }
            isLoading={ isLoading }
            noLink={ isOutgoing }
            noCopy={ isOutgoing }
            noIcon={ noIcon }
            tokenHash={ tokenHash }
            tokenSymbol={ tokenSymbol }
            truncation="constant"
            className="max-w-[calc(100%-28px)] w-min"
            chainId={ fromChainId }
          />
        </div>
        { to && (
          <EntityTo
            address={ to }
            isLoading={ isLoading }
            noLink={ isIncoming }
            noCopy={ isIncoming }
            noIcon={ noIcon }
            tokenHash={ tokenHash }
            tokenSymbol={ tokenSymbol }
            truncation="constant"
            className="max-w-[calc(100%-28px)] w-min ml-7"
            chainId={ toChainId }
          />
        ) }
      </div>
    );
  }

  const iconSize = 20;

  return (
    <div className={ `grid items-center ${ className || '' }` } style={{ gridTemplateColumns: `minmax(auto, min-content) ${ iconSize }px minmax(auto, min-content)` }}>
      <EntityFrom
        address={ from }
        isLoading={ isLoading }
        noLink={ isOutgoing }
        noCopy={ isOutgoing }
        noIcon={ noIcon }
        tokenHash={ tokenHash }
        tokenSymbol={ tokenSymbol }
        truncation="constant"
        className={ `w-auto ${ isOutgoing ? 'mr-4' : 'mr-2' }` }
        chainId={ fromChainId }
      />
      <AddressFromToIcon
        isLoading={ isLoading }
        type={ getTxCourseType(from.hash, to?.hash, current) }
      />
      { to && (
        <EntityTo
          address={ to }
          isLoading={ isLoading }
          noLink={ isIncoming }
          noCopy={ isIncoming }
          noIcon={ noIcon }
          tokenHash={ tokenHash }
          tokenSymbol={ tokenSymbol }
          truncation="constant"
          className="ml-3 w-auto"
          chainId={ toChainId }
        />
      ) }
    </div>
  );
};

export default AddressFromTo;
