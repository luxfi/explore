import { HStack, Box } from '@chakra-ui/react';
import React from 'react';

import SearchBar from 'ui/snippets/searchBar/SearchBarDesktop';

type Props = {
  renderSearchBar?: () => React.ReactNode;
};

const HeaderDesktop = ({ renderSearchBar }: Props) => {

  const searchBar = renderSearchBar ? renderSearchBar() : <SearchBar/>;

  return (
    <HStack
      as="header"
      display={{ base: 'none', lg: 'flex' }}
      width="100%"
      alignItems="center"
      justifyContent="center"
      gap={ 6 }
    >
      <Box width="100%">
        { searchBar }
      </Box>
    </HStack>
  );
};

export default React.memo(HeaderDesktop);
