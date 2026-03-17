import { upperFirst } from 'es-toolkit';
import * as React from 'react';

import { cn } from 'lib/utils/cn';

import { apos } from '../utils/htmlEntities';
import ComingSoonIcon from './assets/empty_state_coming_soon.svg';
import QueryIcon from './assets/empty_state_query.svg';
import StatsIcon from './assets/empty_state_stats.svg';

export type EmptyStateType = 'query' | 'stats' | 'coming_soon';

const ICONS: Partial<Record<EmptyStateType, React.FunctionComponent>> = {
  query: QueryIcon as unknown as React.FunctionComponent,
  stats: StatsIcon as unknown as React.FunctionComponent,
  coming_soon: ComingSoonIcon as unknown as React.FunctionComponent,
};

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: React.ReactNode;
  term?: string;
  type?: EmptyStateType;
  icon?: React.ReactNode;
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  function EmptyState(props, ref) {
    const { title, description, term, type = 'query', icon, children, className, ...rest } = props;

    const titleContent = (() => {
      if (title) {
        return title;
      }

      if (type === 'stats') {
        return 'Collecting data';
      }

      if (type === 'coming_soon') {
        return 'Coming soon';
      }

      return 'No results';
    })();

    const descriptionContent = (() => {
      if (description) {
        return description;
      }

      if (term && type === 'query') {
        return `Couldn${ apos }t find any ${ term } that matches your query.`;
      }

      if (type === 'stats') {
        return term ? `${ upperFirst(term) } stats will be added soon` : 'Charts and statistics will be available soon';
      }

      if (type === 'coming_soon') {
        return 'The information will be available soon. Stay tuned!';
      }
    })();

    const iconContent = (() => {
      const Icon = ICONS[type];
      if (Icon) {
        return <Icon/>;
      }
      return icon;
    })();

    return (
      <div
        ref={ ref }
        className={ cn('flex items-center justify-center py-10', className) }
        { ...rest }
      >
        <div className="flex flex-col items-center gap-5">
          { iconContent && (
            <div className="flex items-center justify-center">{ iconContent }</div>
          ) }
          { descriptionContent ? (
            <div className="flex flex-col items-center gap-2 text-center">
              <span className="text-lg font-semibold text-text-secondary">{ titleContent }</span>
              <span className="text-sm text-text-secondary">
                { descriptionContent }
              </span>
            </div>
          ) : (
            <span className="text-lg font-semibold text-text-secondary">{ titleContent }</span>
          ) }
          { children }
        </div>
      </div>
    );
  },
);
