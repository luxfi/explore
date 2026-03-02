import React from 'react';

import type { Transaction } from 'types/api/transaction';

import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import TextSeparator from 'ui/shared/TextSeparator';

type Props = Pick<Transaction, 'nonce' | 'type' | 'position'> & { queueIndex?: number };

const TxDetailsOther = ({ nonce, type, position, queueIndex }: Props) => {
  return (
    <>
      <DetailedInfo.ItemLabel
        hint="Other data related to this transaction"
      >
        Other
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue multiRow>
        {
          [
            typeof type === 'number' && (
              <div key="type">
                <span>Txn type: </span>
                <span>{ type }</span>
                { type === 2 && <span>(EIP-1559)</span> }
                { type === 3 && <span>(EIP-4844)</span> }
                { type === 4 && <span>(EIP-7702)</span> }
              </div>
            ),
            queueIndex !== undefined ? (
              <div key="queueIndex">
                <span>Queue index: </span>
                <span>{ queueIndex }</span>
              </div>
            ) : (
              <div key="nonce">
                <span>Nonce: </span>
                <span>{ nonce }</span>
              </div>
            ),
            position !== null && position !== undefined && (
              <div key="position">
                <span>Position: </span>
                <span>{ position }</span>
              </div>
            ),
          ]
            .filter(Boolean)
            .map((item, index) => (
              <React.Fragment key={ index }>
                { index !== 0 && <TextSeparator/> }
                { item }
              </React.Fragment>
            ))
        }
      </DetailedInfo.ItemValue>
    </>
  );
};

export default TxDetailsOther;
