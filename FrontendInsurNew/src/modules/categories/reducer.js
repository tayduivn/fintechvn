import { combineReducers } from 'redux';

import { reducer as agency } from './agency';
import { reducer as years } from './years';
import { reducer as seatsPayload } from './seatsPayload';
import { reducer as ruleExtend } from './ruleExtend';
import { reducer as messages } from './messages';
import { reducer as yearHouse } from './yearHouse';
import { reducer as feeNameExtendHouse } from './feeNameExtendHouse';
import { reducer as feeHouse } from './feeHouse';
import { reducer as feeAssetHouse } from './feeAssetHouse';
import { reducer as carType } from './carType';
import { reducer as seats } from './seats';
import { reducer as productName } from './productName';

const reducer = combineReducers({
  agency,
  years,
  seatsPayload,
  ruleExtend,
  messages,
  yearHouse,
  feeNameExtendHouse,
  feeHouse,
  feeAssetHouse,
  carType,
  seats,
  productName
});

export default reducer;