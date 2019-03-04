import { combineReducers } from 'redux';

import { reducer as agency } from './agency';
import { reducer as channel } from './channel';
import { reducerG, reducerM } from './privilege';

const reducer = combineReducers({
  agency,
  channel,
  privilegeModule: reducerM,
  privilegeGroup: reducerG
});

export default reducer;
