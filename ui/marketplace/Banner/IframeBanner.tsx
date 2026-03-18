import React, { useCallback, useState } from 'react';

import * as mixpanel from 'lib/mixpanel/index';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';

const IframeBanner = ({ contentUrl, linkUrl }: { contentUrl: string; linkUrl: string }) => {
  const [ isFrameLoading, setIsFrameLoading ] = useState(true);

  const handleIframeLoad = useCallback(() => {
    setIsFrameLoading(false);
  }, []);

  const handleClick = useCallback(() => {
    mixpanel.logEvent(mixpanel.EventTypes.PROMO_BANNER, { Source: 'Marketplace', Link: linkUrl });
  }, [ linkUrl ]);

  return (
    <Skeleton
      loading={ isFrameLoading }
      className="relative overflow-hidden rounded-md"
      h="100px"
      w="100%"
    >
      <Link
        href={ linkUrl }
        external
        noIcon
        onClick={ handleClick }
        className="absolute w-full h-full top-0 left-0 z-[1]"
      />
      <iframe
        className="h-full w-full"
        src={ contentUrl }
        title="Marketplace banner"
        onLoad={ handleIframeLoad }
      />
    </Skeleton>
  );
};

export default IframeBanner;
