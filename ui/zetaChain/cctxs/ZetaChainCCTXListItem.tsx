import React from 'react';

import type { CctxListItem } from '@luxfi/zetachain-cctx-types';

import dayjs from 'lib/date/dayjs';
import { Skeleton } from '@luxfi/ui/skeleton';
import { SECOND } from 'toolkit/utils/consts';
import AddressEntityZetaChain from 'ui/shared/entities/address/AddressEntityZetaChain';
import TxEntityZetaChainCC from 'ui/shared/entities/tx/TxEntityZetaChainCC';
import TextSeparator from 'ui/shared/TextSeparator';
import Time from 'ui/shared/time/Time';
import ZetaChainCCTXReducedStatus from 'ui/shared/zetaChain/ZetaChainCCTXReducedStatus';
import ZetaChainCCTXValue from 'ui/shared/zetaChain/ZetaChainCCTXValue';

type Props = {
  tx: CctxListItem;
  isLoading?: boolean;
  animation?: string;
};

const LatestZetaChainCCTXItem = ({ tx, isLoading, animation }: Props) => {
  return (
    <div className="flex flex-col"
    >
      <ZetaChainCCTXReducedStatus status={ tx.status_reduced } isLoading={ isLoading } type="full"/>
      <TxEntityZetaChainCC hash={ tx.index } isLoading={ isLoading } truncation="constant_long" className="font-semibold"/>
      <Skeleton loading={ isLoading } className="flex text-[var(--color-text-secondary)] gap-2 justify-start">
        { dayjs(Number(tx.last_update_timestamp) * SECOND).fromNow() }
        <TextSeparator/>
        <Time timestamp={ Number(tx.last_update_timestamp) * SECOND } format="lll_s"/>
      </Skeleton>
      <div className="grid">
        <span>Sender</span>
        <AddressEntityZetaChain
          address={{ hash: tx.sender_address }}
          chainId={ tx.source_chain_id.toString() }
          isLoading={ isLoading }
          truncation="constant"
        />
        <span>Receiver</span>
        <AddressEntityZetaChain
          address={{ hash: tx.receiver_address }}
          chainId={ tx.target_chain_id.toString() }
          isLoading={ isLoading }
          truncation="constant"
        />
        <span>Asset</span>
        <ZetaChainCCTXValue
          coinType={ tx.coin_type }
          tokenSymbol={ tx.token_symbol }
          amount={ tx.amount }
          decimals={ tx.decimals }
          isLoading={ isLoading }
        />
      </div>
    </div>
  );
};

export default React.memo(LatestZetaChainCCTXItem);
