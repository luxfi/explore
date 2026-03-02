import React from 'react';

interface Props {
  isOpen: boolean;
}

const SearchBarBackdrop = ({ isOpen }: Props) => {
  return (
    <div
      className={ `fixed top-0 left-0 w-screen h-screen z-[var(--zIndex-overlay)] hidden ${ isOpen ? 'lg:block' : '' } bg-[var(--color-blackAlpha-400)] dark:bg-[var(--color-blackAlpha-600)]` }
    />
  );
};

export default React.memo(SearchBarBackdrop);
