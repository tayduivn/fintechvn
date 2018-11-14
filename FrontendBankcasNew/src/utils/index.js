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
import * as seatsPayload from './api/seatsPayload';
import * as ruleExtends from './api/ruleExtends';
import * as yearHouse from './api/yearHouse';
import * as feeNameExtendHouse from './api/feeNameExtendHouse';
import * as feeHouse from './api/feeHouse';
import * as feeAssetHouse from './api/feeAssetHouse';

export const api = {
  user,
  email,
  agency,
  channel,
  groups,
  product,
  years,
  productDetail,
  seatsPayload,
  ruleExtends,
  yearHouse,
  feeNameExtendHouse,
  feeHouse,
  feeAssetHouse
}

export { localStorage, sessionStorage };