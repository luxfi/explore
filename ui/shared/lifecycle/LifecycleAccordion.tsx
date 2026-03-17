import { Box, Spinner, HStack, Grid, GridItem } from '@chakra-ui/react';
import React from 'react';

import type { StepStatus } from './types';

import { AccordionItem, AccordionItemContent, AccordionItemTrigger, AccordionRoot } from 'toolkit/chakra/accordion';
import { Skeleton } from 'toolkit/chakra/skeleton';
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
          <HStack gap={ 2 }>
            <Spinner size="md"/>
            <Box color="text.secondary">
              { text }
            </Box>
          </HStack>
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
          <HStack gap={ 2 } color={ color }>
            <IconSvg name={ icon } boxSize={ 5 } isLoading={ isLoading }/>
            <Skeleton loading={ isLoading }>
              { text }
            </Skeleton>
          </HStack>
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

export const ItemBody = (props: React.ComponentPropsWithoutRef<typeof Grid>) => {
  return (
    <Grid
      gridTemplateColumns="112px minmax(0, 1fr)"
      alignItems="flex-start"
      columnGap={ 3 }
      rowGap={ 1 }
      bgColor={{ _light: 'blackAlpha.50', _dark: 'whiteAlpha.50' }}
      p="6px"
      pl="18px"
      textStyle="sm"
      borderBottomLeftRadius="base"
      borderBottomRightRadius="base"
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
      <GridItem color="text.secondary" py="6px">
        { label }
      </GridItem>
      <GridItem>
        { children }
      </GridItem>
    </>
  );
};
