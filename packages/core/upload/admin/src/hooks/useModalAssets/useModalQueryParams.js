import { useState } from 'react';

import { stringify } from 'qs';

const useModalQueryParams = () => {
  const [queryObject, setQueryObject] = useState({
    page: 1,
    sort: 'updatedAt:DESC',
    pageSize: 10,
  });

  const handleChangePageSize = pageSize => {
    setQueryObject(prev => ({ ...prev, pageSize: parseInt(pageSize, 10), page: 1 }));
  };

  const handeChangePage = page => {
    setQueryObject(prev => ({ ...prev, page }));
  };

  const handleChangeSort = sort => {
    setQueryObject(prev => ({ ...prev, sort }));
  };

  const handleChangeSearch = () => {
    console.log('change search');
  };

  const handleSubmitSearch = e => {
    e.preventDefault();
    e.stopPropagation();

    console.log('submit search');
  };

  return [
    { queryObject, rawQuery: stringify(queryObject, { encode: false }) },
    {
      onChangePage: handeChangePage,
      onChangePageSize: handleChangePageSize,
      onChangeSort: handleChangeSort,
      onChangeSearch: handleChangeSearch,
      onSubmitSearch: handleSubmitSearch,
    },
  ];
};

export default useModalQueryParams;
