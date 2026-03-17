import * as React from 'react';

import StarFilledIcon from 'icons/star_filled.svg';
import StarOutlineIcon from 'icons/star_outline.svg';
import { cn } from 'lib/utils/cn';

export interface RatingProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  count?: number;
  label?: string | Array<string>;
  defaultValue?: number;
  onValueChange?: ({ value }: { value: number }) => void;
  readOnly?: boolean;
}

export const Rating = React.forwardRef<HTMLDivElement, RatingProps>(
  function Rating(props, ref) {
    const { count = 5, label: labelProp, defaultValue = 0, onValueChange, readOnly, className, ...rest } = props;

    const [ value, setValue ] = React.useState(defaultValue);
    const [ hoveredIndex, setHoveredIndex ] = React.useState(-1);

    const highlightedIndex = hoveredIndex >= 0 && !readOnly ? hoveredIndex + 1 : value;
    const label = Array.isArray(labelProp) ? labelProp[highlightedIndex - 1] : labelProp;

    const handleClick = React.useCallback((index: number) => () => {
      if (readOnly) return;
      setValue(index);
      onValueChange?.({ value: index });
    }, [ readOnly, onValueChange ]);

    const handleMouseEnter = React.useCallback((index: number) => () => {
      if (readOnly) return;
      setHoveredIndex(index);
    }, [ readOnly ]);

    const handleMouseLeave = React.useCallback(() => {
      setHoveredIndex(-1);
    }, []);

    return (
      <div ref={ ref } className={ cn('inline-flex items-center gap-1', className) } { ...rest }>
        <div className="inline-flex items-center" onMouseLeave={ handleMouseLeave }>
          { Array.from({ length: count }).map((_, index) => {
            const filled = index < highlightedIndex;
            const starIndex = index + 1;

            return (
              <button
                key={ index }
                type="button"
                tabIndex={ readOnly ? -1 : 0 }
                aria-label={ `Rate ${ starIndex } of ${ count }` }
                className={ cn(
                  'inline-flex items-center justify-center w-5 h-5 text-current',
                  readOnly ? 'cursor-default' : 'cursor-pointer',
                ) }
                onClick={ handleClick(starIndex) }
                onMouseEnter={ handleMouseEnter(index) }
              >
                { filled ? <StarFilledIcon className="w-5 h-5"/> : <StarOutlineIcon className="w-5 h-5"/> }
              </button>
            );
          }) }
        </div>
        { label && <span className="text-sm">{ label }</span> }
      </div>
    );
  },
);
