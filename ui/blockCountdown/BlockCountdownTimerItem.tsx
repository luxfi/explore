import React from 'react';

import { TruncatedText } from 'toolkit/components/truncation/TruncatedText';

interface Props {
  label: string;
  value: string;
}

const BlockCountdownTimerItem = ({ label, value }: Props) => {
  return (
    <div
      minW={{ base: '70px', lg: '100px' }}
      textAlign="center"
      overflow="hidden"
      flex="1 1 auto"
    >
      <TruncatedText
        text={ value }
        className="font-heading text-[40px] lg:text-[48px] leading-[48px] font-semibold w-full"
      />
      <div fontSize="sm" lineHeight="20px" mt={ 1 } color="text.secondary">{ label }</div>
    </div>
  );
};

export default React.memo(BlockCountdownTimerItem);
