// @flow

import * as base from './base';

const FEE_ASSET_HOUSE_BASE = `${ base.API_BASE }/feeAssetHomes`;

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
  
  let url = `${ FEE_ASSET_HOUSE_BASE }?filter=${ JSON.stringify(filters)}`;
  
  return base.get(url, 200)
    .then(obj => {
      return obj;
    });
}