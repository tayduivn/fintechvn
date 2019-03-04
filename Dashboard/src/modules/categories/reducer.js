import { combineReducers } from 'redux';

import { reducer as agency } from './agency';
import { reducer as channel } from './channel';
import { reducerG, reducerM } from './privilege';
import { reducer as apiKey } from './apiKey';

const reducer = combineReducers({
  agency,
  channel,
  apiKey,
  privilegeModule: reducerM,
  privilegeGroup: reducerG
});

export default reducer;
