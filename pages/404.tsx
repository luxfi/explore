import React from 'react';

import type { NextPageWithLayout } from 'nextjs/types';

import PageNextJs from 'nextjs/PageNextJs';

const Page: NextPageWithLayout = () => {
  return (
    <PageNextJs pathname="/404">
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <span className="text-6xl">404</span>
        <h1 className="text-xl font-semibold">Page not found</h1>
        <a href="/" className="text-sm text-blue-400 hover:underline">Go to homepage</a>
      </div>
    </PageNextJs>
  );
};

export default Page;
