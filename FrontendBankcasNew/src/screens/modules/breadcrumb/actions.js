import * as constant from './constants';

export const set = (data) => {
  return {
    type: constant.SET_BREADCRUMB,
    payload: data
  };
}

export const reset = () => {
  return {
    type: constant.RESET,
    payload: null
  };
}

export const add = (data) => {
  return {
    type: constant.ADD_BREADCRUMB,
    payload: data
  };
}

