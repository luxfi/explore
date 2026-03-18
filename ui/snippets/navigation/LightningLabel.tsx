import React from 'react';

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
      className={ LIGHTNING_LABEL_CLASS_NAME + (className ? ` ${ className }` : '') }
      name="lightning_navbar"
      boxSize={ 4 }
      ml={{ base: 1, lg: isExpanded ? 1 : 0, xl: isCollapsed ? 0 : 1 }}
      position={{ lg: isExpanded ? 'relative' : 'absolute', xl: isCollapsed ? 'absolute' : 'relative' }}
      top={{ lg: isExpanded ? '0' : '10px', xl: isCollapsed ? '10px' : '0' }}
      right={{ lg: isExpanded ? '0' : '15px', xl: isCollapsed ? '15px' : '0' }}
      color={ color }
      transitionProperty="color, margin-left"
      transitionDuration="normal"
      transitionTimingFunction="ease"
    />
  );
};

export default LightningLabel;
