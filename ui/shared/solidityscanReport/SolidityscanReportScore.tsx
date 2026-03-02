import React from 'react';

import { cn } from 'lib/utils/cn';
import IconSvg from 'ui/shared/IconSvg';

import useScoreLevelAndColor from './useScoreLevelAndColor';

interface Props {
  className?: string;
  score: number;
}

const SolidityscanReportScore = ({ className, score }: Props) => {
  const { scoreLevel, scoreColor } = useScoreLevelAndColor(score);

  return (
    <div className={ cn('flex items-center', className) }>
      <div
        className="relative mr-3"
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '24px',
          background: `conic-gradient(${ scoreColor } 0, ${ scoreColor } ${ score }%, var(--color-gray-100) 0, var(--color-gray-100) 100%)`,
        }}
      >
        <div
          className="flex items-center justify-center absolute w-[38px] h-[38px] rounded-[20px]"
          style={{ top: '5px', right: '5px', backgroundColor: 'var(--color-popover-bg)' }}
        >
          <IconSvg name={ score < 80 ? 'score/score-not-ok' : 'score/score-ok' } className="size-5" style={{ color: scoreColor }}/>
        </div>
      </div>
      <div>
        <div className="flex">
          <span className="text-lg font-medium" style={{ color: scoreColor }}>{ score }</span>
          <span className="text-lg font-medium whitespace-pre text-[var(--color-gray-400)]"> / 100</span>
        </div>
        <span className="font-medium" style={{ color: scoreColor }}>Security score is { scoreLevel }</span>
      </div>
    </div>
  );
};

export default SolidityscanReportScore;
