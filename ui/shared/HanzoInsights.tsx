import { AnalyticsProvider, usePageview } from '@hanzo/event/react';
import { useRouter } from 'next/router';
import React from 'react';

import config from 'configs/app';

const feature = config.features.hanzoInsights;

// The provider records the first pageview when it mounts. A client-side route
// change never remounts it, so this records every pageview after the first.
const RouteTrackerContent = () => {
  const router = useRouter();

  usePageview(router.asPath);

  return null;
};

const RouteTracker = React.memo(RouteTrackerContent);

const HanzoInsights = () => {
  if (!feature.isEnabled) {
    return null;
  }

  return (
    // Errors stay with Rollbar, which this app already runs — one reporter, not two.
    <AnalyticsProvider config={{ product: 'explore', ingestKey: feature.ingestKey, captureErrors: false }}>
      <RouteTracker/>
    </AnalyticsProvider>
  );
};

export default React.memo(HanzoInsights);
