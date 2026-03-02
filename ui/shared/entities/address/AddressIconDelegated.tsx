import React from 'react';

interface Props {
  isVerified: boolean;
}

const AddressIconDelegated = ({ isVerified }: Props) => {
  return (
    <div
      className={ `absolute w-[14px] h-[14px] -top-[2px] -right-[2px] ${ isVerified ? 'text-green-500' : 'text-[var(--color-icon-primary)]' }` }
    >
      <svg
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="14" height="6" rx="2" x="0" y="4" fill="var(--color-bg-primary)"/>
        <rect width="6" height="14" rx="2" x="4" y="0" fill="var(--color-bg-primary)"/>
        <rect width="10" height="2" rx="0.5" x="2" y="6" fill="currentColor"/>
        <rect width="2" height="10" rx="0.5" x="6" y="2" fill="currentColor"/>
      </svg>
    </div>
  );
};

export default React.memo(AddressIconDelegated);
