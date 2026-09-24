import type { NextPage } from 'next';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

import ValidatorsPage from 'ui/validators/lux/ValidatorsPage';

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/validators">
      <ValidatorsPage/>
    </PageNextJs>
  );
};

export default Page;

export { pChain as getServerSideProps } from 'nextjs/getServerSideProps/main';
