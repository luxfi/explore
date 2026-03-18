import React from 'react';


import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tooltip } from 'toolkit/chakra/tooltip';

interface Props extends HTMLChakraProps<'div'> {
  isLoading?: boolean;
}

const LogIndex = ({ children, isLoading, ...props }: Props) => {
  return (
    <Tooltip content="Log index">
      <Skeleton loading={ isLoading } className="inline-block">
        <div className="flex items-center justify-center rounded px-2" style={{ color: isLoading ? 'transparent' : { _light: 'gray.600', _dark: 'gray.50'  }} } style={{ backgroundColor: isLoading ? undefined : { _light: 'gray.100', _dark: 'gray.600'  }} }
          { ...props }
        >
          { children }
        </div>
      </Skeleton>
    </Tooltip>
  );
};

export default React.memo(LogIndex);
