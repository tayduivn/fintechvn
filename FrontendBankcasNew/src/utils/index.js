import * as localStorage from './localStorage';
import * as sessionStorage from './sessionStorage';

import * as user from './api/users';
import * as email from './api/email';
import * as agency from './api/agency';
import * as channel from './api/channel';
import * as groups from './api/groups';
import * as product from './api/product';
import * as years from './api/years';
import * as productDetail from './api/productDetail';

export const api = {
  user,
  email,
  agency,
  channel,
  groups,
  product,
  years,
  productDetail
}

export { localStorage, sessionStorage };