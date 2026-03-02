import React from 'react';

interface Props {
  url: string | undefined;
  isInvalid: boolean;
  children: React.ReactElement;
}

const TokenInfoIconPreview = ({ url, isInvalid, children }: Props) => {
  const borderColorActive = isInvalid ? 'error' : 'input.border.filled';

  return (
    <div
    >
      { children }
    </div>
  );
};

export default React.memo(TokenInfoIconPreview);
