import React from 'react';

import type { CctxListItem } from '@luxfi/zetachain-cctx-types';

import { SECOND } from 'toolkit/utils/consts';
import AddressFromTo from 'ui/shared/address/AddressFromTo';
import TxEntityZetaChainCC from 'ui/shared/entities/tx/TxEntityZetaChainCC';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';
import ZetaChainCCTXReducedStatus from 'ui/shared/zetaChain/ZetaChainCCTXReducedStatus';
import ZetaChainCCTXValue from 'ui/shared/zetaChain/ZetaChainCCTXValue';

type Props = {
  tx: CctxListItem;
  isLoading?: boolean;
  animation?: string;
};

const LatestZetaChainCCTXItem = ({ tx, isLoading, animation }: Props) => {
  return (
    <div
      className="grid gap-3 w-full min-w-[740px] border-b border-[var(--color-border-divider)] items-center p-4 text-sm"
      style={{
        gridTemplateColumns: '18px 120px 80px 350px auto',
        animation: animation || undefined,
      }}
    >
      <ZetaChainCCTXReducedStatus status={ tx.status_reduced } isLoading={ isLoading }/>
      <TxEntityZetaChainCC truncation="constant" hash={ tx.index } isLoading={ isLoading } className="font-semibold"/>
      <TimeWithTooltip color="text.secondary" timestamp={ Number(tx.last_update_timestamp) * SECOND } isLoading={ isLoading } timeFormat="relative"/>
      <AddressFromTo
        from={{ hash: tx.sender_address, chainId: tx.source_chain_id.toString(), chainType: 'zeta' }}
        to={{ hash: tx.receiver_address, chainId: tx.target_chain_id.toString(), chainType: 'zeta' }}
        isLoading={ isLoading }
      />
      <ZetaChainCCTXValue
        coinType={ tx.coin_type }
        tokenSymbol={ tx.token_symbol }
        amount={ tx.amount }
        decimals={ tx.decimals }
        isLoading={ isLoading }
      />
    </div>
  );
};

export default React.memo(LatestZetaChainCCTXItem);
