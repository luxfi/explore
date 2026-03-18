import React from 'react';

import type { CollapsibleDetailsProps } from 'toolkit/chakra/collapsible';
import { CollapsibleDetails } from 'toolkit/chakra/collapsible';
import { Hint } from 'toolkit/components/Hint/Hint';
import { TruncatedText } from 'toolkit/components/truncation/TruncatedText';

interface ContainerProps extends CollapsibleDetailsProps {}

export const Container = ({ children, ...rest }: ContainerProps) => {
  return (
    <CollapsibleDetails noScroll variant="secondary" className="block text-sm" { ...rest }>
      <div
        className="grid items-start text-sm w-full p-2 lg:p-3 mt-1 gap-x-3 gap-y-4 rounded-b-base bg-[var(--color-blackAlpha-50)] dark:bg-[var(--color-whiteAlpha-50)]"
        style={{ gridTemplateColumns: 'max-content minmax(0px, 1fr)' }}
      >
        { children }
      </div>
    </CollapsibleDetails>
  );
};

interface RowProps {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}

export const Row = ({ label, hint, children, className }: RowProps) => {
  return (
    <>
      <div className={ `text-[var(--color-text-secondary)] flex items-center ${ className || '' }` }>
        { hint && <Hint label={ hint } className="size-4 mr-1"/> }
        <TruncatedText text={ label } maxW={{ base: '130px', lg: 'unset' }}/>
      </div>
      { children }
    </>
  );
};
