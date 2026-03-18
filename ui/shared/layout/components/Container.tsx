import React from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
}

const Container = ({ children, className }: Props) => {
  return (
    <div       className={ className } className="min-w-[100vw] lg:min-w-[fit-content]" className="mx-auto bg-[var(--color-bg-primary)]"
    >
      { children }
    </div>
  );
};

export default React.memo(Container);
