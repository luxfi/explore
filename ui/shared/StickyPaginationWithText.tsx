import React from 'react';

import type { PaginationParams } from './pagination/types';

import ActionBar from './ActionBar';
import Pagination from './pagination/Pagination';

type Props = {
  pagination: PaginationParams;
  text: React.ReactNode;
};

const StickyPaginationWithText = ({ pagination, text }: Props) => {
  if (!pagination.isVisible) {
    return <div className="mb-6">{ text }</div>;
  }

  return (
    <>
      <div className="mb-6 block lg:hidden">
        { text }
      </div>
      <ActionBar className="-mt-6 items-center">
        <div className="hidden lg:block">
          { text }
        </div>
        { pagination.isVisible && <Pagination className="ml-auto" { ...pagination }/> }
      </ActionBar>
    </>
  );
};

export default StickyPaginationWithText;
