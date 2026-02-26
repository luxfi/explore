import type { NextPage } from 'next';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

import ChainsPage from 'ui/chains/ChainsPage';

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/chains">
      <ChainsPage/>
    </PageNextJs>
  );
};

export default Page;

export { base as getServerSideProps } from 'nextjs/getServerSideProps/main';
