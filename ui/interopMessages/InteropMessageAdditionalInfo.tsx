import React from 'react';

import type { InteropMessage } from 'types/api/interop';

import { PopoverBody, PopoverCloseTriggerWrapper, PopoverContent, PopoverRoot, PopoverTrigger } from '@luxfi/ui/popover';
import AdditionalInfoButton from 'ui/shared/AdditionalInfoButton';
import CopyToClipboard from 'ui/shared/CopyToClipboard';

type Props = {
  payload: InteropMessage['payload'];
  isLoading?: boolean;
  className?: string;
};

const InteropMessageAdditionalInfo = ({ payload, isLoading, className }: Props) => {
  return (
    <PopoverRoot positioning={{ placement: 'right-start' }}>
      <PopoverTrigger>
        <AdditionalInfoButton loading={ isLoading } className={ className }/>
      </PopoverTrigger>
      <PopoverContent className="w-[330px]">
        <PopoverBody>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[var(--chakra-colors-text-secondary)] font-semibold">Message payload</span>
            <PopoverCloseTriggerWrapper>
              <CopyToClipboard text={ payload }/>
            </PopoverCloseTriggerWrapper>
          </div>
          <span>
            { payload }
          </span>
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
};

export default InteropMessageAdditionalInfo;
