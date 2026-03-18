/* eslint-disable react/jsx-no-bind */
import React from 'react';

import { CollapsibleDetails, CollapsibleList } from 'toolkit/chakra/collapsible';

import { Section, Container, SectionHeader, SamplesStack, Sample, SectionSubHeader } from './parts';
import { TEXT } from './utils';

const CollapsibleShowcase = () => {
  return (
    <Container value="collapsible">
      <Section>
        <SectionHeader>Variant</SectionHeader>
        <SamplesStack >
          <Sample label="variant: default" flexDirection="column" alignItems="flex-start">
            <CollapsibleDetails id="CutLink_1">
              <div className="max-w-[500px]">{ TEXT }</div>
            </CollapsibleDetails>
          </Sample>
        </SamplesStack>
      </Section>

      <Section>
        <SectionHeader>Loading</SectionHeader>
        <SamplesStack >
          <Sample label="loading: true" flexDirection="column" alignItems="flex-start">
            <CollapsibleDetails id="CutLink_2" loading>
              <div className="max-w-[500px]">{ TEXT }</div>
            </CollapsibleDetails>
          </Sample>
        </SamplesStack>
      </Section>

      <Section>
        <SectionHeader>Examples</SectionHeader>

        <SectionSubHeader>Cut link</SectionSubHeader>
        <SamplesStack>
          <Sample label="Show details" flexDirection="column" alignItems="flex-start">
            <CollapsibleDetails id="CutLink_3">
              <div className="max-w-[500px]">{ TEXT }</div>
            </CollapsibleDetails>
          </Sample>
          <Sample label="Expand all list" flexDirection="row" alignItems="flex-start" flexWrap="nowrap">
            <CollapsibleList
              items={ [ 'foo', 'bar', 'baz', 'qux', 'quux', 'corgi', 'gaunt', 'garply', 'waldo', 'fred', 'pugh', 'fuzzy', 'thud' ] }
              renderItem={ (item) => <span>{ item }</span> }
            />
          </Sample>
        </SamplesStack>
      </Section>
    </Container>
  );
};

export default React.memo(CollapsibleShowcase);
