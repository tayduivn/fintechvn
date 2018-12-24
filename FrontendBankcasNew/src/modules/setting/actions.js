// @flow

import * as constant from './constants';
import { api } from 'utils';
import { isEmpty } from 'utils/functions';

export const reset = ():Action => {
  return {
    type: constant.RESET,
    payload: null
  };
}

export const fetchStarted = ():Action => {
  return {
    type: constant.FETCH_STARTED,
    payload: null
  };
};

export const fetchFailed = (error: any):Action => {
  return {
    type: constant.FETCH_FAILED,
    payload: error
  };
};

export const fetchFinished = (data: any):Action => {
  return {
    type: constant.FETCH_FINISHED,
    payload: data
  };
};

export const fetchAll = (filter?, skip?, limit?, where?) => {
  return (dispatch: (action: Action) =>void) => {
    dispatch(fetchStarted());
    return api.setting.get(filter, skip, limit, where)
      .then(res => {
        if(res.error) return Promise.reject(res.error);
        let data = res.data;
        if(!!data && 'push' in data && !isEmpty(data) ) data = data[0]
        else data = {};

        dispatch(fetchFinished(data));
        return data;
      })
      .catch(err => {
        dispatch(fetchFailed(err));
      });
  };
};
