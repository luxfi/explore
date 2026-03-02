import React from 'react';

import type { EntityTag } from './types';

import * as mixpanel from 'lib/mixpanel/index';
import { Image } from '@luxfi/ui/image';
import { Link } from 'toolkit/next/link';
import { Tooltip } from '@luxfi/ui/tooltip';
import { makePrettyLink } from 'toolkit/utils/url';
import { Separator } from '@luxfi/ui/separator';

interface Props {
  data: EntityTag;
  children: React.ReactNode;
}

const EntityTagTooltip = ({ data, children }: Props) => {
  const hasPopover = Boolean(
    data.meta?.tooltipIcon ||
    data.meta?.tooltipTitle ||
    data.meta?.tooltipDescription ||
    data.meta?.tooltipUrl ||
    data.meta?.tooltipAttribution,
  );

  const link = makePrettyLink(data.meta?.tooltipUrl);

  const attribution = React.useMemo(() => {
    if (!data.meta?.tooltipAttribution) {
      return;
    }
    const link = makePrettyLink(data.meta?.tooltipAttribution);
    return link ?? data.meta.tooltipAttribution;
  }, [ data.meta?.tooltipAttribution ]);

  const handleLinkClick = React.useCallback(() => {
    if (!data.meta?.tooltipUrl) {
      return;
    }

    mixpanel.logEvent(mixpanel.EventTypes.PAGE_WIDGET, {
      Type: 'Address tag',
      Info: data.slug,
      URL: data.meta.tooltipUrl,
    });
  }, [ data.meta?.tooltipUrl, data.slug ]);

  if (!hasPopover) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{ children }</>;
  }

  const content = (
    <div className="dark">
      <div className="flex flex-col text-left gap-y-2 text-sm empty:hidden">
        { (data.meta?.tooltipIcon || data.meta?.tooltipTitle) && (
          <div className="flex items-center gap-x-3">
            { data.meta?.tooltipIcon && <Image src={ data.meta.tooltipIcon } boxSize="30px" alt={ `${ data.name } tag logo` }/> }
            { data.meta?.tooltipTitle && <span className="font-semibold">{ data.meta.tooltipTitle }</span> }
          </div>
        ) }
        { data.meta?.tooltipDescription && <span>{ data.meta.tooltipDescription }</span> }
        { link && <Link external href={ link.href } onClick={ handleLinkClick }>{ link.domain }</Link> }
      </div>
      { attribution ? (
        <>
          { (data.meta?.tooltipIcon || data.meta?.tooltipTitle || data.meta?.tooltipDescription || link) && <Separator className="mt-2 mb-1"/> }
          <div className="flex items-center text-xs text-[var(--color-text-secondary)]">
            <span className="mr-2">Source:</span>
            { data.meta?.tooltipAttributionIcon && <Image src={ data.meta.tooltipAttributionIcon } boxSize={ 4 } mr={ 1 } zIndex={ 1 }/> }
            { typeof attribution === 'string' ?
              <span className="font-medium">{ attribution }</span> :
              <Link external href={ attribution.href }>{ attribution.domain }</Link> }
          </div>
        </>
      ) : null }
    </div>
  );

  return (
    <Tooltip content={ content } interactive>
      { children }
    </Tooltip>
  );
};

export default React.memo(EntityTagTooltip);
