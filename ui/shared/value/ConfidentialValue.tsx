import React from 'react';

import { Skeleton } from '@luxfi/ui/skeleton';

interface Props {
  loading?: boolean;
  className?: string;
  color?: string;
  mt?: string;
}

const ConfidentialValue = ({ loading, className, color, mt }: Props) => {
  return (
    <Skeleton loading={ loading } display="inline-block" className={ className } style={{ color, marginTop: mt }}>
      &bull;&bull;&bull;&bull;&bull;
    </Skeleton>
  );
};

export default React.memo(ConfidentialValue);
