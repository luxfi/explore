import React from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';
import { cn } from 'lib/utils/cn';

interface Props {
  children: [React.JSX.Element, React.JSX.Element | null] | (React.JSX.Element | null);
  className?: string;
}

const ContractVerificationFormRow = ({ children, className }: Props) => {
  const isMobile = useIsMobile();

  const firstChildren = Array.isArray(children) ? children[0] : children;
  const secondChildren = Array.isArray(children) ? children[1] : null;

  return (
    <>
      <div className={ cn('[&:not(:first-child)]:mt-3 lg:[&:not(:first-child)]:mt-0', className) }>{ firstChildren }</div>
      { isMobile && !secondChildren ? null : <div className={ cn('text-sm text-[var(--color-text-secondary)]', className) }>{ secondChildren }</div> }
    </>
  );
};

export default React.memo(ContractVerificationFormRow);
