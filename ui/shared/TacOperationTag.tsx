import React from 'react';

import type * as tac from '@luxfi/tac-operation-lifecycle-types';

import { getTacOperationStatus } from 'lib/operations/tac';
import type { BadgeProps } from '@luxfi/ui/badge';
import { Badge } from '@luxfi/ui/badge';

interface Props extends BadgeProps {
  type: tac.OperationType;
}

const TacOperationTag = ({ type, ...rest }: Props) => {

  const text = getTacOperationStatus(type);

  if (!text) {
    return null;
  }

  return <Badge { ...rest }>{ text }</Badge>;
};

export default React.memo(TacOperationTag);
