
import type { EssentialDappsConfig } from 'types/client/marketplace';

import config from 'configs/app';

import EssentialDappCard from './EssentialDappCard';

const feature = config.features.marketplace;
const essentialDappsConfig = feature.isEnabled ? feature.essentialDapps : undefined;

const essentialDapps = [
  {
    id: 'swap',
    title: 'Swap',
    description: 'Swap, trade and bridge tokens between chains',
    buttonText: 'Swap tokens',
    imageUrl: '/static/marketplace/swap.png',
    darkImageUrl: '/static/marketplace/swap-dark.png',
  },
  {
    id: 'revoke',
    title: 'Revoke',
    description: 'View and remove token approvals',
    buttonText: 'Get started',
    imageUrl: '/static/marketplace/revoke.png',
    darkImageUrl: '/static/marketplace/revoke-dark.png',
  },
  {
    id: 'multisend',
    title: 'Multisend',
    description: 'Send tokens to multiple addresses at once',
    buttonText: 'Send tokens',
    imageUrl: '/static/marketplace/multisend.png',
    darkImageUrl: '/static/marketplace/multisend-dark.png',
  },
].filter((dapp) =>
  feature.isEnabled && Boolean(essentialDappsConfig?.[dapp.id as keyof EssentialDappsConfig]),
);

const EssentialDappsList = () => {
  return (
    <div className="flex gap-2 md:gap-3 mb-8 w-full overflow-x-auto md:overflow-x-visible scrollbar-none">
      { essentialDapps.map((dapp) => (
        <EssentialDappCard
          key={ dapp.id }
          id={ dapp.id }
          title={ dapp.title }
          description={ dapp.description }
          buttonText={ dapp.buttonText }
          imageUrl={ dapp.imageUrl }
          darkImageUrl={ dapp.darkImageUrl }
        />
      )) }
    </div>
  );
};

export default EssentialDappsList;
