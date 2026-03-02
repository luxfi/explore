import React from 'react';

import { IconButton } from '@luxfi/ui/icon-button';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  loading?: boolean;
  className?: string;
}

const AdditionalInfoButton = (props: Props, ref: React.ForwardedRef<HTMLButtonElement>) => {
  const { loading, ...rest } = props;

  return (
    <IconButton
      ref={ ref }
      variant="icon_secondary"
      aria-label="Transaction info"
      size="2xs"
      className="rounded-base data-[state=open]:bg-[var(--color-selected-control-bg)] data-[state=open]:text-[var(--color-selected-control-text)]"
      loadingSkeleton={ loading }
      { ...rest }
    >
      <IconSvg name="info" className="w-5 h-5"/>
    </IconButton>
  );
};

export default React.forwardRef(AdditionalInfoButton);
