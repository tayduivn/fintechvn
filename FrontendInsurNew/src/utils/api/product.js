// @flow

import * as base from './base';

const PRODUCT_BASE = `${ base.API_BASE }/products`;

export const get = (type) => {

  let url = `${ PRODUCT_BASE }/getProductType?type=${type}`;
  return base.get(url, 200)
    .then(obj => {
      return obj;
    });
}