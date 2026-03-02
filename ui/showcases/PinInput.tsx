import React from 'react';

import { PinInput } from '@luxfi/ui/pin-input';

import { Section, Container, SectionHeader, SamplesStack, Sample } from './parts';

const PinInputShowcase = () => {

  return (
    <Container value="pin-input">
      <Section>
        <SectionHeader>Variant</SectionHeader>
        <SamplesStack >
          <Sample label="variant: outline">
            <PinInput otp count={ 3 }/>
            <div className="bg-[var(--color-blackAlpha-200)] dark:bg-[var(--color-whiteAlpha-200)] p-2 rounded-base w-full">
              <PinInput otp count={ 3 } value={ [ '1', '2', '3' ] }/>
            </div>
          </Sample>
        </SamplesStack>
      </Section>

      <Section>
        <SectionHeader>Disabled</SectionHeader>
        <SamplesStack >
          <Sample label="disabled: true">
            <PinInput otp count={ 3 } disabled value={ [ '1', '2', '3' ] }/>
            <div className="bg-[var(--color-blackAlpha-200)] dark:bg-[var(--color-whiteAlpha-200)] p-2 rounded-base w-full">
              <PinInput otp count={ 3 } disabled value={ [ '1', '2', '3' ] }/>
            </div>
          </Sample>
        </SamplesStack>
      </Section>
    </Container>
  );
};

export default React.memo(PinInputShowcase);
