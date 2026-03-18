import dynamic from 'next/dynamic';
import React from 'react';

import { Skeleton } from 'toolkit/chakra/skeleton';

const Identicon = dynamic<{ bg: string; string: string; size: number }>(
  async() => {
    const lib = await import('react-identicons');
    return typeof lib === 'object' && 'default' in lib ? lib.default : lib;
  },
  {
    loading: () => <Skeleton loading className="w-full h-full"/>,
    ssr: false,
  },
);

interface Props {
  className?: string;
  iconSize: number;
  seed: string;
}

const IdenticonGithub = ({ iconSize, seed }: Props) => {
  return (
    <div       boxSize={ `${ iconSize * 2 }px` } style={{ transformOrigin: 'left top' }} style={{ transform: 'scale(0.5)' }} className="rounded-full bg-[var(--color-gray-100)] dark:bg-[var(--color-white)]" className="overflow-hidden"
    >
      <Identicon
        bg="transparent"
        string={ seed }
        // the displayed size is doubled for retina displays and then scaled down
        size={ iconSize * 2 }
      />
    </div>
  );
};

export default React.memo(IdenticonGithub);
