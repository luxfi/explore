import React from 'react';

import { useColorModeValue } from 'toolkit/chakra/color-mode';
import { Image } from '@luxfi/ui/image';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from '@luxfi/ui/skeleton';
import type { IconName } from 'ui/shared/IconSvg';
import IconSvg from 'ui/shared/IconSvg';

type Props = {
  icon?: IconName;
  iconSize?: string;
  iconUrl?: Array<string>;
  text: string;
  url: string;
  isLoading?: boolean;
};

const FooterLinkItemIconExternal = ({ iconUrl, text }: { iconUrl: Array<string>; text: string }) => {
  const [ lightIconUrl, darkIconUrl ] = iconUrl;

  const imageSrc = useColorModeValue(lightIconUrl, darkIconUrl || lightIconUrl);

  return (
    <Image
      src={ imageSrc }
      alt={ `${ text } icon` }
      boxSize={ 5 }
      objectFit="contain"
    />
  );
};

const FooterLinkItem = ({ icon, iconSize, iconUrl, text, url, isLoading }: Props) => {
  if (isLoading) {
    return <Skeleton loading className="my-[3px]">{ text }</Skeleton>;
  }

  const iconElement = (() => {
    if (iconUrl && Array.isArray(iconUrl)) {
      const [ lightIconUrl, darkIconUrl ] = iconUrl;

      if (typeof lightIconUrl === 'string' && (typeof darkIconUrl === 'string' || !darkIconUrl)) {
        return <FooterLinkItemIconExternal iconUrl={ iconUrl } text={ text }/>;
      }
    }

    if (icon) {
      return (
        <div className="flex items-center justify-center min-w-6">
          <IconSvg name={ icon } style={{ width: iconSize || '20px', height: iconSize || '20px' }}/>
        </div>
      );
    }

    return null;
  })();

  return (
    <Link href={ url } className="flex items-center h-[30px] text-xs gap-x-2" variant="subtle" external noIcon>
      { iconElement }
      { text }
    </Link>
  );
};

export default FooterLinkItem;
