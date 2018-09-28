// @flow

import * as base from './base';

const SEATS_PAYLOADS_BASE = `${ base.API_BASE }/seatsPayloads`;

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
  
  let url = `${ SEATS_PAYLOADS_BASE }?filter=${ JSON.stringify(filters)}`;
  return base.get(url, 200)
    .then(obj => {
      return obj;
    });
}


export const updateById = (data, id) => {
  let url = `${SEATS_PAYLOADS_BASE}/${id}`;
  return base.patch(url, data, 200)
    .then(obj => {
      return obj;
    });
}

export const create = (data) => {
  return base.post(SEATS_PAYLOADS_BASE, data, 200)
  .then(obj => {
    return obj;
  });
}