import React from 'react';

import { Heading } from '@luxfi/ui/heading';

interface Props {
  title: string;
}

// gui's H1 emits its own atomic margin reset (`_marginTop-0px`), so a plain
// `mt-8` here rendered as zero and the heading sat flush against the status
// glyph above it. The modifier is what outranks the reset.
const AppErrorTitle = ({ title }: Props) => {
  return <Heading className="!mt-8" level="1">{ title }</Heading>;
};

export default AppErrorTitle;
