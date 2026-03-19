import React from 'react';

import type { Route } from 'nextjs-routes';
import { route } from 'nextjs-routes';

import { cn } from 'lib/utils/cn';
import { Link } from 'toolkit/next/link';
import { Skeleton } from '@luxfi/ui/skeleton';
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
        className={ cn(
          'flex items-center p-3 rounded-sm justify-between gap-x-3 w-full h-full',
          'border border-[var(--color-border-divider)]',
          isLoading ? 'bg-[var(--color-blackAlpha-50)] dark:bg-[var(--color-whiteAlpha-50)]' : 'bg-[var(--color-stats-bg)]',
          !href && className,
        ) }
      >
        { icon && (
          <IconSvg
            name={ icon }
            className={ cn(
              'hidden lg:block shrink-0 p-2 rounded-base',
              isFallback && !isLoading && 'opacity-[var(--opacity-control-disabled)]',
            ) }
            style={{ width: '32px', height: '32px' }}
            isLoading={ isLoading }
          />
        ) }
        <div className="flex flex-col grow min-w-0">
          <Skeleton loading={ isLoading } className="w-fit text-xs text-[var(--color-text-secondary)]">
            <h2>{ label }</h2>
          </Skeleton>
          <Skeleton
            loading={ isLoading }
            className={ cn(
              'flex items-baseline font-medium font-mono text-lg',
              isFallback && !isLoading && 'opacity-[var(--opacity-control-disabled)]',
            ) }
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
          <Skeleton loading={ isLoading } className="self-center shrink-0 rounded-base">
            <Hint label={ hint } className="size-5 text-[var(--color-icon-secondary)]"/>
          </Skeleton>
        ) : hint }
      </div>
    </Container>
  );
};

export default StatsWidget;
