// @flow

import * as base from './base';

const GROUP = `${ base.API_BASE }/groups`;

export const fetchAll = (filter, skip, limit, where) => {
  filter  = filter  || {};
  where   = where   || {};
  skip    = skip    || 0;
  limit   = limit   || 0;
  
  let filters = {
    ...filter,
    skip,
    limit,
    where
  };
  
  let url = `${ GROUP }?filter=${ JSON.stringify(filters)}`;
  return base.get(url, 200)
    .then(obj => {
      return obj;
    });
}


export const updateById = (data, id) => {
  let url = `${GROUP}/${id}`;
  return base.patch(url, data, 200)
    .then(obj => {
      return obj;
    });
}

export const create = (data) => {
  return base.post(GROUP, data, 200)
  .then(obj => {
    return obj;
  });
}