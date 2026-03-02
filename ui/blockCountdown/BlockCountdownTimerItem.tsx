import React from 'react';

import { TruncatedText } from 'toolkit/components/truncation/TruncatedText';

interface Props {
  label: string;
  value: string;
}

const BlockCountdownTimerItem = ({ label, value }: Props) => {
  return (
    <div className="min-w-[70px] lg:min-w-[100px] text-center flex-[1_1_auto] overflow-hidden">
      <TruncatedText
        text={ value }
        className="font-heading text-[40px] lg:text-[48px] leading-[48px] font-semibold w-full"
      />
      <div className="text-sm mt-1 leading-[20px] text-[var(--color-text-secondary)]">{ label }</div>
    </div>
  );
};

export default React.memo(BlockCountdownTimerItem);
