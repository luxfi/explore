import React from 'react';

import IconSvg from 'ui/shared/IconSvg';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  isFavorite: boolean;
};

const FavoriteIcon = ({ isFavorite, ...rest }: Props) => {
  return (
    <IconSvg
      name={ isFavorite ? 'heart_filled' : 'heart_outline' }
      { ...rest }
    />
  );
};

export default FavoriteIcon;
