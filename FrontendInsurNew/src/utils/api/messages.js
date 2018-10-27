// @flow

import * as base from './base';

const MESSAGES_BASE = `${ base.API_BASE }/messages`;

export const get = (filter, skip, limit, where) => {
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
  
  let url = `${ MESSAGES_BASE }?filter=${ JSON.stringify(filters)}`;
  return base.get(url, 200)
    .then(obj => {
      return obj;
    });
}

export const updateById = (id, data) => {
  let url = `${MESSAGES_BASE}/${id}`;
  return base.patch(url, data, 200)
    .then(obj => {
      return obj;
    });
}
