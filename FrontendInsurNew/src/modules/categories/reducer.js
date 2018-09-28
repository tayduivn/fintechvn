import { combineReducers } from 'redux';

import { reducer as agency } from './agency';
import { reducer as years } from './years';
import { reducer as seatsPayload } from './seatsPayload';
import { reducer as ruleExtend } from './ruleExtend';

const reducer = combineReducers({
  agency,
  years,
  seatsPayload,
  ruleExtend
});

export default reducer;