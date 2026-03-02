import type { NextPageContext } from 'next';
import NextErrorComponent from 'next/error';
import React from 'react';

type Props = {
  statusCode: number;
};

const CustomErrorComponent = (props: Props) => {
  return <NextErrorComponent statusCode={ props.statusCode }/>;
};

CustomErrorComponent.getInitialProps = async(context: NextPageContext) => {
  const baseProps = await NextErrorComponent.getInitialProps(context);
  return {
    ...baseProps,
    statusCode: context.res?.statusCode ?? context.err?.statusCode ?? 500,
  };
};

export default CustomErrorComponent;
