import React from 'react';

import type { CrossChainTx } from '@luxfi/zetachain-cctx-types';

import useApiQuery from 'lib/api/useApiQuery';
import base64ToHex from 'lib/base64ToHex';
import { HOMEPAGE_STATS } from 'stubs/stats';
import { CollapsibleDetails } from 'toolkit/chakra/collapsible';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { SECOND } from 'toolkit/utils/consts';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import DetailedInfoNativeCoinValue from 'ui/shared/DetailedInfo/DetailedInfoNativeCoinValue';
import DetailedInfoTimestamp from 'ui/shared/DetailedInfo/DetailedInfoTimestamp';
import AddressEntityZetaChain from 'ui/shared/entities/address/AddressEntityZetaChain';
import TxEntityZetaChainCC from 'ui/shared/entities/tx/TxEntityZetaChainCC';
import IconSvg from 'ui/shared/IconSvg';
import RawDataSnippet from 'ui/shared/RawDataSnippet';
import ZetaChainCCTXReducedStatus from 'ui/shared/zetaChain/ZetaChainCCTXReducedStatus';
import ZetaChainCCTXStatusTag from 'ui/shared/zetaChain/ZetaChainCCTXStatusTag';
import ZetaChainCCTXValue from 'ui/shared/zetaChain/ZetaChainCCTXValue';

import ZetaChainCCTXDetailsLifecycleIn from './ZetaChainCCTXDetailsLifecycleIn';
import ZetaChainCCTXDetailsLifecycleOut from './ZetaChainCCTXDetailsLifecycleOut';
import ZetaChainCCTXDetailsRelatedTx from './ZetaChainCCTXDetailsRelatedTx';

type Props = {
  data?: CrossChainTx;
  isLoading: boolean;
};

const getTransactionsBeforeAndAfter = (data: CrossChainTx) => {
  const relatedTransactions = data?.related_cctxs || [];
  const currentTransactionIndex = relatedTransactions.findIndex(tx => tx.index === data.index);
  const transactionsBefore = currentTransactionIndex > 0 ? relatedTransactions.slice(0, currentTransactionIndex) : [];
  const transactionsAfter = currentTransactionIndex >= 0 && currentTransactionIndex < relatedTransactions.length - 1 ?
    relatedTransactions.slice(currentTransactionIndex + 1) :
    [];
  return { transactionsBefore, transactionsAfter };
};

const ZetaChainCCTXDetails = ({ data, isLoading }: Props) => {
  const statsQuery = useApiQuery('general:stats', {
    queryOptions: {
      placeholderData: HOMEPAGE_STATS,
    },
  });

  if (!data) {
    return null;
  }

  const { transactionsBefore, transactionsAfter } = getTransactionsBeforeAndAfter(data);

  return (
    <DetailedInfo.Container>
      { data.inbound_params?.sender && (
        <>
          <DetailedInfo.ItemLabel
            hint="Address that initiated the cross-chain transaction"
            isLoading={ isLoading }
          >
            Sender
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <AddressEntityZetaChain
              address={{ hash: data.inbound_params?.sender }}
              chainId={ data.inbound_params?.sender_chain_id.toString() }
              isLoading={ isLoading }
            />
          </DetailedInfo.ItemValue>
        </>
      ) }
      <DetailedInfo.ItemLabel
        hint="Destination address for the transferred assets"
        isLoading={ isLoading }
      >
        Receiver
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <AddressEntityZetaChain
          key={ data.outbound_params[0].receiver }
          address={{ hash: data.outbound_params[0].receiver }}
          chainId={ data.outbound_params[0].receiver_chain_id?.toString() }
          isLoading={ isLoading }
        />
      </DetailedInfo.ItemValue>
      { data.inbound_params?.coin_type && data.inbound_params?.amount && (
        <>
          <DetailedInfo.ItemLabel
            hint="Type and amount of tokens being transferred across chains"
            isLoading={ isLoading }
          >
            Asset transferred
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <ZetaChainCCTXValue
              coinType={ data.inbound_params?.coin_type }
              tokenSymbol={ data.token_symbol }
              amount={ data.inbound_params?.amount }
              decimals={ data.decimals ?? null }
              isLoading={ isLoading }
            />
          </DetailedInfo.ItemValue>
        </>
      ) }
      <DetailedInfo.ItemLabel
        hint="Fee charged by ZetaChain for processing the transaction"
        isLoading={ isLoading }
      >
        Cross-chain fee
      </DetailedInfo.ItemLabel>
      <DetailedInfoNativeCoinValue
        amount={ data.zeta_fees }
        exchangeRate={ statsQuery.data?.coin_price }
        accuracy={ 4 }
        noTooltip={ false }
        loading={ isLoading }
      />
      { data.relayed_message && (
        <>
          <DetailedInfo.ItemLabel
            hint="Optional message data sent with the transaction"
            isLoading={ isLoading }
          >
            Message
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <RawDataSnippet
              data={ data.relayed_message }
              textareaMaxHeight="100px"
              className="w-full"
              isLoading={ isLoading }
              showCopy={ false }
            />
          </DetailedInfo.ItemValue>
        </>
      ) }
      <DetailedInfo.ItemLabel
        hint="Unique identifier for this cross-chain transaction"
        isLoading={ isLoading }
      >
        CCTX hash
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <Skeleton loading={ isLoading } className="flex flex-nowrap items-center overflow-hidden">
          <TxEntityZetaChainCC hash={ data.index } isLoading={ isLoading } noIcon noLink/>
        </Skeleton>
      </DetailedInfo.ItemValue>
      <DetailedInfo.ItemLabel
        hint="Current state and status of the cross-chain transaction"
        isLoading={ isLoading }
      >
        Status and state
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <div className="flex">
          <ZetaChainCCTXReducedStatus status={ data.cctx_status_reduced } isLoading={ isLoading } type="full"/>
          { data.cctx_status?.status && <ZetaChainCCTXStatusTag status={ data.cctx_status.status } isLoading={ isLoading }/> }
        </div>
        { data.cctx_status?.error_message && (
          <CollapsibleDetails className="ml-2">
            <RawDataSnippet data={ data.cctx_status.error_message }/>
          </CollapsibleDetails>
        ) }
      </DetailedInfo.ItemValue>
      { data.cctx_status?.status_message && (
        <>
          <DetailedInfo.ItemLabel
            hint="Detailed status message"
            isLoading={ isLoading }
          >
            Status message
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <RawDataSnippet data={ data.cctx_status.status_message } showCopy={ false }/>
          </DetailedInfo.ItemValue>
        </>
      ) }
      { Boolean(Number(data.cctx_status?.created_timestamp)) && (
        <>
          <DetailedInfo.ItemLabel
            hint="When the transaction was first created"
            isLoading={ isLoading }
          >
            Created
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <DetailedInfoTimestamp timestamp={ Number(data.cctx_status?.created_timestamp) * SECOND } isLoading={ isLoading }/>
          </DetailedInfo.ItemValue>
        </>
      ) }
      { Boolean(Number(data.cctx_status?.last_update_timestamp)) && (
        <>
          <DetailedInfo.ItemLabel
            hint="Most recent update to transaction status"
            isLoading={ isLoading }
          >
            Last updated
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <DetailedInfoTimestamp timestamp={ Number(data.cctx_status?.last_update_timestamp) * SECOND } isLoading={ isLoading }/>
          </DetailedInfo.ItemValue>
        </>
      ) }
      <DetailedInfo.ItemLabel
        hint="Complete journey from source to destination chain(s)"
        isLoading={ isLoading }
      >
        Lifecycle
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <div className="grid w-full" style={{ gridTemplateColumns: "20px 1fr" }}>
          { transactionsBefore.length > 0 && (
            <>
              <IconSvg name="verification-steps/finalized" className="w-5 h-5"/>
              <div className="flex flex-col">
                { transactionsBefore.map((tx) => (
                  <ZetaChainCCTXDetailsRelatedTx
                    key={ tx.index }
                    tx={ tx }
                    isLoading={ isLoading }
                  />
                )) }
              </div>
            </>
          ) }
          { /* Current Transaction */ }
          <ZetaChainCCTXDetailsLifecycleIn
            key={ data.index }
            tx={ data }
            isLoading={ isLoading }
          />
          { data.outbound_params.map((param, index) => (
            <ZetaChainCCTXDetailsLifecycleOut
              outboundParam={ param }
              tx={ data }
              isLoading={ isLoading }
              isLast={ index === data.outbound_params.length - 1 }
              key={ index }
              hasTxAfter={ transactionsAfter.length > 0 }
            />
          )) }
          { /* Transactions After Current */ }
          { transactionsAfter.length > 0 && (
            <>
              { /* we need this block here to cover the vertical line (because it's the last block in lifecycle) */ }
              <div className="flex w-full"
              >
                <IconSvg name="interop" className="w-5 h-5"/>
              </div>
              <div className="flex flex-col">
                { transactionsAfter.map((tx) => (
                  <ZetaChainCCTXDetailsRelatedTx
                    key={ tx.index }
                    tx={ tx }
                    isLoading={ isLoading }
                  />
                )) }
              </div>
            </>
          ) }
        </div>
      </DetailedInfo.ItemValue>
      { data.revert_options && (
        <>
          <DetailedInfo.ItemLabel
            hint="Configuration for handling transaction failures"
            isLoading={ isLoading }
          >
            Revert options
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <div className="grid overflow-hidden w-full"
              style={{ gridTemplateColumns: "130px 1fr" }}
            >
              <span className="font-medium text-[var(--color-text-secondary)]">Abort address</span>
              <AddressEntityZetaChain
                address={{ hash: data.revert_options.abort_address }}
                chainId={ data.outbound_params[0].receiver_chain_id?.toString() }
                isLoading={ isLoading }
                className="w-full"
              />
              <span className="font-medium text-[var(--color-text-secondary)]">Call</span>
              <Skeleton loading={ isLoading }>{ data.revert_options.call_on_revert.toString() }</Skeleton>
              <span className="font-medium text-[var(--color-text-secondary)]">Revert address</span>
              <AddressEntityZetaChain
                address={{ hash: data.revert_options.revert_address }}
                chainId={ data.outbound_params[1]?.receiver_chain_id?.toString() }
                isLoading={ isLoading }
                className="w-full"
              />
              { data.revert_options.revert_message && (
                <>
                  <span className="font-medium text-[var(--color-text-secondary)]">Message</span>
                  <Skeleton loading={ isLoading } className="flex">
                    <span
                    >
                      { base64ToHex(data.revert_options.revert_message) }
                    </span>
                    <CopyToClipboard text={ base64ToHex(data.revert_options.revert_message) } isLoading={ isLoading }/>
                  </Skeleton>
                </>
              ) }
              <span className="font-medium text-[var(--color-text-secondary)]">Gas limit</span>
              <Skeleton loading={ isLoading }>{ Number(data.revert_options.revert_gas_limit).toLocaleString() }</Skeleton>
            </div>
          </DetailedInfo.ItemValue>
        </>
      ) }
    </DetailedInfo.Container>

  );
};

export default ZetaChainCCTXDetails;
