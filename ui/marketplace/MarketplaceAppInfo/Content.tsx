import React from 'react';

import type { MarketplaceApp } from 'types/client/marketplace';

import SocialLink from './SocialLink';
import type { Props as SocialLinkProps } from './SocialLink';
import WebsiteLink from './WebsiteLink';

interface Props {
  data: MarketplaceApp | undefined;
}

const SOCIAL_LINKS: Array<Omit<SocialLinkProps, 'href'>> = [
  { field: 'github', icon: 'social/github_filled', title: 'Github' },
  { field: 'twitter', icon: 'social/twitter_filled', title: 'X (ex-Twitter)' },
  { field: 'telegram', icon: 'social/telegram_filled', title: 'Telegram' },
  { field: 'discord', icon: 'social/discord_filled', title: 'Discord' },
];

const Content = ({ data }: Props) => {
  const socialLinks: Array<SocialLinkProps> = [];
  SOCIAL_LINKS.forEach((link) => {
    const href = data?.[link.field];
    if (href) {
      if (Array.isArray(href)) {
        href.forEach((href) => socialLinks.push({ ...link, href }));
      } else {
        socialLinks.push({ ...link, href });
      }
    }
  });

  return (
    <div className="flex flex-col gap-y-5 text-sm">
      <div>
        <span className="text-[var(--color-text-secondary)] text-xs">Project info</span>
        <span className="text-sm mt-3 block">{ data?.shortDescription }</span>
        <WebsiteLink url={ data?.site }/>
      </div>
      { socialLinks.length > 0 && (
        <div>
          <span className="text-[var(--color-text-secondary)] text-xs">Links</span>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3 mt-3">
            { socialLinks.map((link, index) => <SocialLink key={ index } { ...link }/>) }
          </div>
        </div>
      ) }
    </div>
  );
};

export default Content;
