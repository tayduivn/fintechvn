import * as constant from './constants';

const initialState = {
  token   : null,
  ttl     : null,
  created : null
};

let reducer = (state = initialState, action) => {
  switch (action.type) {
    case constant.SET_SESSION:
    {
      let info = action.payload;
      return {
        ...info
      };
    }

    case constant.RESET_SESSION:
      return {
        ...initialState
      };

    default:
      break;
  };
  return state;
};

export default reducer;