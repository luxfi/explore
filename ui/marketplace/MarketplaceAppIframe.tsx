import { DappscoutIframeProvider, useDappscoutIframe } from 'dappscout-iframe';
import React, { useCallback, useEffect, useState, useMemo } from 'react';

import config from 'configs/app';
import essentialDappsChainsConfig from 'configs/essential-dapps-chains';
import useWeb3Wallet from 'lib/web3/useWallet';
import { ContentLoader } from 'toolkit/components/loaders/ContentLoader';

import useMarketplaceWallet from '../marketplace/useMarketplaceWallet';

const IFRAME_SANDBOX_ATTRIBUTE = 'allow-forms allow-orientation-lock ' +
'allow-pointer-lock allow-popups-to-escape-sandbox ' +
'allow-same-origin allow-scripts ' +
'allow-top-navigation-by-user-activation allow-popups';

const IFRAME_ALLOW_ATTRIBUTE = 'clipboard-read; clipboard-write;';

type ContentProps = {
  appUrl?: string;
  address?: string;
  message?: Record<string, unknown>;
  isEssentialDapp?: boolean;
  className?: string;
};

const Content = ({ appUrl, address, message, isEssentialDapp, className }: ContentProps) => {
  const { iframeRef, isReady } = useDappscoutIframe();
  const web3Wallet = useWeb3Wallet({ source: 'Essential dapps' });

  const [ iframeKey, setIframeKey ] = useState(0);
  const [ isFrameLoading, setIsFrameLoading ] = useState(true);
  const [ iframeHeight, setIframeHeight ] = useState(0);

  useEffect(() => {
    setIsFrameLoading(true);
    setIframeKey((key) => key + 1);
  }, [ address ]);

  const handleIframeLoad = useCallback(() => {
    setIsFrameLoading(false);
  }, []);

  useEffect(() => {
    if (!isFrameLoading && message && appUrl) {
      iframeRef?.current?.contentWindow?.postMessage(message, appUrl);
    }
  }, [ isFrameLoading, appUrl, iframeRef, message ]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        if (event.origin !== new URL(appUrl ?? '').origin || !isEssentialDapp) {
          return;
        }
        switch (event.data?.type) {
          case 'window-height':
            setIframeHeight(Number(event.data.height));
            break;
          case 'connect-wallet':
            web3Wallet.connect();
            break;
        }
      } catch {}
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [ appUrl, isEssentialDapp, web3Wallet ]);

  return (
    <div
      className={ `flex items-center justify-center grow min-w-full ${ className ?? '' }` }
      style={{ minHeight: isEssentialDapp ? `${ iframeHeight }px` : undefined }}
    >
      { (isFrameLoading) && (
        <ContentLoader/>
      ) }

      { isReady && (
        <iframe
          key={ iframeKey }
          allow={ IFRAME_ALLOW_ATTRIBUTE }
          ref={ iframeRef }
          sandbox={ IFRAME_SANDBOX_ATTRIBUTE }
          className={ `h-full w-full bg-transparent ${ isFrameLoading ? 'hidden' : 'block' }` }
          src={ appUrl }
          title="Marketplace dapp"
          onLoad={ handleIframeLoad }
          allowTransparency={ true }
        />
      ) }
    </div>
  );
};

type Props = {
  appId: string;
  appUrl?: string;
  message?: Record<string, unknown>;
  isEssentialDapp?: boolean;
  className?: string;
};

const MarketplaceAppIframe = ({
  appId, appUrl, message, isEssentialDapp, className,
}: Props) => {
  const {
    address,
    chainId: connectedChainId,
    sendTransaction,
    signMessage,
    signTypedData,
    switchChain,
  } = useMarketplaceWallet(appId, isEssentialDapp);

  const [ chainId, rpcUrl ] = useMemo(() => {
    let data: [ number?, string? ] = [ Number(config.chain.id), config.chain.rpcUrls[0] ];

    if (isEssentialDapp) {
      const chainConfig = essentialDappsChainsConfig()?.chains.find(
        (chain) => chain.id === String(connectedChainId),
      );
      if (chainConfig?.app_config?.chain?.rpcUrls[0]) {
        data = [ connectedChainId, chainConfig.app_config.chain.rpcUrls[0] ];
      }
    }

    return data;
  }, [ isEssentialDapp, connectedChainId ]);

  return (
    <DappscoutIframeProvider
      address={ address }
      appUrl={ appUrl }
      chainId={ chainId }
      rpcUrl={ rpcUrl }
      sendTransaction={ sendTransaction }
      signMessage={ signMessage }
      signTypedData={ signTypedData }
      switchChain={ switchChain }
    >
      <Content
        appUrl={ appUrl }
        address={ address }
        message={ message }
        isEssentialDapp={ isEssentialDapp }
        className={ className }
      />
    </DappscoutIframeProvider>
  );
};

export default MarketplaceAppIframe;
