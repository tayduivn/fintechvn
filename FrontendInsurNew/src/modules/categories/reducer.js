import { combineReducers } from 'redux';

import { reducer as agency } from './agency';
import { reducer as years } from './years';
import { reducer as seatsPayload } from './seatsPayload';
import { reducer as ruleExtend } from './ruleExtend';
import { reducer as messages } from './messages';

const reducer = combineReducers({
  agency,
  years,
  seatsPayload,
  ruleExtend,
  messages
});

export default reducer;