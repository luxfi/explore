import React from 'react';

import type { InteropMessage } from 'types/api/interop';

import { PopoverBody, PopoverCloseTriggerWrapper, PopoverContent, PopoverRoot, PopoverTrigger } from 'toolkit/chakra/popover';
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
          <div alignItems="center" justifyContent="space-between" mb={ 3 }>
            <span color="text.secondary" fontWeight="600">Message payload</span>
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
