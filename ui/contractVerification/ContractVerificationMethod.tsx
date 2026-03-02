import React from 'react';

import { Heading } from '@luxfi/ui/heading';

interface Props {
  title: string;
  children: React.ReactNode;
  disableScroll?: boolean;
}

const ContractVerificationMethod = ({ title, children, disableScroll }: Props) => {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    !disableScroll && ref.current?.scrollIntoView({ behavior: 'smooth' });
  }, [ disableScroll ]);

  return (
    <section ref={ ref }>
      <Heading level="2" className="mt-12 mb-5">{ title }</Heading>
      <div className="grid gap-x-[30px] gap-y-2 lg:gap-y-5 grid-cols-1 lg:grid-cols-[minmax(0,680px)_minmax(0,340px)]">
        { children }
      </div>
    </section>
  );
};

export default React.memo(ContractVerificationMethod);
