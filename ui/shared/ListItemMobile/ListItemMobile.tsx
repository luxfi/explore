import React from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
  animation?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const ListItemMobile = ({ children, className, animation }: Props) => {
  return (
    <div className="flex items-start flex-col gap-y-6 text-[16px] leading-[20px] border-t border-[var(--color-border-divider)] py-6"
      className={ className }
    >
      { children }
    </div>
  );
};

export default ListItemMobile;
