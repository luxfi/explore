import { cn } from 'lib/utils/cn';
import React from 'react';

import { formatName } from './utils';

interface Props {
  name: string;
  className?: string;
}

const MetadataAccordionItemTitle = ({ name, className }: Props) => {
  return (
    <div className={ cn('w-auto lg:w-[90px] shrink-0 font-semibold break-words', className) }>
      { formatName(name) }
    </div>
  );
};

export default React.memo(MetadataAccordionItemTitle);
