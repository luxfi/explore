import React from 'react';

import type { Step } from './types';

import IconSvg from 'ui/shared/IconSvg';

interface Props {
  step: Step;
  isLast: boolean;
  isPassed: boolean;
  isPending?: boolean;
  noIcon?: boolean;
  className?: string;
  [key: string]: unknown;
}

const VerificationStep = ({ step, isLast, isPassed, isPending, noIcon, className, ...rest }: Props) => {
  let stepColor = 'text.secondary';
  if (isPending) {
    stepColor = 'yellow.500';
  } else if (isPassed) {
    stepColor = 'green.500';
  }

  return (
    <div className={ `flex flex-row gap-2 min-h-[30px] lg:min-h-[32px] items-center ${ className ?? '' }`.trim() } { ...rest }>
      { !noIcon && <IconSvg name={ isPassed ? 'verification-steps/finalized' : 'verification-steps/unfinalized' } boxSize={ 5 } color={ stepColor }/> }
      <span style={{ color: `var(--color-${ stepColor.replace('.', '-') })` }}>{ typeof step === 'string' ? step : step.content }</span>
      { !isLast && <IconSvg name="arrows/east" boxSize={ 5 } color={ stepColor }/> }
    </div>
  );
};

export default VerificationStep;
