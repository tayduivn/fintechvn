import { combineReducers } from 'redux';

import { reducer as years } from './years';
import { reducer as seatsPayload } from './seatsPayload';
import { reducer as ruleExtends } from './ruleExtends';

const reducer = combineReducers({
  years,
  seatsPayload,
  ruleExtends
});

export default reducer;