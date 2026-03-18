import React from 'react';

import config from 'configs/app';
import { LinkOverlay } from 'toolkit/chakra/link';

import type { MediaElementProps } from './utils';

interface Props extends MediaElementProps<'a'> {}

const NftHtml = ({ src, transport, onLoad, onError, onClick, ...rest }: Props) => {
  const ref = React.useRef<HTMLIFrameElement>(null);

  const [ isLoaded, setIsLoaded ] = React.useState(false);

  const handleLoad = React.useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [ onLoad ]);

  const loadViaHttp = React.useCallback(async() => {
    if (!ref.current) {
      return;
    }

    ref.current.src = src;
    ref.current.onload = handleLoad;
    onError && (ref.current.onerror = onError);
  }, [ src, handleLoad, onError ]);

  React.useEffect(() => {
    // Disable iframe in private mode to prevent tracking
    if (config.app.isPrivateMode) {
      onError?.();
      return;
    }

    switch (transport) {
      case 'ipfs': {
        // Currently we don't support IPFS video loading
        onError?.();
        break;
      }
      case 'http':
        loadViaHttp();
        break;
    }
  }, [ loadViaHttp, onError, transport ]);

  // Disable iframe in private mode to prevent tracking
  if (config.app.isPrivateMode) {
    return null;
  }

  return (
    <LinkOverlay
      onClick={ onClick }
      className="h-full"
    >
      <iframe
        ref={ ref }
        className="h-full w-full"
        sandbox="allow-scripts"
        style={{ opacity: isLoaded ? 1 : 0 }}
      />
    </LinkOverlay>
  );
};

export default NftHtml;
