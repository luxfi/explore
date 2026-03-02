import React from 'react';

import type { TransactionRevertReason } from 'types/api/transaction';

import hexToUtf8 from 'lib/hexToUtf8';
import { HEX_REGEXP } from 'toolkit/utils/regexp';
import LogDecodedInputData from 'ui/shared/logs/LogDecodedInputData';

type Props = TransactionRevertReason;

const TxRevertReason = (props: Props) => {
  if ('raw' in props) {
    if (!HEX_REGEXP.test(props.raw)) {
      return <span>{ props.raw }</span>;
    }

    const decoded = hexToUtf8(props.raw);

    return (
      <div
       
      >
        <div>Raw:</div>
        <div>{ props.raw }</div>
        { decoded.replace(/\s|\0/g, '') && (
          <>
            <div>Decoded:</div>
            <div>{ decoded }</div>
          </>
        ) }
      </div>
    );
  }

  return <LogDecodedInputData data={ props }/>;
};

export default React.memo(TxRevertReason);
