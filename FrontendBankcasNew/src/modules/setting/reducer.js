// @flow
import * as constant from './constants';

const initialState: DistrictState = {
  item: {},
  isWorking: false
};

let reducer = (state: DistrictState = initialState, action: Action): DistrictState => {
  switch (action.type) {
    case constant.RESET:
      return { ...initialState };

    case constant.FETCH_STARTED:
      return {
        ...state,
        isWorking: true
      };

    case constant.FETCH_FAILED:
      return {
        ...state,
        isWorking: false
      };

    case constant.FETCH_FINISHED:
    {
      let item      = { ...state.item };
      let { type }  = action.payload;
      if(!!type)
        item[type]    = action.payload;
        
      return {
        item,
        isWorking: false
      };
    }

    default:
    break;
  }

  return state;
};

export default reducer;