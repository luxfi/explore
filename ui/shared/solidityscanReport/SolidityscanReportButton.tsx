import { Spinner, Box } from '@chakra-ui/react';
import React from 'react';

import usePreventFocusAfterModalClosing from 'lib/hooks/usePreventFocusAfterModalClosing';
import type { ButtonProps } from 'toolkit/chakra/button';
import { Button } from 'toolkit/chakra/button';
import { PopoverTrigger } from 'toolkit/chakra/popover';
import { Tooltip } from 'toolkit/chakra/tooltip';
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
      <Box>
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
            <IconSvg name={ score < 80 ? 'score/score-not-ok' : 'score/score-ok' } boxSize={ 5 }/>
            { isLoading && <Spinner size="sm"/> }
            { !isLoading && score }
          </Button>
        </PopoverTrigger>
      </Box>
    </Tooltip>
  );
};

export default SolidityscanReportButton;
