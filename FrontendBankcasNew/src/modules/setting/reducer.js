import { combineReducers } from 'redux';

import { reducer as discount } from './discount';

const reducer = combineReducers({
  discount
});

export default reducer;