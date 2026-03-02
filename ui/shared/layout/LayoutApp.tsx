import React from 'react';

import type { Props } from './types';

import AppErrorBoundary from 'ui/shared/AppError/AppErrorBoundary';
import HeaderMobile from 'ui/snippets/header/HeaderMobile';

import * as Layout from './components';

const LayoutApp = ({ children }: Props) => {
  return (
    <Layout.Root content={ children }>
      <Layout.Container className="overflow-y-hidden h-[100vh] flex flex-col">
        <Layout.TopRow/>
        <HeaderMobile/>
        <Layout.MainArea className="flex-1">
          <Layout.MainColumn className="pt-0 lg:pt-0 pb-0 px-4 lg:px-6">
            <AppErrorBoundary>
              <Layout.Content className="pt-0 lg:pt-2 grow">
                { children }
              </Layout.Content>
            </AppErrorBoundary>
          </Layout.MainColumn>
        </Layout.MainArea>
      </Layout.Container>
    </Layout.Root>
  );
};

export default LayoutApp;
