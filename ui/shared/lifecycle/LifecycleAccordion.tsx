import React from 'react';

import type { StepStatus } from './types';

import { AccordionItem, AccordionItemContent, AccordionItemTrigger, AccordionRoot } from '@luxfi/ui/accordion';
import { Skeleton } from '@luxfi/ui/skeleton';
import IconSvg from 'ui/shared/IconSvg';

export const Root = (props: React.ComponentPropsWithoutRef<typeof AccordionRoot>) => {
  return (
    <AccordionRoot className="max-w-[800px] flex flex-col gap-y-6" lazyMount { ...props }/>
  );
};

interface TriggerProps {
  status: StepStatus;
  text: string;
  isFirst: boolean;
  isLast: boolean;
  isLoading?: boolean;
  isDisabled?: boolean;
}

export const Trigger = ({ status, text, isFirst, isLast, isLoading, isDisabled }: TriggerProps) => {
  const content = (() => {
    switch (status) {
      case 'pending': {
        return (
          <div className="flex flex-row gap-2">
            <div className="animate-spin rounded-full border-2 border-current border-t-transparent h-5 w-5"/>
            <div className="text-[var(--color-text-secondary)]">
              { text }
            </div>
          </div>
        );
      }
      default: {
        const { icon, color } = (() => {
          switch (status) {
            case 'success': {
              return { icon: 'verification-steps/finalized' as const, color: 'green.500' };
            }
            case 'error': {
              return { icon: 'verification-steps/error' as const, color: 'red.600' };
            }
            case 'unfinalized': {
              return { icon: 'verification-steps/unfinalized' as const, color: 'text.secondary' };
            }
          }
        })();
        return (
          <div className="flex flex-row gap-2" style={{ color: color }}>
            <IconSvg name={ icon } className="size-5" isLoading={ isLoading }/>
            <Skeleton loading={ isLoading }>
              { text }
            </Skeleton>
          </div>
        );
      }
    }
  })();

  return (
    <AccordionItemTrigger
      className={ `relative ${ isFirst ? 'pt-0' : 'pt-1' } pb-1` }
      style={{
        ...(isDisabled ? { cursor: 'default', opacity: 1 } : { cursor: 'pointer' }),
      }}
      disabled={ isLoading || isDisabled }
      noIndicator={ isLoading || isDisabled }
    >
      { !isFirst && (
        <span
          className="absolute left-[9px] w-0 h-[30px] border-l-2 border-[var(--color-border-divider)]"
          style={{ bottom: 'calc(100% - 6px)' }}
        />
      ) }
      { !isLast && (
        <span
          className="absolute left-[9px] w-0 h-[6px] border-l-2 border-[var(--color-border-divider)] group-data-[state=open]/trigger:h-[14px] lg:group-data-[state=open]/trigger:h-[6px]"
          style={{ top: 'calc(100% - 6px)' }}
        />
      ) }
      { content }
    </AccordionItemTrigger>
  );
};

export const Item = (props: React.ComponentPropsWithoutRef<typeof AccordionItem>) => {
  return <AccordionItem className="border-b-0" { ...props }/>;
};

interface ContentProps extends React.ComponentPropsWithoutRef<typeof AccordionItemContent> {
  isLast?: boolean;
}

export const ItemContent = ({ isLast, className, ...rest }: ContentProps) => {
  return (
    <AccordionItemContent
      className={ `pt-2 pb-0 lg:ml-[9px] lg:pl-[17px] lg:border-l-2 ${ isLast ? 'border-transparent' : 'border-[var(--color-border-divider)]' } ${ className ?? '' }`.trim() }
      { ...rest }
    />
  );
};

export const ItemBody = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={ `grid items-start rounded-bl rounded-br gap-x-3 gap-y-1 text-sm bg-[var(--color-blackAlpha-50)] dark:bg-[var(--color-whiteAlpha-50)] p-[6px] pl-[18px] ${ className ?? '' }`.trim() }
      style={{ gridTemplateColumns: '112px minmax(0, 1fr)' }}
      { ...props }
    />
  );
};

interface ItemRowProps {
  label: string;
  children: React.ReactNode;
}

export const ItemRow = ({ label, children }: ItemRowProps) => {
  return (
    <>
      <div className="text-[var(--color-text-secondary)] py-[6px]">
        { label }
      </div>
      <div>
        { children }
      </div>
    </>
  );
};
