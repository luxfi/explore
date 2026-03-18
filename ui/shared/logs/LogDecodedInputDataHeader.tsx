import React from 'react';

import { Badge } from 'toolkit/chakra/badge';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Separator } from 'toolkit/chakra/separator';

interface Props {
  methodId: string;
  methodCall: string;
  isLoading?: boolean;
  rightSlot?: React.ReactNode;
}

interface ItemProps extends FlexProps {
  label: string;
  children: React.ReactNode;
  isLoading?: boolean;
}

const Item = ({ label, children, isLoading, ...rest }: ItemProps) => {
  return (
    <div className="flex gap-y-2 w-full"
      columnGap={{ base: 2, lg: 5 }}
      px={{ base: 0, lg: 4 }}
      flexDir={{ base: 'column', lg: 'row' }}
      alignItems={{ base: 'flex-start', lg: 'center' }}
      { ...rest }
    >
      <Skeleton fontWeight={ 600 } flexShrink={ 0 } loading={ isLoading } className="max-lg:w-auto lg:w-[80px]">
        { label }
      </Skeleton >
      { children }
    </div>
  );
};

const LogDecodedInputDataHeader = ({ methodId, methodCall, isLoading, rightSlot }: Props) => {
  return (
    <div className="flex flex-col w-full border-[var(--color-border-divider)] items-start"
      textStyle="sm"
      flexGrow={ 1 }
      gap={ 2 }
      w="100%"
    >
      <div className="flex gap-x-2 w-full">
        <Item label="Method id" isLoading={ isLoading } flexDir="row" alignItems="center">
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
