
import * as constant from './constants';

let initialState = {
  page_name: '',
  breadcrumb: []
};
  
let reducer = (state: CountryState = initialState, action: Action): CountryState => {

  switch (action.type) {
    case constant.RESET:
      return {...initialState}; 
    case constant.SET_BREADCRUMB:{
      let { page_name, breadcrumb } = action.payload;
      return {
        page_name,
        breadcrumb
      };
    }
    case constant.ADD_BREADCRUMB:{
      let { page_name, breadcrumb } = action.payload;

      let breadcrumbSt = [...state.breadcrumb];
      breadcrumbSt.push(breadcrumb);

      return {
        page_name,
        breadcrumb  : breadcrumbSt
      };
    }

    default:
      break;
  }

  return state;
};

export default reducer;