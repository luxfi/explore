import React from 'react';

import type { AddressMetadataTagFormatted } from 'types/client/addressMetadata';

import { cn } from 'lib/utils/cn';
import type { AlertProps } from 'toolkit/chakra/alert';
import { Alert } from 'toolkit/chakra/alert';

interface Props {
  tags: Array<AddressMetadataTagFormatted> | undefined;
  isScamToken?: boolean;
  className?: string;
}

const AddressAlerts = ({ tags, isScamToken, className }: Props) => {
  const noteTags = tags?.filter(({ tagType }) => tagType === 'note').filter(({ meta }) => meta?.data);

  if (!noteTags?.length && !isScamToken) {
    return null;
  }

  return (
    <div className={ cn('flex flex-col gap-y-1 lg:gap-y-2 mb-3', className) }>
      { isScamToken && (
        <Alert status="error">
          This token has been flagged as a potential scam.
        </Alert>
      ) }
      { noteTags?.map((noteTag) => (
        <Alert
          key={ noteTag.name }
          status={ noteTag.meta?.alertStatus as AlertProps['status'] ?? 'error' }
          className="whitespace-pre-wrap inline-block [&_a]:text-[var(--color-link-primary)] [&_a:hover]:text-[var(--color-link-primary-hover)]"
          style={{
            backgroundColor: noteTag.meta?.alertBgColor || undefined,
            color: noteTag.meta?.alertTextColor || undefined,
          }}
        >
          <div dangerouslySetInnerHTML={{ __html: noteTag.meta?.data ?? '' }}/>
        </Alert>
      )) }
    </div>
  );
};

export default React.memo(AddressAlerts);
