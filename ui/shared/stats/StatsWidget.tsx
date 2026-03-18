import React from 'react';

import type { Route } from 'nextjs-routes';
import { route } from 'nextjs-routes';

import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Hint } from 'toolkit/components/Hint/Hint';
import { TruncatedText } from 'toolkit/components/truncation/TruncatedText';
import IconSvg, { type IconName } from 'ui/shared/IconSvg';

export type Props = {
  className?: string;
  label: string;
  value: string | React.ReactNode;
  valuePrefix?: string;
  valuePostfix?: string;
  hint?: string | React.ReactNode;
  isLoading?: boolean;
  diff?: string | number;
  diffFormatted?: string;
  diffPeriod?: '24h';
  period?: '1h' | '24h' | '30min';
  href?: Route;
  icon?: IconName;
  isFallback?: boolean;
};

const Container = ({ href, children, className }: { href?: Route; children: React.JSX.Element; className?: string }) => {
  if (href) {
    return (
      <Link href={ route(href) } variant="plain" className={ className }>
        { children }
      </Link>
    );
  }

  return children;
};

const StatsWidget = ({
  className,
  icon,
  label,
  value,
  valuePrefix,
  valuePostfix,
  isLoading,
  hint,
  diff,
  diffPeriod = '24h',
  diffFormatted,
  period,
  href,
  isFallback,
}: Props) => {
  return (
    <Container href={ !isLoading ? href : undefined } className={ href ? className : undefined }>
      <div
        className={ `flex items-center p-3 rounded-base justify-between gap-x-2 w-full h-full ${
          isLoading
            ? 'bg-[var(--color-blackAlpha-50)] dark:bg-[var(--color-whiteAlpha-50)]'
            : 'bg-[var(--color-theme-stats-bg-light)] dark:bg-[var(--color-theme-stats-bg-dark)]'
        } ${ href ? '' : className ?? '' }` }
      >
        { icon && (
          <IconSvg
            name={ icon }
            className={ `hidden lg:block shrink-0 p-2 rounded-base ${ isFallback && !isLoading ? 'opacity-[var(--opacity-control-disabled)]' : '' }` }
            style={{ width: '40px', height: '40px' }}
            isLoading={ isLoading }
          />
        ) }
        <div
          className="w-full"
          style={{
            width: `calc(100% - ${ icon ? '48px' : '0px' } - ${ hint ? '24px' : '0px' })`,
          }}
        >
          <Skeleton
            loading={ isLoading }
            color="text.secondary"
            textStyle="xs"
            className="w-fit"
          >
            <h2>{ label }</h2>
          </Skeleton>
          <Skeleton
            loading={ isLoading }
            display="flex"
            alignItems="baseline"
            fontWeight={ 500 }
            textStyle="heading.md"
            className={ isFallback && !isLoading ? 'opacity-[var(--opacity-control-disabled)]' : '' }
          >
            { valuePrefix && <span className="whitespace-pre">{ valuePrefix }</span> }
            { typeof value === 'string' ? (
              <TruncatedText text={ value } loading={ isLoading }/>
            ) : (
              value
            ) }
            { valuePostfix && <span className="whitespace-pre">{ valuePostfix }</span> }
            { diff && Number(diff) > 0 && (
              <>
                <span className="ml-2 mr-1 text-[var(--color-green-500)]">
                  +{ diffFormatted || Number(diff).toLocaleString() }
                </span>
                <span className="text-[var(--color-text-secondary)] text-sm">({ diffPeriod })</span>
              </>
            ) }
            { period && <span className="text-[var(--color-text-secondary)] text-xs font-normal ml-1">({ period })</span> }
          </Skeleton>
        </div>
        { typeof hint === 'string' ? (
          <Skeleton loading={ isLoading } alignSelf="center" borderRadius="base" flexShrink={ 0 }>
            <Hint label={ hint } className="size-5 text-[var(--color-icon-secondary)]"/>
          </Skeleton>
        ) : hint }
      </div>
    </Container>
  );
};

export default StatsWidget;
