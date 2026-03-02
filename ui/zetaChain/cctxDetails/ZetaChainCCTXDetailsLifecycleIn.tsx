import React from 'react';

import type { CrossChainTx } from '@luxfi/zetachain-cctx-types';
import { InboundStatus } from '@luxfi/zetachain-cctx-types';

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
  tx: CrossChainTx;
  isLoading: boolean;
};

const ZetaChainCCTXDetailsLifecycleIn = ({ tx, isLoading }: Props) => {
  const { data: chainsConfig } = useZetaChainConfig();
  const inboundParams = tx.inbound_params;
  if (!inboundParams) {
    return null;
  }
  const chainFromId = inboundParams.sender_chain_id.toString();
  const chainFrom = chainsConfig?.find((chain) => chain.id.toString() === chainFromId);

  const isCCTX = tx.related_cctxs.some((cctx) => cctx.index === inboundParams.observed_hash);
  const color = inboundParams.status === InboundStatus.SUCCESS ? 'text.success' : 'text.error';

  return (
    <>
      <IconSvg
        name="verification-steps/finalized"
        className="w-5 h-5"
      />
      <Skeleton loading={ isLoading }>
        <div className="flex">
          { `Sender tx from ${ chainFrom?.name || 'unknown chain' }` }
        </div>
        <div className="grid overflow-hidden rounded-b-md"
          style={{ gridTemplateColumns: "100px 1fr" }}
        >
          { isCCTX ? (
            <>
              <span className="font-medium text-[var(--color-text-secondary)]">CCTX</span>
              <TxEntityZetaChainCC hash={ inboundParams.observed_hash } isLoading={ isLoading } noIcon/>
            </>
          ) : (
            <>
              <span className="font-medium text-[var(--color-text-secondary)]">Transaction</span>
              { chainFromId !== config.chain.id ? (
                <TxEntityZetaChainExternal chainId={ chainFromId } hash={ inboundParams.observed_hash } noIcon/>
              ) : (
                <TxEntity hash={ inboundParams.observed_hash } noIcon/>
              ) }
            </>
          ) }
          <span className="font-medium text-[var(--color-text-secondary)]">Status</span>
          <StatusTag
            type={ inboundParams.status === InboundStatus.SUCCESS ? 'ok' : 'error' }
            text={ inboundParams.status === InboundStatus.SUCCESS ? 'Success' : 'Failed' }
          />
          { inboundParams.sender && (
            <>
              <span className="font-medium text-[var(--color-text-secondary)]">Sender</span>
              <AddressEntityZetaChain
                address={{ hash: inboundParams.sender }}
                chainId={ inboundParams.sender_chain_id.toString() }
                isLoading={ isLoading }
                truncation="constant"
              />
            </>
          ) }
          { inboundParams.amount && (
            <>
              <span className="font-medium text-[var(--color-text-secondary)]">Transferred</span>
              <ZetaChainCCTXValue
                coinType={ inboundParams.coin_type }
                tokenSymbol={ tx.token_symbol }
                amount={ inboundParams.amount }
                decimals={ tx.decimals ?? null }
                isLoading={ isLoading }
              />
            </>
          ) }
        </div>
      </Skeleton>
    </>
  );
};

export default ZetaChainCCTXDetailsLifecycleIn;
