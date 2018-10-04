// @flow
import * as constant from './constants';

const initialState: DistrictState = {
  data: {},
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
      let list = action.payload;

      let newData = { };
      list.forEach((item) => {
        newData[item.type] = item.data;
      });

      return {
        data: { ...state.data, ...newData },
        isWorking: false
      };
    }

    default:
    break;
  }

  return state;
};

export default reducer;