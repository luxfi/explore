import React from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';
import { Link } from 'toolkit/next/link';
import { Tooltip } from '@luxfi/ui/tooltip';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  className?: string;
  links?: Array<{ title: string; url: string }>;
}

const MarketplaceAppGraphLinks = ({ className, links }: Props) => {
  const isMobile = useIsMobile();

  const handleButtonClick = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  }, []);

  if (!links || links.length === 0) {
    return null;
  }

  const content = (
    <div className="flex flex-col gap-4 items-start text-sm w-[260px]">
      <span>{ `This dapp uses ${ links.length > 1 ? 'several subgraphs' : 'a subgraph' } powered by The Graph` }</span>
      { links.map(link => (
        <Link external key={ link.url } href={ link.url }>{ link.title }</Link>
      )) }
    </div>
  );

  return (
    <div className={ `relative inline-flex items-center ${ className ?? '' }`.trim() } onClick={ handleButtonClick }>
      <Tooltip
        variant="popover"
        content={ content }
        positioning={{ placement: 'bottom' }}
        interactive
      >
        <IconSvg name="brands/graph" className="w-5 h-5" onClick={ handleButtonClick }/>
      </Tooltip>
    </div>
  );
};

export default MarketplaceAppGraphLinks;
