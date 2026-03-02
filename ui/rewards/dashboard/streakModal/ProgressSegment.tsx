import { clamp } from 'es-toolkit';

import { Progress } from '@luxfi/ui/progress';
import IconSvg from 'ui/shared/IconSvg';

type Props = {
  value: number;
  target: number;
  prevTarget: number;
  isFirst: boolean;
};

export default function ProgressSegment({ value, target, prevTarget, isFirst }: Props) {
  const isDone = value >= target;
  const progress = clamp(value, prevTarget, target);

  return (
    <div className={ `flex gap-0 min-w-0 ${ isFirst ? 'flex-[0.7] lg:flex-1' : 'flex-1' }` }>
      <div className="flex flex-1 items-center h-[32px] lg:h-[40px] -mx-2.5">
        <Progress
          value={ progress }
          min={ prevTarget }
          max={ target }
          w="full"
          color="green.400"
          trackProps={{
            borderStartRadius: isFirst ? undefined : 0,
            borderEndRadius: 0,
          }}
        />
      </div>
      <div className="flex flex-col items-center gap-2 shrink-0 w-[60px]">
        <div className="flex h-[32px] lg:h-[40px] items-center">
          <div
            className={ `flex w-[40px] h-[32px] rounded-lg items-center justify-center z-[1] ${
              isDone ? 'bg-green-400' : 'bg-[var(--color-progress-track)]'
            }` }
          >
            { isDone ? (
              <IconSvg name="check" className="w-5 h-5 text-white"/>
            ) : (
              <IconSvg name="hexagon" className="w-4 h-4 text-[var(--color-icon-secondary)]"/>
            ) }
          </div>
        </div>
        <span className="text-xs text-[var(--color-text-secondary)]">{ target } Days</span>
      </div>
    </div>
  );
}
