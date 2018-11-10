// @flow
import * as constant from './constants';

const initialState: DistrictState = {
  data: {},
  ordered: [],
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
      let set = new Set(state.ordered);
      list.forEach((item) => {
        newData[item.id] = item;
        set.add(item.id)
      });
      let newOrdered = [ ...set.keys() ];

      return {
        data: { ...state.data, ...newData },
        ordered: newOrdered,
        isWorking: false
      };
    }

    default:
    break;
  }

  return state;
};

export default reducer;