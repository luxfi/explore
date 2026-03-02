import React from 'react';

import { Image } from '@luxfi/ui/image';

interface Props {
  src: string;
}

const BlobDataImage = ({ src }: Props) => {
  return (
    <div className="flex items-center justify-center w-full p-4 min-h-[200px] rounded-[md]"

    >
      <Image
        src={ src }
        objectFit="contain"
        maxW="100%"
        maxH="100%"
        objectPosition="center"
        alt="Blob image representation"
      />
    </div>
  );
};

export default React.memo(BlobDataImage);
