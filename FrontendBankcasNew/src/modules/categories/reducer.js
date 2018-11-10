import { combineReducers } from 'redux';

import { reducer as years } from './years';
import { reducer as seatsPayload } from './seatsPayload';
import { reducer as ruleExtends } from './ruleExtends';
import { reducer as yearHouse } from './yearHouse';
import { reducer as feeNameExtendHouse } from './feeNameExtendHouse';
import { reducer as feeHouse } from './feeHouse';

const reducer = combineReducers({
  years,
  seatsPayload,
  ruleExtends,
  yearHouse,
  feeNameExtendHouse,
  feeHouse
});

export default reducer;