import { useRouter } from 'next/router';
import QRCode from 'qrcode';
import React from 'react';

import getPageType from 'lib/mixpanel/getPageType';
import * as mixpanel from 'lib/mixpanel/index';
import { useRollbar } from 'lib/rollbar';
import { Alert } from '@luxfi/ui/alert';
import { DialogBody, DialogContent, DialogHeader, DialogRoot } from '@luxfi/ui/dialog';
import { IconButton } from '@luxfi/ui/icon-button';
import { Skeleton } from '@luxfi/ui/skeleton';
import { Tooltip } from '@luxfi/ui/tooltip';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import IconSvg from 'ui/shared/IconSvg';

const SVG_OPTIONS = {
  margin: 0,
};

interface Props {
  className?: string;
  hash: string;
  isLoading?: boolean;
}

const AddressQrCode = ({ hash, className, isLoading }: Props) => {
  const { open, onOpen, onOpenChange } = useDisclosure();

  const router = useRouter();
  const rollbar = useRollbar();

  const [ qr, setQr ] = React.useState('');
  const [ error, setError ] = React.useState('');

  const pageType = getPageType(router.pathname);

  React.useEffect(() => {
    if (open) {
      QRCode.toString(hash, SVG_OPTIONS, (error: Error | null | undefined, svg: string) => {
        if (error) {
          setError('We were unable to generate QR code.');
          rollbar?.warn('QR code generation failed');
          return;
        }

        setError('');
        setQr(svg);
        mixpanel.logEvent(mixpanel.EventTypes.QR_CODE, { 'Page type': pageType });
      });
    }
  }, [ hash, open, pageType, rollbar ]);

  if (isLoading) {
    return <Skeleton loading={ true } className={ className } w="36px" h="32px" borderRadius="base"/>;
  }

  return (
    <>
      <Tooltip content="Click to view QR code" disableOnMobile>
        <IconButton
          className={ className }
          aria-label="Show QR code"
          variant="icon_background"
          size="md"
          onClick={ onOpen }
        >
          <IconSvg name="qr_code"/>
        </IconButton>
      </Tooltip>

      { error && (
        <DialogRoot open={ open } onOpenChange={ onOpenChange } size={{ lgDown: 'full', lg: 'sm' }}>
          <DialogContent>
            <DialogBody>
              <Alert status="warning">{ error }</Alert>
            </DialogBody>
          </DialogContent>
        </DialogRoot>
      ) }
      { !error && (
        <DialogRoot open={ open } onOpenChange={ onOpenChange } size={{ lgDown: 'full', lg: 'sm' }}>
          <DialogContent className="light">
            <DialogHeader>Address QR code</DialogHeader>
            <DialogBody>
              <AddressEntity
                className="mb-3 font-medium"
                address={{ hash }}
                noLink
              />
              <div className="p-4" dangerouslySetInnerHTML={{ __html: qr }}/>
            </DialogBody>
          </DialogContent>
        </DialogRoot>
      ) }
    </>
  );
};

export default React.memo(AddressQrCode);
