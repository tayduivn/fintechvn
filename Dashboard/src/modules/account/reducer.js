import * as constant from './constants';

const initialState = {
  info      : null,
  isWorking : false,
  error     : null
};

let reducer = (state = initialState, action) => {
  switch (action.type) {
    case constant.RESET:
      return {
        ...initialState
      };
    case constant.UPDATE_FAILED:
      return{
        ...state,
        isWorking: false,
        error: null
      }
    case constant.FETCH_STARTED:
      return {
        ...state,
        isWorking: true,
        error: null
      };

    case constant.FETCH_FINISHED: {
      let {payload: info} = action;
      return {
        info,
        isWorking : false,
        error     : null
      };
    }
    default:
      break;
  };
  return state;
};

export default reducer;