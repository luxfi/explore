import { Box, Flex, Text, chakra, Center } from '@chakra-ui/react';
import React from 'react';

import IconSvg from 'ui/shared/IconSvg';

import useScoreLevelAndColor from './useScoreLevelAndColor';

interface Props {
  className?: string;
  score: number;
}

const SolidityscanReportScore = ({ className, score }: Props) => {
  const { scoreLevel, scoreColor } = useScoreLevelAndColor(score);

  return (
    <Flex className={ className } alignItems="center">
      <Box
        w={ 12 }
        h={ 12 }
        borderRadius="24px"
        position="relative"
        mr={ 3 }
        style={{
          background: `conic-gradient(${ scoreColor } 0, ${ scoreColor } ${ score }%, var(--color-gray-100) 0, var(--color-gray-100) 100%)`,
        }}
      >
        <Center position="absolute" w="38px" h="38px" top="5px" right="5px" bg="popover.bg" borderRadius="20px">
          <IconSvg name={ score < 80 ? 'score/score-not-ok' : 'score/score-ok' } boxSize={ 5 } color={ scoreColor }/>
        </Center>
      </Box>
      <Box>
        <Flex>
          <Text color={ scoreColor } fontSize="lg" fontWeight={ 500 }>{ score }</Text>
          <Text color="gray.400" fontSize="lg" fontWeight={ 500 } whiteSpace="pre"> / 100</Text>
        </Flex>
        <Text color={ scoreColor } fontWeight={ 500 }>Security score is { scoreLevel }</Text>
      </Box>
    </Flex>
  );
};

export default chakra(SolidityscanReportScore);
