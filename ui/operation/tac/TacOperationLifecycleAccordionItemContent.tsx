import React from 'react';

import * as tac from '@luxfi/tac-operation-lifecycle-types';

import DetailedInfoTimestamp from 'ui/shared/DetailedInfo/DetailedInfoTimestamp';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import TxEntityTon from 'ui/shared/entities/tx/TxEntityTon';
import { ItemContent, ItemBody, ItemRow } from 'ui/shared/lifecycle/LifecycleAccordion';
import StatusTag from 'ui/shared/statusTag/StatusTag';

interface Props {
  isLast: boolean;
  data: tac.OperationStage;
}

const TacOperationLifecycleAccordionItemContent = ({ isLast, data }: Props) => {
  return (
    <ItemContent isLast={ isLast }>
      <ItemBody>
        <ItemRow label="Status">
          <StatusTag type={ data.is_success ? 'ok' : 'error' } text={ data.is_success ? 'Success' : 'Failed' } className="my-1"/>
        </ItemRow>

        { data.timestamp && (
          <ItemRow label="Timestamp">
            <DetailedInfoTimestamp timestamp={ data.timestamp } isLoading={ false } flexWrap={{ base: 'wrap', lg: 'nowrap' }} py="6px"/>
          </ItemRow>
        ) }

        { data.transactions.length > 0 && (
          <ItemRow label="Transactions">
            <div className="flex flex-col overflow-hidden gap-y-3 py-[6px] w-full">
              {
                data.transactions.map((tx) => {
                  if (tx.type === tac.BlockchainType.TON) {
                    return <TxEntityTon key={ tx.hash } hash={ tx.hash }/>;
                  }

                  return <TxEntity key={ tx.hash } hash={ tx.hash } icon={{ name: 'brands/tac' }}/>;
                })
              }
            </div>
          </ItemRow>
        ) }

        { data.note && (
          <ItemRow label="Note">
            <div className="items-center whitespace-pre-wrap break-words inline-flex py-[6px]">
              { data.note }
            </div>
          </ItemRow>
        ) }
      </ItemBody>
    </ItemContent>
  );
};

export default React.memo(TacOperationLifecycleAccordionItemContent);
