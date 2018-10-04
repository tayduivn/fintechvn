import { combineReducers } from 'redux';

import { reducer as years } from './years';

const reducer = combineReducers({
  years
});

export default reducer;