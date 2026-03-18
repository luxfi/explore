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
    <div className="flex items-center" className={ className }>
      <div         w={ 12 }
        h={ 12 }
        borderRadius="24px" className="relative mr-3"
        style={{
          background: `conic-gradient(${ scoreColor } 0, ${ scoreColor } ${ score }%, var(--color-gray-100) 0, var(--color-gray-100) 100%)`,
        }}
      >
        <div className="flex items-center justify-center absolute w-[38px] h-[38px]" top="5px" right="5px" bg="popover.bg" borderRadius="20px">
          <IconSvg name={ score < 80 ? 'score/score-not-ok' : 'score/score-ok' } boxSize={ 5 } color={ scoreColor }/>
        </div>
      </div>
      <div>
        <div className="flex">
          <span style={{ color: scoreColor  }} className="text-lg" className="font-medium">{ score }</span>
          <span color="gray.400" className="text-lg" className="font-medium" className="whitespace-pre"> / 100</span>
        </div>
        <span style={{ color: scoreColor  }} className="font-medium">Security score is { scoreLevel }</span>
      </div>
    </div>
  );
};

export default SolidityscanReportScore;
