import { useQuery } from '@tanstack/react-query';

import type { UserInfo } from 'types/api/account';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import * as cookies from 'lib/cookies';

interface OidcUserInfo {
  readonly sub?: string;
  readonly name?: string;
  readonly preferred_username?: string;
  readonly displayName?: string;
  readonly email?: string;
  readonly picture?: string;
  readonly avatar?: string;
}

function useOidcProfileQuery() {
  const feature = config.features.account;
  const serverUrl = feature.isEnabled && feature.authProvider === 'oidc' && feature.oidc ? feature.oidc.serverUrl : '';
  const token = cookies.get(cookies.NAMES.API_TOKEN);

  return useQuery<UserInfo>({
    queryKey: [ 'oidc_profile', serverUrl ],
    queryFn: async() => {
      const response = await fetch(`${ serverUrl }/api/userinfo`, {
        headers: { Authorization: `Bearer ${ token }` },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      const data = await response.json() as OidcUserInfo;
      return {
        name: data.name || data.displayName || undefined,
        nickname: data.preferred_username || undefined,
        email: data.email || null,
        address_hash: null,
        avatar: data.picture || data.avatar || undefined,
      };
    },
    refetchOnMount: false,
    enabled: Boolean(serverUrl && token),
  });
}

export default function useProfileQuery() {
  const feature = config.features.account;
  const isOidc = feature.isEnabled && feature.authProvider === 'oidc';

  const oidcQuery = useOidcProfileQuery();
  const blockscoutQuery = useApiQuery('general:user_info', {
    queryOptions: {
      refetchOnMount: false,
      enabled: !isOidc && feature.isEnabled && Boolean(cookies.get(cookies.NAMES.API_TOKEN)),
    },
  });

  return isOidc ? oidcQuery : blockscoutQuery;
}
