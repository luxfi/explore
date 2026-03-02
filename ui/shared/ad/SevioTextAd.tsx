import Script from 'next/script';
import React, { useCallback, useEffect, useRef } from 'react';

import config from 'configs/app';
import { cn } from 'lib/utils/cn';
import { Skeleton } from '@luxfi/ui/skeleton';

const adTextFeature = config.features.adsText;

const AD_LOAD_TIMEOUT = 1_000;

type Status = 'loading' | 'loaded' | 'empty';

const SevioTextAd = ({ className }: { className?: string }) => {
  const [ status, setStatus ] = React.useState<Status>('loading');
  const adRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (!adTextFeature.isEnabled) {
      return;
    }
    const { zone, adType, inventoryId, accountId } = adTextFeature.sevio;
    window.sevioads = window.sevioads || [];
    window.sevioads.push([ { zone, adType, inventoryId, accountId } ]);
  }, []);

  useEffect(() => {
    const node = adRef.current;
    if (!node) {
      return;
    }

    const observer = new MutationObserver(() => {
      if (node.childNodes.length > 0) {
        clearTimeout(timeoutRef.current);
        setStatus('loaded');
        observer.disconnect();
      }
    });

    observer.observe(node, { childList: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleScriptLoad = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setStatus((prev) => prev === 'loading' ? 'empty' : prev);
    }, AD_LOAD_TIMEOUT);
  }, []);

  const handleScriptError = useCallback(() => {
    setStatus('empty');
  }, []);

  if (!adTextFeature.isEnabled || status === 'empty') {
    return null;
  }

  const { zone } = adTextFeature.sevio;

  return (
    <>
      { status === 'loading' && (
        <Skeleton
          loading
          className={ cn(className, 'h-12 lg:h-6') }
          w="100%"
          flexGrow={ 1 }
          maxW="800px"
          display="block"
        />
      ) }
      <div
        className={ cn(
          status === 'loaded' ? className : undefined,
          status === 'loaded' ? 'text-xs lg:text-base' : 'hidden',
          'text-[var(--color-text-secondary)] lg:text-[var(--color-text-primary)]',
        ) }
        style={ status !== 'loaded' ? { display: 'none' } : undefined }
      >
        <style>{ `
          .sevioads * { font-family: inherit; font-size: inherit; }
          .sevioads strong { color: inherit; }
          .sevioads a { color: var(--color-link-primary); }
          .sevioads a:hover { color: var(--color-link-primary-hover); }
        ` }</style>
        <Script
          strategy="lazyOnload"
          src="https://cdn.adx.ws/scripts/loader.js"
          onLoad={ handleScriptLoad }
          onError={ handleScriptError }
        />
        <div ref={ adRef } className="sevioads" data-zone={ zone }/>
      </div>
    </>
  );
};

export default SevioTextAd;
