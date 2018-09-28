import { combineReducers } from 'redux';

import { reducer as agency } from './agency';
import { reducer as channel } from './channel';

const reducer = combineReducers({
  agency,
  channel
});

export default reducer;