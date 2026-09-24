import type { NextPage } from 'next';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

import ChainDetailPage from 'ui/chains/ChainDetailPage';

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/chains/[slug]">
      <ChainDetailPage/>
    </PageNextJs>
  );
};

export default Page;

export { primaryNetwork as getServerSideProps } from 'nextjs/getServerSideProps/main';
