import * as localStorage from './localStorage';
import * as sessionStorage from './sessionStorage';

import * as user from './api/users';
import * as email from './api/email';
import * as agency from './api/agency';
import * as years from './api/years';
import * as groups from './api/groups';
import * as seatsPayload from './api/seatsPayload';
import * as ruleExtend from './api/ruleExtend';
import * as productDetail from './api/productDetail';
import * as product from './api/product';
import * as messages from './api/messages';
import * as yearHouse from './api/yearHouse';
import * as feeNameExtendHouse from './api/feeNameExtendHouse';
import * as feeHouse from './api/feeHouse';

export const api = {
  user,
  email,
  agency,
  years,
  groups,
  seatsPayload,
  ruleExtend,
  productDetail,
  product,
  messages,
  yearHouse,
  feeNameExtendHouse,
  feeHouse
}

export { localStorage, sessionStorage };