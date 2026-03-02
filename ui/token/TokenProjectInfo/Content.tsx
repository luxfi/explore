import React from 'react';

import type { TokenVerifiedInfo } from 'types/api/token';

import DocsLink from './DocsLink';
import type { Props as ServiceLinkProps } from './ServiceLink';
import ServiceLink from './ServiceLink';
import SupportLink from './SupportLink';

interface Props {
  data: TokenVerifiedInfo;
}

const SOCIAL_LINKS: Array<Omit<ServiceLinkProps, 'href'>> = [
  { field: 'github', icon: 'social/github_filled', title: 'Github' },
  { field: 'twitter', icon: 'social/twitter_filled', title: 'X (ex-Twitter)' },
  { field: 'telegram', icon: 'social/telegram_filled', title: 'Telegram' },
  { field: 'openSea', icon: 'social/opensea_filled', title: 'OpenSea' },
  { field: 'linkedin', icon: 'social/linkedin_filled', title: 'LinkedIn' },
  { field: 'facebook', icon: 'social/facebook_filled', title: 'Facebook' },
  { field: 'discord', icon: 'social/discord_filled', title: 'Discord' },
  { field: 'medium', icon: 'social/medium_filled', title: 'Medium' },
  { field: 'slack', icon: 'social/slack_filled', title: 'Slack' },
  { field: 'reddit', icon: 'social/reddit_filled', title: 'Reddit' },
];

const PRICE_TICKERS: Array<Omit<ServiceLinkProps, 'href'>> = [
  { field: 'coinGeckoTicker', icon: 'social/coingecko', title: 'CoinGecko' },
  { field: 'coinMarketCapTicker', icon: 'social/coinmarketcap', title: 'CoinMarketCap' },
  { field: 'defiLlamaTicker', icon: 'social/defi_llama', title: 'DefiLlama' },
];

export function hasContent(data: TokenVerifiedInfo): boolean {
  const fields: Array<keyof TokenVerifiedInfo> = [
    'projectDescription',
    'docs',
    'support',
    ...SOCIAL_LINKS.map(({ field }) => field),
    ...PRICE_TICKERS.map(({ field }) => field),
  ];
  return fields.some((field) => data[field]);
}

const Content = ({ data }: Props) => {
  const docs = data.docs ? <DocsLink href={ data.docs }/> : null;
  const support = data.support ? <SupportLink url={ data.support }/> : null;
  const description = data.projectDescription ? <span>{ data.projectDescription }</span> : null;

  const socialLinks = SOCIAL_LINKS
    .map((link) => ({ ...link, href: data[link.field] }))
    .filter(({ href }) => href);

  const priceTickersLinks = PRICE_TICKERS
    .map((link) => ({ ...link, href: data[link.field] }))
    .filter(({ href }) => href);

  return (
    <div>
      { (description || docs || support) && (
        <div>
          <span className="text-[var(--color-text-secondary)]">Description and support info</span>
          { description }
          { (docs || support) && (
            <div>
              { support }
              { docs }
            </div>
          ) }
        </div>
      ) }
      { socialLinks.length > 0 && (
        <div>
          <span className="text-[var(--color-text-secondary)]">Links</span>
          <div>
            { socialLinks.map((link) => <ServiceLink key={ link.field } { ...link }/>) }
          </div>
        </div>
      ) }
      { priceTickersLinks.length > 0 && (
        <div>
          <span className="text-[var(--color-text-secondary)]">Crypto markets</span>
          <div>
            { priceTickersLinks.map((link) => <ServiceLink key={ link.field } { ...link }/>) }
          </div>
        </div>
      ) }
    </div>
  );
};

export default Content;
