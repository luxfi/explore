import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import type { Props } from 'nextjs/getServerSideProps/handlers';
import PageNextJs from 'nextjs/PageNextJs';

const SecurityDetail = dynamic(() => import('ui/pages/SecurityDetail'), { ssr: false });

const Page: NextPage<Props> = (props) => {
  return (
    <PageNextJs pathname="/securities/[id]" query={ props.query }>
      <SecurityDetail/>
    </PageNextJs>
  );
};

export default Page;

export { base as getServerSideProps } from 'nextjs/getServerSideProps/main';
