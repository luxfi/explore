import type { BoxProps, StackProps } from '@chakra-ui/react';
import { Box, Code, Grid, HStack, VStack } from '@chakra-ui/react';
import React from 'react';

import type { TabsContentProps } from 'toolkit/chakra/tabs';
import { Heading } from 'toolkit/chakra/heading';
import { TabsContent } from 'toolkit/chakra/tabs';

export const Container = (props: TabsContentProps) => <TabsContent className="flex flex-col gap-6 w-full" { ...props }/>;
export const Section = (props: BoxProps) => <Box { ...props } as="section"/>;
export const SectionHeader = ({ children }: { children: React.ReactNode }) => <Heading level="2" className="mb-4">{ children }</Heading>;
export const SectionSubHeader = ({ children }: { children: React.ReactNode }) => <Heading level="3" className="mb-3 [&:not(:first-child)]:mt-4">{ children }</Heading>;
export const SamplesStack = ({ children }: { children: React.ReactNode }) => (
  <Grid
    rowGap={ 4 }
    columnGap={ 8 }
    gridTemplateColumns="fit-content(100%) 1fr"
    justifyItems="flex-start"
    alignItems="flex-start"
  >
    { children }
  </Grid>
);
export const Sample = ({ children, label, vertical, ...props }: { children: React.ReactNode; vertical?: boolean; label?: string } & StackProps) => {
  const Stack = vertical ? VStack : HStack;
  return (
    <>
      { label && <Code w="fit-content">{ label }</Code> }
      <Stack
        gap={ 3 }
        whiteSpace="pre-wrap"
        flexWrap="wrap"
        columnSpan={ label ? '1' : '2' }
        alignItems={ vertical ? 'flex-start' : 'center' }
        { ...props }
      >
        { children }
      </Stack>
    </>
  );
};
