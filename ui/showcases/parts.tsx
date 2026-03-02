import React from 'react';

import type { TabsContentProps } from '@luxfi/ui/tabs';
import { Heading } from '@luxfi/ui/heading';
import { TabsContent } from '@luxfi/ui/tabs';

export const Container = (props: TabsContentProps) => <TabsContent className="flex flex-col gap-6 w-full" { ...props }/>;
export const Section = (props: React.HTMLAttributes<HTMLElement> & { title?: string }) => <section { ...props }/>;
export const SectionHeader = ({ children }: { children: React.ReactNode }) => <Heading level="2" className="mb-4">{ children }</Heading>;
export const SectionSubHeader = ({ children }: { children: React.ReactNode }) => <Heading level="3" className="mb-3 [&:not(:first-child)]:mt-4">{ children }</Heading>;
export const SamplesStack = ({ children }: { children: React.ReactNode }) => (
  <div
    className="grid gap-y-4 gap-x-8 justify-items-start items-start"
    style={{ gridTemplateColumns: 'fit-content(100%) 1fr' }}
  >
    { children }
  </div>
);
export const Sample = ({ children, label, vertical, className, ...props }: {
  children: React.ReactNode;
  vertical?: boolean;
  label?: string;
  className?: string;
  [key: string]: unknown;
}) => {
  return (
    <>
      { label && <code className="w-fit">{ label }</code> }
      <div
        className={ `flex gap-3 whitespace-pre-wrap flex-wrap ${ vertical ? 'flex-col items-start' : 'flex-row items-center' } ${ !label ? 'col-span-2' : '' } ${ className ?? '' }`.trim() }
        { ...props }
      >
        { children }
      </div>
    </>
  );
};
