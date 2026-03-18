import React from 'react';

const FallbackBox = (props: BoxProps) => {
  return <div h={ 3 } className="bg-[var(--color-blackAlpha-50)] dark:bg-[var(--color-whiteAlpha-100)]" className="rounded-sm" { ...props }/>;
};

export default React.memo(FallbackBox);
