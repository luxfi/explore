import React from 'react';

import type { Props } from './types';

import AppErrorBoundary from 'ui/shared/AppError/AppErrorBoundary';
import HeaderAlert from 'ui/snippets/header/HeaderAlert';
import HeaderMobile from 'ui/snippets/header/HeaderMobile';

import * as Layout from './components';

const LayoutHome = ({ children }: Props) => {
  return (
    <Layout.Root content={ children }>
      <Layout.Container>
        <Layout.TopRow/>
        <Layout.NavBar/>
        <HeaderMobile hideSearchButton/>
        <Layout.MainArea>
          <Layout.SideBar/>
          <Layout.MainColumn className="pt-3 lg:pt-6">
            <HeaderAlert className="mb-3"/>
            <AppErrorBoundary>
              { children }
            </AppErrorBoundary>
          </Layout.MainColumn>
        </Layout.MainArea>
        <Layout.Footer/>
      </Layout.Container>
    </Layout.Root>
  );
};

export default LayoutHome;
