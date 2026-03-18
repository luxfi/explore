import React from 'react';

import { Field } from 'toolkit/chakra/field';
import { Textarea } from 'toolkit/chakra/textarea';

import { Section, Container, SectionHeader, SamplesStack, Sample } from './parts';
import { TEXT } from './utils';

const TextareaShowcase = () => {

  return (
    <Container value="textarea">
      <Section>
        <SectionHeader>Variant</SectionHeader>
        <SamplesStack >
          <Sample label="variant: outline" w="360px">
            <Field label="Description" required floating size="2xl">
              <Textarea/>
            </Field>
            <Field label="Description" required floating size="2xl">
              <Textarea value={ TEXT }/>
            </Field>
            <Field label="Description (invalid)" required floating invalid size="2xl">
              <Textarea value={ TEXT }/>
            </Field>
            <Field label="Description (readOnly)" required floating readOnly size="2xl">
              <Textarea value={ TEXT }/>
            </Field>
            <Field label="Description (disabled)" required floating disabled size="2xl">
              <Textarea value={ TEXT }/>
            </Field>
            <div className="bg-[var(--color-blackAlpha-200)] dark:bg-[var(--color-whiteAlpha-200)] p-4 rounded-base w-full">
              <Field label="Description" required floating size="2xl">
                <Textarea value={ TEXT }/>
              </Field>
            </div>
          </Sample>
        </SamplesStack>
      </Section>
    </Container>
  );
};

export default React.memo(TextareaShowcase);
