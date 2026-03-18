import React from 'react';

import { cn } from 'lib/utils/cn';
import IconSvg from 'ui/shared/IconSvg';

export const LIGHTNING_LABEL_CLASS_NAME = 'lightning-label';

const XL_BREAKPOINT = 1280;

interface Props {
  className?: string;
  iconColor?: string;
  isCollapsed?: boolean;
}

const LightningLabel = ({ className, iconColor, isCollapsed }: Props) => {
  const [ isLgScreen, setIsLgScreen ] = React.useState(false);

  React.useEffect(() => {
    const mql = window.matchMedia(`(min-width: 1024px) and (max-width: ${ XL_BREAKPOINT - 1 }px)`);
    const handler = (e: MediaQueryListEvent) => setIsLgScreen(e.matches);
    setIsLgScreen(mql.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  const isExpanded = isCollapsed === false;

  const color = React.useMemo(() => {
    if (isCollapsed || (!isExpanded && isLgScreen)) {
      return (iconColor && iconColor !== 'transparent') ? iconColor : 'bg.primary';
    }
    return 'transparent';
  }, [ iconColor, isCollapsed, isExpanded, isLgScreen ]);

  return (
    <IconSvg
      className={ cn(
        LIGHTNING_LABEL_CLASS_NAME,
        'w-4 h-4 transition-[color,margin-left] duration-200 ease-in-out',
        isExpanded ? 'ml-1 lg:ml-1 xl:ml-1' : 'ml-1 lg:ml-0 xl:ml-1',
        isCollapsed ? 'lg:absolute xl:absolute lg:top-[10px] xl:top-[10px] lg:right-[15px] xl:right-[15px]' :
          isExpanded ? 'lg:relative xl:relative lg:top-0 xl:top-0 lg:right-0 xl:right-0' :
            'lg:absolute xl:relative lg:top-[10px] xl:top-0 lg:right-[15px] xl:right-0',
        className,
      ) }
      name="lightning_navbar"
      style={{ color: color === 'transparent' ? 'transparent' : `var(--color-${ color.replace('.', '-') })` }}
    />
  );
};

export default LightningLabel;
