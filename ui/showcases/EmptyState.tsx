import React from 'react';

import { EmptyState } from '@luxfi/ui/empty-state';

import { Section, Container, SectionHeader, SamplesStack, Sample } from './parts';

const EmptyStateShowcase = () => {
  return (
    <Container value="empty-state">
      <Section>
        <SectionHeader>Type</SectionHeader>
        <SamplesStack>
          <Sample label="type: query">
            <EmptyState term="transaction" style={{ outline: '1px dashed deepskyblue' }}/>
          </Sample>
          <Sample label="type: stats">
            <EmptyState type="stats" term="transactions" style={{ outline: '1px dashed deepskyblue' }}/>
          </Sample>
          <Sample label="type: coming_soon">
            <EmptyState type="coming_soon" style={{ outline: '1px dashed deepskyblue' }}/>
          </Sample>
        </SamplesStack>
      </Section>
    </Container>
  );
};

export default React.memo(EmptyStateShowcase);
