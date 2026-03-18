import React from 'react';

import type { SkeletonProps } from 'toolkit/chakra/skeleton';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Hint } from 'toolkit/components/Hint/Hint';

interface Props {
  label: string;
  children: React.ReactNode;
  isLoading?: boolean;
  hint?: string;
  className?: string;
  contentProps?: Partial<Pick<SkeletonProps, 'className' | 'style'>>;
}

const ContractDetailsInfoItem = ({ label, children, isLoading, hint, className, contentProps }: Props) => {
  return (
    <>
      <Skeleton loading={ isLoading } flexShrink={ 0 } fontWeight={ 500 }>
        <div className="flex items-center">
          { label }
          { hint && <Hint label={ hint } ml={ 2 }/> }
        </div>
      </Skeleton>
      <Skeleton loading={ isLoading } className={ `break-all max-w-full overflow-hidden ${ className || '' }`.trim() } { ...contentProps }>{ children }</Skeleton>
    </>
  );
};

export default React.memo(ContractDetailsInfoItem);
