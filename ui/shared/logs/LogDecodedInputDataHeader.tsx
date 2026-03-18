import React from 'react';

import { cn } from 'lib/utils/cn';
import { Badge } from 'toolkit/chakra/badge';
import { Skeleton } from 'toolkit/chakra/skeleton';

interface Props {
  methodId: string;
  methodCall: string;
  isLoading?: boolean;
  rightSlot?: React.ReactNode;
}

interface ItemProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  children: React.ReactNode;
  isLoading?: boolean;
}

const Item = ({ label, children, isLoading, className, ...rest }: ItemProps) => {
  return (
    <div
      className={ cn('flex gap-y-2 gap-x-2 lg:gap-x-5 w-full px-0 lg:px-4 flex-col lg:flex-row items-start lg:items-center', className) }
      { ...rest }
    >
      <Skeleton loading={ isLoading } className="font-semibold shrink-0 max-lg:w-auto lg:w-[80px]">
        { label }
      </Skeleton>
      { children }
    </div>
  );
};

const LogDecodedInputDataHeader = ({ methodId, methodCall, isLoading, rightSlot }: Props) => {
  return (
    <div className="flex flex-col w-full border-[var(--color-border-divider)] items-start text-sm grow gap-2">
      <div className="flex gap-x-2 w-full">
        <Item label="Method id" isLoading={ isLoading } className="flex-row items-center">
          <Badge loading={ isLoading }>{ methodId }</Badge>
        </Item>
        { rightSlot }
      </div>
      <Item label="Call" isLoading={ isLoading }>
        <Skeleton loading={ isLoading } className="whitespace-pre-wrap break-all flex-grow">{ methodCall }</Skeleton>
      </Item>
    </div>
  );
};

export default LogDecodedInputDataHeader;
