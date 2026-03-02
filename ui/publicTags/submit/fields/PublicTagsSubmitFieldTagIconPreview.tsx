import React from 'react';

import { cn } from 'lib/utils/cn';

interface Props {
  url: string | undefined;
  isInvalid: boolean;
  children: React.ReactElement;
}

const PublicTagsSubmitFieldTagIconPreview = ({ url, isInvalid, children }: Props) => {
  return (
    <div
      className={ cn(
        'flex items-center justify-center w-[60px] h-[60px] shrink-0 border-2 rounded-base bg-[var(--color-bg-primary)]',
        url
          ? isInvalid ? 'border-[var(--color-error)]' : 'border-[var(--color-input-border-filled)]'
          : 'border-[var(--color-input-border)]',
      ) }
    >
      { children }
    </div>
  );
};

export default React.memo(PublicTagsSubmitFieldTagIconPreview);
