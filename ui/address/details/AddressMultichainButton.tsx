import { upperFirst } from 'es-toolkit';
import React from 'react';

import { cn } from 'lib/utils/cn';

import type { MultichainProviderConfigParsed } from 'types/client/multichainProviderConfig';

import { route } from 'nextjs-routes';

import { Image } from '@luxfi/ui/image';
import { Link } from 'toolkit/chakra/link';
import { Tooltip } from '@luxfi/ui/tooltip';
import TextSeparator from 'ui/shared/TextSeparator';

import styles from './AddressMultichainButton.module.css';

const TEMPLATE_ADDRESS = '{address}';

type Props = {
  item: MultichainProviderConfigParsed;
  addressHash: string;
  onClick?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
};

const AddressMultichainButton = ({ item, addressHash, onClick, isFirst, isLast }: Props) => {

  const isOnlyOne = isFirst && isLast;

  const buttonIcon = (
    <Image
      src={ item.logoUrl }
      alt={ item.name }
      boxSize={ 5 }
      mr={ isOnlyOne ? 1 : 0 }
      className={ cn(isOnlyOne && 'lg:mr-2', 'rounded overflow-hidden') }
      borderRadius="4px"
    />
  );

  const name = upperFirst(item.name.replaceAll('_', ' '));

  const buttonContent = isOnlyOne ? (
    <>
      { buttonIcon }
      { name }
    </>
  ) : (
    <Tooltip content={ name }>{ buttonIcon }</Tooltip>
  );

  try {
    const portfolioUrlString = item.urlTemplate.replace(TEMPLATE_ADDRESS, addressHash);
    const portfolioUrl = new URL(portfolioUrlString);
    portfolioUrl.searchParams.append('utm_source', 'lux-explorer');
    portfolioUrl.searchParams.append('utm_medium', 'address');
    const dappId = item.dappId;
    const isExternal = typeof dappId !== 'string';

    return (
      <>
        <Link
          className={ cn(item.promo ? styles.promo : undefined, 'text-sm font-medium') }
          external={ isExternal }
          href={ isExternal ? portfolioUrl.toString() : route({ pathname: '/apps/[id]', query: { id: dappId, url: portfolioUrl.toString() } }) }
          variant={ isOnlyOne ? 'underlaid' : undefined }
          onClick={ onClick }
          noIcon={ !isOnlyOne }
        >
          { buttonContent }
        </Link>
        { item.promo && isFirst && !isLast && <TextSeparator className="mx-0"/> }
      </>
    );
  } catch (error) {}

  return null;
};

export default AddressMultichainButton;
