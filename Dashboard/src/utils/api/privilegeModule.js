// @flow

import * as base from './base';

const PRIVILEGE_MODULE_BASE = `${ base.API_BASE }/privilegeModules`;

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
  
  let url = `${ PRIVILEGE_MODULE_BASE }?filter=${ JSON.stringify(filters)}`;
  return base.get(url, 200)
    .then(obj => {
      return obj;
    });
}


export const updateById = (data, id) => {
  let url = `${PRIVILEGE_MODULE_BASE}/${id}`;
  return base.patch(url, data, 200)
    .then(obj => {
      return obj;
    });
}

export const create = (data) => {
  return base.post(PRIVILEGE_MODULE_BASE, data, 200)
  .then(obj => {
    return obj;
  });
}

export const del = (id) =>{
  return base.del(`${PRIVILEGE_MODULE_BASE}/`+id, 200)
    .then(res => {
      return res;
    });
}

