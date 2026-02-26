import type { NextPage } from 'next';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

import BridgePage from 'ui/bridge/BridgePage';

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/bridge">
      <BridgePage/>
    </PageNextJs>
  );
};

export default Page;

export { base as getServerSideProps } from 'nextjs/getServerSideProps/main';
