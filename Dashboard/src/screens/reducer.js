// @flow

import { combineReducers } from 'redux';
import { reducer as session } from 'modules/session';
import { reducer as breadcrumb } from 'screens/modules/breadcrumb';
import { reducer as users } from 'modules/user';
import { reducer as profile } from 'modules/account';
import { reducer as categories } from 'modules/categories';

const reducer = combineReducers({
  session,
  breadcrumb,
  categories,
  users,
  profile
});

export default reducer;