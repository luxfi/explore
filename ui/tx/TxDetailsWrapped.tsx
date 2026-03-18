import BigNumber from 'bignumber.js';
import React from 'react';

import type { Transaction } from 'types/api/transaction';
import type { ExcludeUndefined } from 'types/utils';

import { Badge } from 'toolkit/chakra/badge';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import DetailedInfoNativeCoinValue from 'ui/shared/DetailedInfo/DetailedInfoNativeCoinValue';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import LogDecodedInputData from 'ui/shared/logs/LogDecodedInputData';
import RawInputData from 'ui/shared/RawInputData';
import TxFee from 'ui/shared/tx/TxFee';
import TxDetailsGasPrice from 'ui/tx/details/TxDetailsGasPrice';
import TxDetailsOther from 'ui/tx/details/TxDetailsOther';

interface Props {
  data: ExcludeUndefined<Transaction['wrapped']>;
}

const TxDetailsWrapped = ({ data }: Props) => {
  return (
    <div
      className="grid gap-x-8 gap-y-3 lg:gap-y-3"
      style={{ gridTemplateColumns: 'minmax(0, 1fr)' }}
    >
      <DetailedInfo.ItemLabel
        hint="Unique character string (TxID) assigned to every verified transaction"
      >
        Transaction hash
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <TxEntity hash={ data.hash } noIcon noLink/>
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        hint="Transaction method name"
      >
        Method
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <Badge colorPalette="gray">
          { data.method }
        </Badge>
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemDivider/>

      { data.to && (
        <>
          <DetailedInfo.ItemLabel
            hint="Address (external or contract) receiving the transaction"
          >
            { data.to.is_contract ? 'Interacted with contract' : 'To' }
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <div className="flex flex-nowrap items-center max-w-full">
              <AddressEntity address={ data.to }/>
            </div>
          </DetailedInfo.ItemValue>
        </>
      ) }

      <DetailedInfo.ItemDivider/>

      <DetailedInfo.ItemLabel
        hint="Value sent in the native token (and USD) if applicable"
      >
        Value
      </DetailedInfo.ItemLabel>
      <DetailedInfoNativeCoinValue amount={ data.value }/>

      { data.fee.value !== null && (
        <>
          <DetailedInfo.ItemLabel
            hint="Total transaction fee"
          >
            Transaction fee
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <TxFee tx={ data } hasExchangeRateToggle/>
          </DetailedInfo.ItemValue>
        </>
      ) }

      <TxDetailsGasPrice gasPrice={ data.gas_price }/>

      { data.gas_limit && (
        <>
          <DetailedInfo.ItemLabel
            hint="Maximum amount of gas that can be used by the transaction"
          >
            Gas limit
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            { BigNumber(data.gas_limit).toFormat() }
          </DetailedInfo.ItemValue>
        </>
      ) }

      <DetailedInfo.ItemDivider/>

      <TxDetailsOther type={ data.type } nonce={ data.nonce } position={ null }/>

      <DetailedInfo.ItemLabel
        hint="Binary data included with the transaction. See logs tab for additional info"
      >
        Raw input
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <RawInputData hex={ data.raw_input }/>
      </DetailedInfo.ItemValue>

      { data.decoded_input && (
        <>
          <DetailedInfo.ItemLabel
            hint="Decoded input data"
          >
            Decoded input data
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <LogDecodedInputData data={ data.decoded_input }/>
          </DetailedInfo.ItemValue>
        </>
      ) }
    </div>
  );
};

export default TxDetailsWrapped;
