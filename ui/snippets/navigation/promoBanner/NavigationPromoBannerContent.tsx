import config from 'configs/app';
import { Image } from 'toolkit/chakra/image';

import useNavLinkStyleProps from '../useNavLinkStyleProps';

const promoBanner = config.UI.navigation.promoBanner;

type Props = {
  isCollapsed?: boolean;
  isHorizontalNavigation?: boolean;
};

const NavigationPromoBannerContent = ({ isCollapsed, isHorizontalNavigation }: Props) => {
  const isExpanded = isCollapsed === false;
  const navLinkStyleProps = useNavLinkStyleProps({ isCollapsed, isExpanded });

  if (!promoBanner) {
    return null;
  }

  return 'text' in promoBanner ? (
    <div
      { ...navLinkStyleProps.itemProps }
      className={ `flex flex-row gap-2 overflow-hidden whitespace-nowrap ${ isHorizontalNavigation ? 'py-1.5 px-1.5' : 'py-2' }` }
      style={{
        minWidth: isHorizontalNavigation ? 'auto' : '100%',
        maxWidth: isHorizontalNavigation ? 'auto' : '100%',
        width: isHorizontalNavigation ? 'auto' : '180px',
        padding: !isHorizontalNavigation ? undefined : undefined,
        backgroundColor: `var(--color-${ promoBanner.bg_color.light })`,
      }}
    >
      <Image
        src={ promoBanner.img_url }
        alt="Promo banner icon"
        boxSize={ isHorizontalNavigation ? '20px' : '30px' }
      />
      { !isHorizontalNavigation && (
        <span
          { ...navLinkStyleProps.textProps }
          className="font-medium overflow-hidden"
          style={{
            color: `var(--color-${ promoBanner.text_color.light })`,
          }}
        >
          { promoBanner.text }
        </span>
      ) }
    </div>
  ) : (
    <div
      className="relative"
      style={{ minHeight: isHorizontalNavigation ? 'auto' : '60px' }}
    >
      <Image
        src={ promoBanner.img_url.small }
        alt="Promo banner small"
        boxSize={ isHorizontalNavigation ? '32px' : '60px' }
        borderRadius={ isHorizontalNavigation ? 'sm' : 'base' }
        position={ isHorizontalNavigation ? undefined : 'absolute' }
        top={ isHorizontalNavigation ? undefined : 'calc(50% - 30px)' }
        left={ isHorizontalNavigation ? undefined : 'calc(50% - 30px)' }
        style={{
          opacity: isHorizontalNavigation ? 1 : undefined,
          transitionProperty: 'opacity',
          transitionDuration: '0.2s',
          transitionTimingFunction: 'ease',
        }}
        className={ !isHorizontalNavigation ? (
          isExpanded ? 'opacity-0' : (isCollapsed ? 'opacity-100' : 'lg:opacity-100 xl:opacity-0')
        ) : undefined }
      />
      <Image
        display={ isHorizontalNavigation ? 'none' : 'block' }
        src={ promoBanner.img_url.large }
        alt="Promo banner large"
        w="full"
        maxW="180px"
        borderRadius="base"
        style={{
          aspectRatio: '2 / 1',
          transitionProperty: 'opacity',
          transitionDuration: '0.2s',
          transitionTimingFunction: 'ease',
        }}
        className={
          isExpanded ? 'opacity-100' : (isCollapsed ? 'opacity-0' : 'lg:opacity-0 xl:opacity-100')
        }
      />
    </div>
  );
};

export default NavigationPromoBannerContent;
