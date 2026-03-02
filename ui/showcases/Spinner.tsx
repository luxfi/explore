import React from 'react';

import { Section, Container, SectionHeader, SamplesStack, Sample, SectionSubHeader } from './parts';

const SPINNER_SIZES = {
  xs: 'h-3 w-3 border',
  sm: 'h-4 w-4 border-2',
  md: 'h-5 w-5 border-2',
  lg: 'h-6 w-6 border-2',
  xl: 'h-8 w-8 border-2',
} as const;

const SpinnerShowcase = () => {

  return (
    <Container value="spinner">
      <Section>
        <SectionHeader>Spinner</SectionHeader>
        <SectionSubHeader>Sizes</SectionSubHeader>
        <SamplesStack>
          { ([ 'xs', 'sm', 'md', 'lg', 'xl' ] as const).map((size) => (
            <Sample key={ size } label={ `size: ${ size }` }>
              <div className={ `animate-spin rounded-full border-current border-t-transparent ${ SPINNER_SIZES[size] }` }/>
            </Sample>
          )) }
        </SamplesStack>
      </Section>
    </Container>
  );
};

export default React.memo(SpinnerShowcase);
