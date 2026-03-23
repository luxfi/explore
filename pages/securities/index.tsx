import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

const Securities = dynamic(() => import('ui/pages/Securities'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/securities">
      <Securities/>
    </PageNextJs>
  );
};

export default Page;

export { base as getServerSideProps } from 'nextjs/getServerSideProps/main';
