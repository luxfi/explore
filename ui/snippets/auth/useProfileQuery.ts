import { useQuery } from '@tanstack/react-query';

import type { UserInfo } from 'types/api/account';

import * as cookies from 'lib/cookies';
import { getOidc, fetchUserInfo } from 'lib/oidc';

// The signed-in user comes from IAM's userinfo endpoint and nowhere else. The
// explorer's own `general:user_info` half of this hook is gone with the account
// backend it queried — that route 404s on this deployment.
export default function useProfileQuery() {
  const oidc = getOidc();
  const token = cookies.get(cookies.NAMES.API_TOKEN);

  return useQuery<UserInfo>({
    queryKey: [ 'oidc_profile', oidc?.serverUrl ],
    queryFn: async() => {
      const data = await fetchUserInfo(token as string);
      return {
        name: data.name || data.displayName || undefined,
        nickname: data.preferred_username || undefined,
        email: data.email || null,
        address_hash: null,
        avatar: data.picture || data.avatar || undefined,
      };
    },
    refetchOnMount: false,
    enabled: Boolean(oidc && token),
  });
}
