import React from 'react';

import type { InteropTransactionInfo } from 'types/api/transaction';

import config from 'configs/app';
import { layerLabels } from 'lib/rollups/utils';
import { CollapsibleDetails } from 'toolkit/chakra/collapsible';
import InteropMessageDestinationTx from 'ui/interopMessages/InteropMessageDestinationTx';
import InteropMessageSourceTx from 'ui/interopMessages/InteropMessageSourceTx';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import AddressEntityInterop from 'ui/shared/entities/address/AddressEntityInterop';
import InteropMessageStatus from 'ui/shared/statusTag/InteropMessageStatus';

const rollupFeature = config.features.rollup;

type Props = {
  data?: InteropTransactionInfo;
  isLoading: boolean;
};

const TxDetailsInterop = ({ data, isLoading }: Props) => {
  const hasInterop = rollupFeature.isEnabled && rollupFeature.interopEnabled;

  if (!hasInterop || !data) {
    return null;
  }

  const details = (
    <div
     
    >
      <span className="text-[var(--color-text-secondary)]">Message id</span>
      <span>{ data.nonce }</span>
      <span className="text-[var(--color-text-secondary)]">Interop status</span>
      <div>
        <InteropMessageStatus status={ data.status }/>
      </div>
      <span className="text-[var(--color-text-secondary)]">Sender</span>
      { data.init_chain !== undefined ? (
        <AddressEntityInterop
          chain={ data.init_chain }
          address={{ hash: data.sender_address_hash }}
          isLoading={ isLoading }
          truncation="constant"
        />
      ) : (
        <AddressEntity address={{ hash: data.sender_address_hash }} isLoading={ isLoading } truncation="constant"/>
      ) }
      <span className="text-[var(--color-text-secondary)]">Target</span>
      { data.relay_chain !== undefined ? (
        <AddressEntityInterop
          chain={ data.relay_chain }
          address={{ hash: data.target_address_hash }}
          isLoading={ isLoading }
          truncation="constant"
        />
      ) : (
        <AddressEntity address={{ hash: data.target_address_hash }} isLoading={ isLoading } truncation="constant"/>
      ) }
      <span className="text-[var(--color-text-secondary)]">Payload</span>
      <div>
        <span className="flex-1"
        >
          { data.payload }
        </span>
        <CopyToClipboard text={ data.payload }/>
      </div>
    </div>
  );

  if (data.init_chain !== undefined) {
    return (
      <>
        <DetailedInfo.ItemLabel
          hint={ `The originating transaction that initiated the cross-${ layerLabels.current } message on the source chain` }
          isLoading={ isLoading }
        >
          Interop source tx
        </DetailedInfo.ItemLabel>
        <DetailedInfo.ItemValue>
          <InteropMessageSourceTx { ...data } isLoading={ isLoading }/>
          <CollapsibleDetails variant="secondary" noScroll className="ml-3">
            { details }
          </CollapsibleDetails>
        </DetailedInfo.ItemValue>
      </>
    );
  }

  if (data.relay_chain !== undefined) {
    return (
      <>
        <DetailedInfo.ItemLabel
          hint={ `The transaction that relays the cross-${ layerLabels.current } message to its destination chain` }
          isLoading={ isLoading }
        >
          Interop relay tx
        </DetailedInfo.ItemLabel>
        <DetailedInfo.ItemValue>
          <InteropMessageDestinationTx { ...data } isLoading={ isLoading }/>
          <CollapsibleDetails variant="secondary" noScroll className="ml-3">
            { details }
          </CollapsibleDetails>
        </DetailedInfo.ItemValue>
      </>
    );
  }
  return null;
};

export default TxDetailsInterop;
