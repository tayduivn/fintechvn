import * as localStorage from './localStorage';
import * as sessionStorage from './sessionStorage';

import * as user from './api/users';
import * as email from './api/email';
import * as productDetail from './api/productDetail';
import * as product from './api/product';

export const api = {
  user,
  email,
  productDetail,
  product
}

export { localStorage, sessionStorage };