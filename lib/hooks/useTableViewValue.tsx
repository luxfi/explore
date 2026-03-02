import React from 'react';

import * as cookies from 'lib/cookies';
import * as mixpanel from 'lib/mixpanel';

/**
 * Mobile transaction list view toggle.
 * Default: table view. User preference persists in a cookie.
 */
export default function useTableViewValue() {
  const cookieValue = cookies.get(cookies.NAMES.TABLE_VIEW_ON_MOBILE);
  const [ value, setValue ] = React.useState<boolean>(
    cookieValue ? cookieValue === 'true' : true,
  );

  const onToggle = React.useCallback(() => {
    setValue((prev) => {
      const next = !prev;
      cookies.set(cookies.NAMES.TABLE_VIEW_ON_MOBILE, next ? 'true' : 'false');
      mixpanel.logEvent(mixpanel.EventTypes.PAGE_WIDGET, {
        Type: 'Txn view switch',
        Info: next ? 'Table view' : 'List view',
        Source: 'Address page',
      });
      return next;
    });
  }, []);

  return React.useMemo(() => ({ value, isLoading: false, onToggle }), [ value, onToggle ]);
}
