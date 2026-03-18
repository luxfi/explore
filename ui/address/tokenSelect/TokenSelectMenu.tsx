import { sumBy } from 'es-toolkit';
import React from 'react';

import type { FormattedData } from './types';

import { getTokenTypeName } from 'lib/token/tokenTypes';
import { Link } from 'toolkit/chakra/link';
import { FilterInput } from 'toolkit/components/filters/FilterInput';
import { thinsp } from 'toolkit/utils/htmlEntities';
import IconSvg from 'ui/shared/IconSvg';

import type { Sort } from '../utils/tokenUtils';
import { getSortingFn, sortTokenGroups } from '../utils/tokenUtils';
import TokenSelectItem from './TokenSelectItem';

interface Props {
  searchTerm: string;
  getSort: (typeId: string) => Sort;
  filteredData: FormattedData;
  onInputChange: (searchTerm: string) => void;
  onSortClick: (event: React.SyntheticEvent) => void;
}

const TokenSelectMenu = ({ getSort, filteredData, onInputChange, onSortClick, searchTerm }: Props) => {
  const hasFilteredResult = sumBy(Object.values(filteredData), ({ items }) => items.length) > 0;

  return (
    <>
      <FilterInput
        placeholder="Search by token name"
        size="sm"
        inputProps={{ className: 'bg-[var(--color-dialog-bg)]' }}
        mb={ 5 }
        onChange={ onInputChange }
      />
      <div className="flex flex-col gap-y-6">
        { Object.entries(filteredData).sort(sortTokenGroups).map(([ tokenType, tokenInfo ]) => {
          if (tokenInfo.items.length === 0) {
            return null;
          }

          const type = tokenType;
          const sortDirection = getSort(type);
          const arrowTransform = sortDirection === 'desc' ? 'rotate(90deg)' : 'rotate(-90deg)';
          const hasSort = tokenInfo.items.length > 1 && (
            (type === 'ERC-404' && tokenInfo.items.some(item => item.value)) ||
            type === 'ERC-1155' ||
            (type !== 'ERC-721' && tokenInfo.items.some(({ usd }) => usd))
          );
          const numPrefix = tokenInfo.isOverflow ? `>${ thinsp }` : '';

          return (
            <div key={ type }>
              <div className="flex justify-between">
                <span className="mb-3 font-semibold text-gray-500 text-sm">
                  { getTokenTypeName(type) } tokens ({ numPrefix }{ tokenInfo.items.length })
                </span>
                { hasSort && (
                  <Link data-type={ type } onClick={ onSortClick } aria-label={ `Sort ${ getTokenTypeName(type) } tokens` }>
                    <IconSvg name="arrows/east" className="w-5 h-5 transition-transform duration-150" style={{ transform:  arrowTransform  }}/>
                  </Link>
                ) }
              </div>
              { tokenInfo.items.sort(getSortingFn(type)(sortDirection)).map((data) =>
                <TokenSelectItem key={ data.token.address_hash + data.token_id } data={ data }/>) }
            </div>
          );
        }) }
      </div>
      { Boolean(searchTerm) && !hasFilteredResult && <span className="text-sm">Could not find any matches.</span> }
    </>
  );
};

export default React.memo(TokenSelectMenu);
