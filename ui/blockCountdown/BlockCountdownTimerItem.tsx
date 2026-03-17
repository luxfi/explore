import { Box } from '@chakra-ui/react';
import React from 'react';

import { TruncatedText } from 'toolkit/components/truncation/TruncatedText';

interface Props {
  label: string;
  value: string;
}

const BlockCountdownTimerItem = ({ label, value }: Props) => {
  return (
    <Box
      minW={{ base: '70px', lg: '100px' }}
      textAlign="center"
      overflow="hidden"
      flex="1 1 auto"
    >
      <TruncatedText
        text={ value }
        className="font-heading text-[40px] lg:text-[48px] leading-[48px] font-semibold w-full"
      />
      <Box fontSize="sm" lineHeight="20px" mt={ 1 } color="text.secondary">{ label }</Box>
    </Box>
  );
};

export default React.memo(BlockCountdownTimerItem);
