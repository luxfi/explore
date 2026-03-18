import React from 'react';

import SearchBar from 'ui/snippets/searchBar/SearchBarDesktop';

type Props = {
  renderSearchBar?: () => React.ReactNode;
};

const HeaderDesktop = ({ renderSearchBar }: Props) => {

  const searchBar = renderSearchBar ? renderSearchBar() : <SearchBar/>;

  return (
    <header className="hidden lg:flex w-full items-center justify-center gap-6">
      <div className="w-full">
        { searchBar }
      </div>
    </header>
  );
};

export default React.memo(HeaderDesktop);
