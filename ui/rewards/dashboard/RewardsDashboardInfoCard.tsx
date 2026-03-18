import React from 'react';

import { Image } from '@luxfi/ui/image';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from '@luxfi/ui/skeleton';

import RewardsDashboardCard from './RewardsDashboardCard';

type Props = {
  title: string;
  description: string | React.ReactNode;
  imageSrc: string;
  imageWidth: string;
  imageHeight: string;
  linkText: string;
  linkHref: string;
};

const RewardsDashboardInfoCard = ({ title, description, imageSrc, imageWidth, imageHeight, linkText, linkHref }: Props) => (
  <RewardsDashboardCard
    title={ title }
    description={ description }
  >
    <div className="flex flex-1 gap-4 pl-10 pr-7 py-4 lg:py-0 flex-col lg:flex-row justify-between items-center">
      <Image
        src={ imageSrc }
        alt={ title }
        w={ imageWidth }
        h={ imageHeight }
        fallback={ <Skeleton loading/> }
      />
      <Link
        external
        href={ linkHref }
        className="text-base font-medium"
      >
        { linkText }
      </Link>
    </div>
  </RewardsDashboardCard>
);

export default RewardsDashboardInfoCard;
