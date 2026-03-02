import React from 'react';

import { CctxStatus } from '@luxfi/zetachain-cctx-types';

import { Tag } from '@luxfi/ui/tag';

type Props = {
  status: CctxStatus;
  isLoading?: boolean;
};

const TagText: Record<CctxStatus, string> = {
  [CctxStatus.PendingOutbound]: 'Pending outbound',
  [CctxStatus.PendingInbound]: 'Pending inbound',
  [CctxStatus.OutboundMined]: 'Outbound mined',
  [CctxStatus.PendingRevert]: 'Pending revert',
  [CctxStatus.Aborted]: 'Aborted',
  [CctxStatus.Reverted]: 'Reverted',
  [CctxStatus.UNRECOGNIZED]: 'Unknown Status',
};

const ZetaChainCCTXStatusTag = ({ status, isLoading }: Props) => {
  return (
    <Tag loading={ isLoading }>
      { TagText[status] }
    </Tag>
  );
};

export default React.memo(ZetaChainCCTXStatusTag);
