import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

const Compliance = dynamic(() => import('ui/pages/Compliance'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/compliance">
      <Compliance/>
    </PageNextJs>
  );
};

export default Page;

export { base as getServerSideProps } from 'nextjs/getServerSideProps/main';
