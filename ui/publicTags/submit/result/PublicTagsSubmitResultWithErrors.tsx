import { pickBy } from 'es-toolkit';
import React from 'react';

import type { FormSubmitResultGrouped } from '../types';

import { route } from 'nextjs-routes';

import useIsMobile from 'lib/hooks/useIsMobile';
import { Button } from '@luxfi/ui/button';
import { Link } from 'toolkit/next/link';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import EntityTag from 'ui/shared/EntityTags/EntityTag';
interface Props {
  data: FormSubmitResultGrouped;
}

const PublicTagsSubmitResultWithErrors = ({ data }: Props) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col gap-y-3">
      { data.items.map((item, index) => {

        const startOverButtonQuery = pickBy({
          addresses: item.addresses,
          requesterName: data.requesterName,
          requesterEmail: data.requesterEmail,
          companyName: data.companyName,
          companyWebsite: data.companyWebsite,
        }, Boolean);

        return (
          <div key={ index } className="flex flex-col lg:flex-row">
            <div className="grow">
              <div
                className={ `grid grid-cols-1 lg:grid-cols-2 gap-y-3 rounded-base ${
                  item.error
                    ? 'bg-red-50 dark:bg-red-800'
                    : 'bg-green-50 dark:bg-green-800'
                }` }
              >
                <div className="px-4 lg:px-6 pt-2 lg:pt-4 pb-0 lg:pb-4 overflow-hidden">
                  <div className="text-sm text-[var(--color-text-secondary)] font-medium">Smart contract / Address (0x...)</div>
                  <div className="flex flex-col gap-y-2 mt-2">
                    { item.addresses.map((hash) => (
                      <AddressEntity
                        key={ hash }
                        address={{ hash }}
                        noIcon
                      />
                    )) }
                  </div>
                </div>
                <div className="px-4 lg:px-6 pb-2 lg:pb-4 pt-0 lg:pt-4">
                  <div className="text-sm text-[var(--color-text-secondary)] font-medium">Tag</div>
                  <div className="flex gap-2 mt-2 justify-start flex-wrap">
                    { item.tags.map((tag) => (
                      <EntityTag
                        key={ tag.name }
                        maxW={{ base: '100%', lg: '300px' }}
                        data={{ ...tag, slug: '', ordinal: 0 }}
                        noLink
                      />
                    )) }
                  </div>
                </div>
              </div>
              { item.error && <div className="text-red-500 mt-1 text-sm">{ item.error }</div> }
            </div>
            { item.error && (
              <Link
                href={ route({ pathname: '/public-tags/submit', query: startOverButtonQuery }) }
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0 mt-1 lg:mt-6 ml-0 lg:ml-6 w-min"
                >
                  Start  over
                </Button>
              </Link>
            ) }
            { !item.error && !isMobile && <div className="w-[95px] ml-6 shrink-0"/> }
          </div>
        );
      }) }
    </div>
  );
};

export default React.memo(PublicTagsSubmitResultWithErrors);
