import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { CustomLinksGroup } from 'types/footerLinks';

import config from 'configs/app';
import { getCurrentChain } from 'configs/app/chainRegistry';
import type { ResourceError } from 'lib/api/resources';
import useApiQuery from 'lib/api/useApiQuery';
import useFetch from 'lib/hooks/useFetch';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { copy } from 'toolkit/utils/htmlEntities';
import { CONTENT_MAX_WIDTH } from 'ui/shared/layout/utils';
import NetworkAddToWallet from 'ui/shared/NetworkAddToWallet';

import FooterLinkItem from './FooterLinkItem';
import IntTxsIndexingStatus from './IntTxsIndexingStatus';
import getApiVersionUrl from './utils/getApiVersionUrl';

const MAX_LINKS_COLUMNS = 4;

const FRONT_VERSION_URL = `https://github.com/luxfi/explore/tree/${ config.UI.footer.frontendVersion }`;
const FRONT_COMMIT_URL = `https://github.com/luxfi/explore/commit/${ config.UI.footer.frontendCommit }`;

const Footer = () => {

  const { data: backendVersionData } = useApiQuery('general:config_backend_version', {
    queryOptions: {
      staleTime: Infinity,
      enabled: !config.features.multichain.isEnabled,
      refetchOnMount: false,
    },
  });
  const apiVersionUrl = getApiVersionUrl(backendVersionData?.backend_version);

  const currentChain = getCurrentChain();

  const branding = currentChain.branding;

  const FOOTER_LINKS = [
    {
      icon: 'social/git' as const,
      iconSize: '20px',
      text: 'Contribute',
      url: branding.githubUrl,
    },
    {
      icon: 'social/twitter' as const,
      iconSize: '24px',
      text: 'X (Twitter)',
      url: branding.twitterUrl,
    },
    {
      icon: 'social/discord' as const,
      iconSize: '24px',
      text: 'Discord',
      url: branding.discordUrl,
    },
    {
      icon: 'globe' as const,
      iconSize: '18px',
      text: branding.brandName,
      url: branding.websiteUrl,
    },
    {
      icon: 'docs' as const,
      iconSize: '20px',
      text: 'llms.txt',
      url: `${ config.app.baseUrl }/llms.txt`,
    },
  ].filter(Boolean);

  const frontendLink = (() => {
    if (config.UI.footer.frontendVersion) {
      return <Link href={ FRONT_VERSION_URL } external noIcon>{ config.UI.footer.frontendVersion }</Link>;
    }

    if (config.UI.footer.frontendCommit) {
      return <Link href={ FRONT_COMMIT_URL } external noIcon>{ config.UI.footer.frontendCommit }</Link>;
    }

    return null;
  })();

  const fetch = useFetch();

  const { isPlaceholderData, data: linksData } = useQuery<unknown, ResourceError<unknown>, Array<CustomLinksGroup>>({
    queryKey: [ 'footer-links' ],
    queryFn: async() => fetch(config.UI.footer.links || '', undefined, { resource: 'footer-links' }),
    enabled: Boolean(config.UI.footer.links),
    staleTime: Infinity,
    placeholderData: [],
  });

  const colNum = isPlaceholderData ? 1 : Math.min(linksData?.length || Infinity, MAX_LINKS_COLUMNS) + 1;

  const renderNetworkInfo = React.useCallback(() => {
    return (
      <div className="flex items-center flex-wrap justify-start gap-x-3 gap-y-2 mb-5 lg:mb-10 empty:hidden">
        { !config.UI.indexingAlert.intTxs.isHidden && <IntTxsIndexingStatus/> }
        { !config.features.multichain.isEnabled && <NetworkAddToWallet source="Footer"/> }
      </div>
    );
  }, []);

  const renderProjectInfo = React.useCallback(() => {
    return (
      <div>
        <Link href={ branding.websiteUrl } external noIcon className="inline-flex" style={{ color: 'inherit' }}>
          <span className="font-bold text-lg">{ branding.brandName }</span>
        </Link>
        <p className="mt-3 text-xs">
          { branding.description }
        </p>
        <div className="mt-6 text-xs">
          { apiVersionUrl && (
            <p>
              Backend: <Link href={ apiVersionUrl } external noIcon>{ backendVersionData?.backend_version }</Link>
            </p>
          ) }
          { frontendLink && (
            <p>
              Frontend: { frontendLink }
            </p>
          ) }
          <p>
            { copy } { (new Date()).getFullYear() } { branding.orgName }
          </p>
        </div>
      </div>
    );
  }, [ apiVersionUrl, backendVersionData?.backend_version, frontendLink, branding ]);

  const renderRecaptcha = () => {
    if (!config.services.reCaptchaV2.siteKey) {
      return <div/>;
    }

    return (
      <div className="text-xs mt-6">
        <span>This site is protected by reCAPTCHA and the Google </span>
        <Link href="https://policies.google.com/privacy" external noIcon>Privacy Policy</Link>
        <span> and </span>
        <Link href="https://policies.google.com/terms" external noIcon>Terms of Service</Link>
        <span> apply.</span>
      </div>
    );
  };

  const horizontalPadding = config.UI.navigation.layout === 'horizontal' ? 'lg:px-6' : 'lg:px-12';

  if (config.UI.footer.links) {
    return (
      <footer className="border-t border-[var(--color-border-divider)]">
        <div
          className={ `grid px-4 ${ horizontalPadding } 2xl:px-6 py-4 lg:py-8 mx-auto gap-x-8 lg:gap-x-[100px]` }
          style={{
            maxWidth: `${ CONTENT_MAX_WIDTH }px`,
            gridTemplateColumns: 'minmax(auto, 470px) 1fr',
          }}
        >
          <div>
            { renderNetworkInfo() }
            { renderProjectInfo() }
            { renderRecaptcha() }
          </div>

          <div
            className="grid gap-2 lg:gap-8 xl:gap-12 mt-8 lg:mt-0"
            style={{
              gridTemplateColumns: `repeat(${ colNum }, 160px)`,
              justifyContent: 'flex-end',
            }}
          >
            {
              ([
                { title: currentChain.branding.brandName, links: FOOTER_LINKS },
                ...(linksData || []),
              ])
                .slice(0, colNum)
                .map(linkGroup => (
                  <div key={ linkGroup.title }>
                    <Skeleton className="font-medium mb-3 inline-block" loading={ isPlaceholderData }>{ linkGroup.title }</Skeleton>
                    <div className="flex flex-col gap-1 items-start">
                      { linkGroup.links.map(link => <FooterLinkItem { ...link } key={ link.text } isLoading={ isPlaceholderData }/>) }
                    </div>
                  </div>
                ))
            }
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t border-[var(--color-border-divider)]">
      <div
        className={ `grid px-4 ${ horizontalPadding } 2xl:px-6 py-4 lg:py-8 mx-auto` }
        style={{
          maxWidth: `${ CONTENT_MAX_WIDTH }px`,
          gridTemplateColumns: 'minmax(auto, 470px) 1fr',
          columnGap: '100px',
        }}
      >
        { renderNetworkInfo() }
        { renderProjectInfo() }
        { renderRecaptcha() }

        <div
          className="grid gap-1 mt-8 lg:mt-0"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, 160px)',
            gridAutoFlow: 'column',
            alignContent: 'start',
            justifyContent: 'flex-end',
          }}
        >
          { FOOTER_LINKS.map(link => <FooterLinkItem { ...link } key={ link.text }/>) }
        </div>
      </div>
    </footer>
  );
};

export default React.memo(Footer);
