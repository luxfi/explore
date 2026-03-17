import React from 'react';

import { Heading } from 'toolkit/chakra/heading';

interface Props {
  title: string;
}

const AppErrorTitle = ({ title }: Props) => {
  return <Heading className="mt-8" level="1">{ title }</Heading>;
};

export default AppErrorTitle;
