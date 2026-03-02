import React from 'react';

import { Heading } from '@luxfi/ui/heading';

interface Props {
  children: React.ReactNode;
}

const TokenInfoFormSectionHeader = ({ children }: Props) => {
  return (
    <div className="col-span-1 lg:col-span-2">
      <Heading level="2">
        { children }
      </Heading>
    </div>
  );
};

export default TokenInfoFormSectionHeader;
