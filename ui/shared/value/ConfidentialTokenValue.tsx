import React from 'react';

import type { TokenInfo } from 'types/api/token';

import type { EntityProps as TokenEntityProps } from 'ui/shared/entities/token/TokenEntity';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';
import ConfidentialValue from 'ui/shared/value/ConfidentialValue';

interface Props {
  token: TokenInfo;
  tokenEntityProps?: Omit<TokenEntityProps, 'token'>;
  loading?: boolean;
  className?: string;
  [key: string]: unknown;
}

const ConfidentialTokenValue = ({ token, tokenEntityProps, loading, className, ...rest }: Props) => {
  return (
    <div
      className={ `inline-flex items-center ${ className ?? '' }`.trim() }
      { ...rest }
    >
      <ConfidentialValue loading={ loading }/>
      <TokenEntity
        token={ token }
        noCopy
        onlySymbol
        flexShrink={ 0 }
        w="fit-content"
        ml={ 2 }
        icon={{ marginRight: 1 }}
        isLoading={ loading }
        { ...tokenEntityProps }
      />
    </div>
  );
};

export default React.memo(ConfidentialTokenValue);
