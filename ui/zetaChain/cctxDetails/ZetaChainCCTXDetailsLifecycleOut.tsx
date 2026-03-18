import { BigNumber } from 'bignumber.js';
import React from 'react';

import { type OutboundParams, type CrossChainTx, CctxStatus } from '@luxfi/zetachain-cctx-types';

import config from 'configs/app';
import { Skeleton } from '@luxfi/ui/skeleton';
import AddressEntityZetaChain from 'ui/shared/entities/address/AddressEntityZetaChain';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import TxEntityZetaChainCC from 'ui/shared/entities/tx/TxEntityZetaChainCC';
import TxEntityZetaChainExternal from 'ui/shared/entities/tx/TxEntityZetaChainExternal';
import IconSvg from 'ui/shared/IconSvg';
import StatusTag from 'ui/shared/statusTag/StatusTag';
import ZetaChainCCTXValue from 'ui/shared/zetaChain/ZetaChainCCTXValue';
import useZetaChainConfig from 'ui/zetaChain/useZetaChainConfig';

type Props = {
  outboundParam: OutboundParams;
  tx: CrossChainTx;
  isLoading: boolean;
  isLast: boolean;
  hasTxAfter: boolean;
};

const ZetaChainCCTXDetailsLifecycleOut = ({ outboundParam, tx, isLoading, isLast, hasTxAfter }: Props) => {
  const { data: chainsConfig } = useZetaChainConfig();
  const chainToId = outboundParam.receiver_chain_id?.toString() || '';
  const chainTo = chainsConfig?.find((chain) => chain.id.toString() === chainToId);

  const gasDecimals = config.chain.currency.decimals;

  if (tx.cctx_status?.status === CctxStatus.PendingInbound) {
    return null;
  }

  let content: React.ReactNode = null;
  let text: string = '';
  let color: string = '';

  const transactionOrCCTX = (() => {
    if (!outboundParam.hash) {
      return null;
    }
    const isCCTX = tx.related_cctxs.some((cctx) => cctx.index === outboundParam.hash);
    if (isCCTX) {
      return (
        <>
          <span className="font-medium text-[var(--color-text-secondary)]">CCTX</span>
          <TxEntityZetaChainCC
            hash={ outboundParam.hash }
            isLoading={ isLoading }
            noIcon
          />
        </>
      );
    }
    return (
      <>
        <span className="font-medium text-[var(--color-text-secondary)]">Transaction</span>
        { chainToId !== config.chain.id ? (
          <TxEntityZetaChainExternal chainId={ chainToId } hash={ outboundParam.hash } noIcon/>
        ) : (
          <TxEntity hash={ outboundParam.hash } noIcon/>
        ) }
      </>
    );
  })();

  if (tx.cctx_status?.status === CctxStatus.OutboundMined) {
    content = (
      <>
        { transactionOrCCTX }
        <span className="font-medium text-[var(--color-text-secondary)]">Status</span>
        <StatusTag type="ok" text="Success"/>
        <span className="font-medium text-[var(--color-text-secondary)]">Receiver</span>
        <AddressEntityZetaChain
          address={{ hash: outboundParam.receiver }}
          chainId={ outboundParam.receiver_chain_id?.toString() }
          isLoading={ isLoading }
          truncation="constant"
        />
        <span className="font-medium text-[var(--color-text-secondary)]">Transferred</span>
        <ZetaChainCCTXValue
          coinType={ outboundParam.coin_type }
          tokenSymbol={ tx.token_symbol }
          amount={ outboundParam.amount }
          decimals={ tx.decimals ?? null }
          isLoading={ isLoading }
        />
        <span className="font-medium text-[var(--color-text-secondary)]">Gas used</span>
        <span className="overflow-hidden">
          { BigNumber(outboundParam.gas_used || 0).div(10 ** gasDecimals).toFormat() }
        </span>
      </>
    );
    text = `Sent tx to ${ chainTo?.name || 'Unknown chain' }`;
    color = 'text.success';
  } else if (tx.cctx_status?.status === CctxStatus.PendingRevert) {
    if (!isLast) {
      content = (
        <>
          { transactionOrCCTX }
          <span className="font-medium text-[var(--color-text-secondary)]">Status</span>
          <StatusTag type="error" text="Failed"/>
        </>
      );
      text = `Destination tx failed`;
      color = 'text.error';
    } else {
      content = (
        <>
          <span className="font-medium text-[var(--color-text-secondary)]">Reverting to</span>
          <AddressEntityZetaChain
            address={{ hash: outboundParam.receiver }}
            chainId={ outboundParam.receiver_chain_id?.toString() }
            isLoading={ isLoading }
            truncation="constant"
          />
        </>
      );
      text = `Waiting for revert to ${ chainTo?.name || 'Unknown chain' }`;
      color = 'text.secondary';
    }
  } else if (tx.cctx_status?.status === CctxStatus.PendingOutbound) {
    content = (
      <>
        <span className="font-medium text-[var(--color-text-secondary)]">Destination</span>
        <AddressEntityZetaChain
          address={{ hash: outboundParam.receiver }}
          chainId={ outboundParam.receiver_chain_id?.toString() }
          isLoading={ isLoading }
          truncation="constant"
        />
        <span className="font-medium text-[var(--color-text-secondary)]">Nonce</span>
        <span>{ outboundParam.tss_nonce }</span>
      </>
    );
    text = `Waiting for outbound tx to ${ chainTo?.name || 'Unknown chain' }`;
    color = 'text.secondary';
  } else if (tx.cctx_status?.status === CctxStatus.Reverted) {
    if (!isLast) {
      content = (
        <>
          { transactionOrCCTX }
          <span className="font-medium text-[var(--color-text-secondary)]">Status</span>
          <StatusTag type="error" text="Failed"/>
        </>
      );
      text = `Destination tx failed`;
      color = 'text.error';
    } else {
      content = (
        <>
          <span className="font-medium text-[var(--color-text-secondary)]">Origin</span>
          <AddressEntityZetaChain
            address={{ hash: outboundParam.receiver }}
            chainId={ outboundParam.receiver_chain_id?.toString() }
            isLoading={ isLoading }
            truncation="constant"
          />
          { transactionOrCCTX }
          <span className="font-medium text-[var(--color-text-secondary)]">Status</span>
          <StatusTag type="ok" text="Success"/>
          <span className="font-medium text-[var(--color-text-secondary)]">Transferred</span>
          <ZetaChainCCTXValue
            coinType={ outboundParam.coin_type }
            tokenSymbol={ tx.token_symbol }
            amount={ outboundParam.amount }
            decimals={ tx.decimals ?? null }
            isLoading={ isLoading }
          />
          <span className="font-medium text-[var(--color-text-secondary)]">Gas used</span>
          <span className="overflow-hidden">
            { BigNumber(outboundParam.gas_used || 0).div(10 ** gasDecimals).toFormat() }&nbsp;
          </span>
        </>
      );
      text = `Reverted to ${ chainTo?.name || 'Unknown chain' }`;
      color = 'text.success';
    }
  } else if (tx.cctx_status?.status === CctxStatus.Aborted) {
    if (!isLast) {
      content = (
        <>
          <span className="font-medium text-[var(--color-text-secondary)]">Receiver</span>
          <AddressEntityZetaChain
            address={{ hash: outboundParam.receiver }}
            chainId={ outboundParam.receiver_chain_id?.toString() }
            isLoading={ isLoading }
            truncation="constant"
          />
        </>
      );
      text = `Destination tx failed`;
      color = 'text.error';
    } else {
      content = (
        <>
          <span className="font-medium text-[var(--color-text-secondary)]">Sender</span>
          <AddressEntityZetaChain
            address={{ hash: outboundParam.receiver }}
            chainId={ outboundParam.receiver_chain_id?.toString() }
            isLoading={ isLoading }
            truncation="constant"
          />
        </>
      );
      const isFailed = tx.cctx_status?.is_abort_refunded === false;
      text = isFailed ? `Abort failed` : `Abort executed`;
      color = isFailed ? 'text.error' : 'text.success';
    }
  }

  return (
    <>
      { /* we need this block here to cover the vertical line (if it's the last block in lifecycle) */ }
      <div className="flex w-full"
      >
        <IconSvg name="verification-steps/finalized" className="w-5 h-5"/>
      </div>
      <Skeleton loading={ isLoading } className="w-full overflow-hidden">
        <div className="flex">
          { text }
        </div>
        <div className="grid rounded-b-md"
          style={{ gridTemplateColumns: "100px 1fr" }}
        >
          { content }
        </div>
      </Skeleton>
    </>
  );
};

export default ZetaChainCCTXDetailsLifecycleOut;
