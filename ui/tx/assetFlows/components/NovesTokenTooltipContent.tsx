import type { FC } from 'react';
import React from 'react';

import type { NovesNft, NovesToken } from 'types/api/noves';

import { HEX_REGEXP } from 'toolkit/utils/regexp';
import CopyToClipboard from 'ui/shared/CopyToClipboard';

interface Props {
  amount?: string;
  token: NovesToken | NovesNft | undefined;
}

const NovesTokenTooltipContent: FC<Props> = ({ token, amount }) => {
  if (!token) {
    return null;
  }

  const showTokenName = token.symbol !== token.name;
  const showTokenAddress = HEX_REGEXP.test(token.address);

  return (
    <div className="flex flex-col items-center gap-1 text-inherit">
      <p className="font-semibold text-inherit">
        <span className="text-inherit">
          { amount }
        </span>
        <span className="text-inherit ml-1">
          { token.symbol }
        </span>
      </p>

      { showTokenName && (
        <p className="font-semibold text-inherit mt-1.5">
          { token.name }
        </p>
      ) }

      { showTokenAddress && (
        <div className="flex items-center">
          <span className="font-normal text-inherit">
            { token.address }
          </span>
          <CopyToClipboard text={ token.address }/>
        </div>
      ) }

    </div>
  );
};

export default React.memo(NovesTokenTooltipContent);
