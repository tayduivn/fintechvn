// @flow

import { combineReducers } from 'redux';

import { reducer as session } from 'modules/session';
import { reducer as profile } from 'modules/profile';
import { reducer as productDetail } from 'modules/productDetail';
import { reducer as product } from 'modules/product';

const reducer = combineReducers({
  session,
  profile,
  productDetail,
  product
});

export default reducer;