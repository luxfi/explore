import React from 'react';

import type { TokenInfo, TokenInstance } from 'types/api/token';

import NftEntity from 'ui/shared/entities/nft/NftEntity';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';

interface Props {
  token: TokenInfo;
  value: string;
  tokenId: string | null;
  instance?: TokenInstance | null;
}

const NftTokenTransferSnippet = ({ value, token, tokenId, instance }: Props) => {
  const num = value === '1' ? '' : value;

  const tokenIdContent = (() => {
    if (tokenId === null) {
      // ERC-404 may not have an ID
      if (token.type === 'ERC-404') {
        return null;
      }
      return <span className="text-[var(--color-text-secondary)]"> N/A </span>;
    }

    return (
      <NftEntity
        hash={ token.address_hash }
        id={ tokenId }
        instance={ instance }
        variant="content"
        className="max-w-full lg:max-w-[150px] w-auto shrink-0"
      />
    );

  })();

  return (
    <>
      { num ? (
        <>
          <span className="text-[var(--color-text-secondary)]">for</span>
          <span>{ num }</span>
          <span className="text-[var(--color-text-secondary)]">token ID</span>
        </>
      ) : (
        <span className="text-[var(--color-text-secondary)]">for token ID</span>
      ) }
      { tokenIdContent }
      <span className="text-[var(--color-text-secondary)]">of</span>
      <TokenEntity
        token={ token }
        noCopy
        className="w-auto grow"
      />
    </>
  );
};

export default React.memo(NftTokenTransferSnippet);
