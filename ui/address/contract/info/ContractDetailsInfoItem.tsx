import { chakra, Flex } from '@chakra-ui/react';
import React from 'react';

import type { SkeletonProps } from 'toolkit/chakra/skeleton';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Hint } from 'toolkit/components/Hint/Hint';

interface Props {
  label: string;
  children: React.ReactNode;
  isLoading?: boolean;
  hint?: string;
  contentProps?: Partial<Pick<SkeletonProps, 'className' | 'style'>>;
}

const ContractDetailsInfoItem = ({ label, children, isLoading, hint, contentProps }: Props) => {
  return (
    <>
      <Skeleton loading={ isLoading } flexShrink={ 0 } fontWeight={ 500 }>
        <Flex alignItems="center">
          { label }
          { hint && <Hint label={ hint } ml={ 2 }/> }
        </Flex>
      </Skeleton>
      <Skeleton loading={ isLoading } className="break-all max-w-full overflow-hidden" { ...contentProps }>{ children }</Skeleton>
    </>
  );
};

export default React.memo(chakra(ContractDetailsInfoItem));
