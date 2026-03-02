import React from 'react';

import type { GetInstancesResponse } from '@luxfi/points-types';

import { DialogBody, DialogContent, DialogRoot, DialogHeader } from '@luxfi/ui/dialog';
import { Image } from '@luxfi/ui/image';
import { Link } from 'toolkit/next/link';
import IconSvg from 'ui/shared/IconSvg';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  items: GetInstancesResponse['items'] | undefined;
};

const RewardsInstancesModal = ({ isOpen, onClose, items }: Props) => {
  const handleOpenChange = React.useCallback(({ open }: { open: boolean }) => {
    if (!open) {
      onClose();
    }
  }, [ onClose ]);

  return (
    <DialogRoot
      open={ isOpen }
      onOpenChange={ handleOpenChange }
      size={{ lgDown: 'full', lg: 'sm' }}
    >
      <DialogContent>
        <DialogHeader>
          Choose explorer
        </DialogHeader>
        <DialogBody>
          <div className="flex flex-col gap-6">
            <p>
              Choose explorer that you want to interact with and earn
              Merits
            </p>
            <div className="flex flex-wrap gap-2">
              { items?.map((instance) => (
                <Link
                  external
                  noIcon
                  key={ instance.chain_id }
                  href={ instance.domain }
                  className="flex gap-2 items-center p-2 rounded-base bg-[var(--color-blackAlpha-50)] dark:bg-[var(--color-whiteAlpha-100)]"
                >
                  <Image
                    src={ instance.details?.icon_url }
                    alt={ instance.name }
                    boxSize={ 5 }
                    flexShrink={ 0 }
                    fallback={ (
                      <IconSvg
                        name="networks/icon-placeholder"
                        color="icon.primary"
                      />
                    ) }
                  />
                  <span className="text-sm font-medium text-[var(--color-text-primary)] group-hover:text-inherit">
                    { instance.name }
                  </span>
                </Link>
              )) }
            </div>
          </div>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

export default RewardsInstancesModal;
