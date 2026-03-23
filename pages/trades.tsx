import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

const Trades = dynamic(() => import('ui/pages/Trades'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/trades">
      <Trades/>
    </PageNextJs>
  );
};

export default Page;

export { base as getServerSideProps } from 'nextjs/getServerSideProps/main';
