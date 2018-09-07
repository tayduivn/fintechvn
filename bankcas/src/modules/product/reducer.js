import * as constant from './constants';

const initialState = {
  data      : {},
  ordered   : [],
  isWorking : false,
  error     : null
};

let reducer = (state = initialState, action) => {
  switch (action.type) {
    case constant.RESET:
      return {...initialState, ordered: []};
    
    case constant.FETCH_STARTED:
      return {
        ...state,
        isWorking : true,
        error     : null
      };
    case constant.FETCH_FAILED:
      return {
        ...state,
        isWorking : false,
        error     : action.payload
      };
    case constant.FETCH_FINISHED: {
      let list = action.payload;
      let newData = { };
      let set = new Set(state.ordered);
      list.forEach(lst => {
        newData[lst.id] = lst;
        set.add(lst.id);
      });
      let newOrdered = [ ...set.keys() ];
      // newOrdered.sort();
      return {
        ...state,
        data: { ...state.data, ...newData },
        ordered: newOrdered,
        isWorking: false,
        error: null
      };
    }
    default:
      break;
  };
  return state;
};

export default reducer;