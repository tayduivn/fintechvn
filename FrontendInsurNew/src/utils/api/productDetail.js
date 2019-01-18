import * as base from './base';

const PRODUCT_DETAIL = `${ base.API_BASE }/productDetails`;

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
  
  let url = `${ PRODUCT_DETAIL }?filter=${ JSON.stringify(filters)}`;
  return base.get(url, 200)
    .then(obj => {
      return obj;
    });
}

export const create = (data) => {
  return base.post(PRODUCT_DETAIL, data, 200)
  .then(obj => {
    return obj;
  });
}

export const pdf = (id, pdfBase) => {
  let url = `${ PRODUCT_DETAIL }/pdf/${ id }`;
  return base.post(url, pdfBase, 200)
    .then(obj => { console.log(obj)
      let { error, data } = obj;
      return {error, data: data.status };
    });
}

export const del = (id) =>{
  return base.del(`${PRODUCT_DETAIL}/`+id, 200)
    .then(res => {
      return res;
    });
}

export const updateById = (id, body) => {
  let url = `${ PRODUCT_DETAIL }/${ id }`;
  return base.patch(url, body, 200)
    .then(obj => {
      return obj;
    });
}
