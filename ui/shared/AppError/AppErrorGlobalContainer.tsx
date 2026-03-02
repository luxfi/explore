
import React from 'react';

interface Props {
  children: React.ReactNode;
}

const AppErrorGlobalContainer = ({ children }: Props) => {
  return <div className="mt-8 bg-[var(--color-bg-primary)]">{ children }</div>;
};

export default React.memo(AppErrorGlobalContainer);
