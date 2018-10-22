// @flow

import * as base from './base';

const CHANNEL_BASE = `${ base.API_BASE }/channels`;

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
  
  let url = `${ CHANNEL_BASE }?filter=${ JSON.stringify(filters)}`;
  return base.get(url, 200)
    .then(obj => {
      return obj;
    });
}


export const updateById = (data, id) => {
  let url = `${CHANNEL_BASE}/${id}`;
  return base.patch(url, data, 200)
    .then(obj => {
      return obj;
    });
}

export const create = (data) => {
  return base.post(CHANNEL_BASE, data, 200)
  .then(obj => {
    return obj;
  });
}

