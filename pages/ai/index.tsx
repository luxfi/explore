import type { NextPage } from 'next';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

import AIPage from 'ui/ai/AIPage';

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/ai">
      <AIPage/>
    </PageNextJs>
  );
};

export default Page;

export { base as getServerSideProps } from 'nextjs/getServerSideProps/main';
