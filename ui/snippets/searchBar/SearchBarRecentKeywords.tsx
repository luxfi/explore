import React from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';
import { clearRecentSearchKeywords, getRecentSearchKeywords, removeRecentSearchKeyword } from 'lib/recentSearchKeywords';
import { Link } from 'toolkit/next/link';
import { ClearButton } from 'toolkit/components/buttons/ClearButton';
import TextAd from 'ui/shared/ad/TextAd';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';

type Props = {
  onClick: (kw: string) => void;
  onClear?: () => void;
};

const SearchBarRecentKeywords = ({ onClick, onClear }: Props) => {
  const isMobile = useIsMobile();

  const [ keywords, setKeywords ] = React.useState<Array<string>>(getRecentSearchKeywords());

  const handleClick = React.useCallback((kw: string) => () => {
    onClick(kw);
  }, [ onClick ]);

  const clearKeywords = React.useCallback(() => {
    clearRecentSearchKeywords();
    setKeywords([]);
    onClear?.();
  }, [ onClear ]);

  const removeKeyword = React.useCallback((kw: string) => (e: React.SyntheticEvent) => {
    e.stopPropagation();
    const result = keywords.filter(item => item !== kw);
    setKeywords(result);
    if (result.length === 0 && onClear) {
      onClear();
    }
    removeRecentSearchKeyword(kw);
  }, [ keywords, onClear ]);

  if (keywords.length === 0) {
    return null;
  }

  return (
    <>
      { !isMobile && (
        <div className="pb-4 mb-5 border-b border-[var(--color-border-divider)] empty:hidden">
          <TextAd className="lg:text-sm"/>
        </div>
      ) }
      <div className="flex mb-3 justify-between text-sm">
        <span className="font-semibold text-[var(--color-text-secondary)]">Recent</span>
        <Link onClick={ clearKeywords } variant="secondary">Clear all</Link>
      </div>
      <div className="flex flex-col overflow-y-auto">
        { keywords.map(kw => (
          <div
            key={ kw }
            className="flex py-[9px] lg:py-3 px-0 lg:px-1 border-b border-[var(--color-border-divider)] last:border-b-0 hover:bg-[var(--color-gray-100)] dark:hover:bg-[var(--color-gray-800)] text-sm first:mt-2 items-center justify-between cursor-pointer gap-x-2 font-normal lg:font-bold min-w-0 grow"
            onClick={ handleClick(kw) }
          >
            { kw.startsWith('0x') ? (
              <div className="overflow-hidden whitespace-nowrap">
                <HashStringShortenDynamic hash={ kw } noTooltip/>
              </div>
            ) :
              <span className="overflow-hidden whitespace-nowrap text-ellipsis">{ kw }</span>
            }
            <ClearButton onClick={ removeKeyword(kw) }/>
          </div>
        )) }
      </div>
    </>
  );
};

export default SearchBarRecentKeywords;
