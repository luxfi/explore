import React from 'react';

import type { TagProps } from 'toolkit/chakra/tag';
import { Tag } from 'toolkit/chakra/tag';

type Props<T extends string> = {
  items: Array<{ id: T; title: string }>;
  tagSize?: TagProps['size'];
  loading?: boolean;
  disabled?: boolean;
  className?: string;
} & (
  {
    value?: T;
    onChange: (value: T) => void;
    isMulti?: false;
  } | {
    value: Array<T>;
    onChange: (value: Array<T>) => void;
    isMulti: true;
  }
);

const TagGroupSelect = <T extends string>({ items, value, isMulti, onChange, tagSize, loading, disabled, className, ...rest }: Props<T>) => {
  const onItemClick = React.useCallback((event: React.SyntheticEvent) => {
    const itemValue = (event.currentTarget as HTMLDivElement).getAttribute('data-id') as T;
    if (isMulti) {
      let newValue;
      if (value.includes(itemValue)) {
        newValue = value.filter(i => i !== itemValue);
      } else {
        newValue = [ ...value, itemValue ];
      }
      onChange(newValue);
    } else {
      onChange(itemValue);
    }
  }, [ isMulti, onChange, value ]);

  return (
    <div className={ `flex flex-row gap-2 ${ className ?? '' }`.trim() } { ...rest }>
      { items.map(item => {
        const isSelected = isMulti ? value.includes(item.id) : value === item.id;
        return (
          <Tag
            variant="select"
            key={ item.id }
            data-id={ item.id }
            selected={ isSelected }
            onClick={ disabled ? undefined : onItemClick }
            size={ tagSize }
            className="inline-flex justify-center font-medium"
            loading={ loading }
            disabled={ disabled }
          >
            { item.title }
          </Tag>
        );
      }) }
    </div>
  );
};

export default TagGroupSelect;
