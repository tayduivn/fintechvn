import * as base from './base';

const PRODUCT = `${ base.API_BASE }/products`;

export const fetchAll = (filter, skip, limit, where) => {
  filter  = filter || {};
  where   = where || {};
  skip    = skip || 0;
  limit   = limit || 0;

  let filters = {
    filter,
    skip,
    limit,
    where
  };

  let url = `${ PRODUCT }?filter=${ JSON.stringify(filters)}`;
  return base.get(url, 200)
    .then(obj => {
      return obj;
    });
}