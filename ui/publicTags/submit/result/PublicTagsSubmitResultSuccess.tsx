import React from 'react';

import type { FormSubmitResultGrouped } from '../types';

import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import EntityTag from 'ui/shared/EntityTags/EntityTag';

interface Props {
  data: FormSubmitResultGrouped;
}

const PublicTagsSubmitResultSuccess = ({ data }: Props) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
      <div className="overflow-hidden">
        <div className="text-sm text-[var(--color-text-secondary)] font-medium">Smart contract / Address (0x...)</div>
        <div className="flex flex-col gap-y-2 mt-2">
          { data.items
            .map(({ addresses }) => addresses)
            .flat()
            .map((hash) => (
              <AddressEntity
                key={ hash }
                address={{ hash }}
                noIcon
              />
            )) }
        </div>
      </div>
      <div>
        <div className="text-sm text-[var(--color-text-secondary)] font-medium">Tag</div>
        <div className="flex gap-2 mt-2 justify-start flex-wrap">
          { data.items
            .map(({ tags }) => tags)
            .flat()
            .map((tag) => (
              <EntityTag
                key={ tag.name }
                maxW={{ base: '100%', lg: '300px' }}
                data={{
                  ...tag,
                  slug: '',
                  ordinal: 0,
                }}
                noLink
              />
            )) }
        </div>
      </div>
    </div>
  );
};

export default React.memo(PublicTagsSubmitResultSuccess);
