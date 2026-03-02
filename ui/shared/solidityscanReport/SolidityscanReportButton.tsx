import React from 'react';

import usePreventFocusAfterModalClosing from 'lib/hooks/usePreventFocusAfterModalClosing';
import type { ButtonProps } from '@luxfi/ui/button';
import { Button } from '@luxfi/ui/button';
import { PopoverTrigger } from '@luxfi/ui/popover';
import { Tooltip } from '@luxfi/ui/tooltip';
import IconSvg from 'ui/shared/IconSvg';

import useScoreLevelAndColor from './useScoreLevelAndColor';

interface Props extends ButtonProps {
  score: number;
  isLoading?: boolean;
  tooltipDisabled?: boolean;
}

const SolidityscanReportButton = ({ score, isLoading, tooltipDisabled, ...rest }: Props) => {
  const { scoreColor } = useScoreLevelAndColor(score);
  const colorLoading = 'var(--color-text-secondary)';
  const onFocusCapture = usePreventFocusAfterModalClosing();

  return (
    <Tooltip content="Security score" disabled={ tooltipDisabled } disableOnMobile closeOnClick>
      <div>
        <PopoverTrigger>
          <Button
            size="sm"
            variant="dropdown"
            aria-label="SolidityScan score"
            className="font-medium px-[6px] shrink-0 gap-1"
            style={{ color: isLoading ? colorLoading : scoreColor }}
            disabled={ isLoading }
            onFocusCapture={ onFocusCapture }
            { ...rest }
          >
            <IconSvg name={ score < 80 ? 'score/score-not-ok' : 'score/score-ok' } className="size-5"/>
            { isLoading && <div className="animate-spin rounded-full border-2 border-current border-t-transparent h-4 w-4"/> }
            { !isLoading && score }
          </Button>
        </PopoverTrigger>
      </div>
    </Tooltip>
  );
};

export default SolidityscanReportButton;
