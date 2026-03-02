import React from 'react';

import usePreventFocusAfterModalClosing from 'lib/hooks/usePreventFocusAfterModalClosing';
import { IconButton } from '@luxfi/ui/icon-button';
import { Tooltip } from '@luxfi/ui/tooltip';
import IconSvg from 'ui/shared/IconSvg';

type Props = {
  onEditClick: () => void;
  onDeleteClick: () => void;
  isLoading?: boolean;
};

const TableItemActionButtons = ({ onEditClick, onDeleteClick, isLoading }: Props) => {
  const onFocusCapture = usePreventFocusAfterModalClosing();

  return (
    <div className="flex flex-row gap-6 self-end">
      <Tooltip content="Edit" disableOnMobile>
        <IconButton
          aria-label="edit"
          variant="link"
          size="2xs"
          onClick={ onEditClick }
          onFocusCapture={ onFocusCapture }
          loadingSkeleton={ isLoading }
          className="rounded-none"
        >
          <IconSvg name="edit"/>
        </IconButton>
      </Tooltip>
      <Tooltip content="Delete" disableOnMobile>
        <IconButton
          aria-label="delete"
          variant="link"
          size="2xs"
          onClick={ onDeleteClick }
          onFocusCapture={ onFocusCapture }
          loadingSkeleton={ isLoading }
          className="rounded-none"
        >
          <IconSvg name="delete"/>
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default React.memo(TableItemActionButtons);
