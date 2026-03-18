import React from 'react';

import type { TokenInfo } from 'types/api/token';

import TokenValue from 'ui/shared/value/TokenValue';

interface Props {
  token: TokenInfo;
  value: string;
  decimals: string | null;
}
const FtTokenTransferSnippet = ({ token, value, decimals }: Props) => {
  return (
    <TokenValue
      amount={ value }
      token={ token }
      decimals={ decimals }
      accuracy={ 0 }
      startElement={ <span className="text-[var(--color-text-secondary)]">for </span> }
    />
  );
};

export default React.memo(FtTokenTransferSnippet);
