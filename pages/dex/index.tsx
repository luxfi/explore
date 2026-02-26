import type { NextPage } from 'next';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

import DexPage from 'ui/dex/DexPage';

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/dex">
      <DexPage/>
    </PageNextJs>
  );
};

export default Page;

export { base as getServerSideProps } from 'nextjs/getServerSideProps/main';
