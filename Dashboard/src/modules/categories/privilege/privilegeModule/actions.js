// @flow

import * as constant from './constants';
import { api } from 'utils';

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

const delFinished = (id) => {
  return {
    type: constant.DEL_FINISHED,
    payload: id
  }
}

export const fetchAll = (filter?, skip?, limit?, where?) => {
  return (dispatch: (action: Action) =>void) => {
    dispatch(reset());
    dispatch(fetchStarted());
    return api.privilegeModule.get(filter, skip, limit, where)
      .then(res => {
        if(res.error) return Promise.reject(res.error);
        dispatch(fetchFinished(res.data));
        return res.data;
      })
      .catch(err => {
        dispatch(fetchFailed(err));
      });
  };
};

export const create = (data) => {
  return (dispatch: (action) => void) => {
    dispatch(fetchStarted());
    return api.privilegeModule.create(data)
      .then(obj => {
        if(obj.error)
          dispatch(fetchFailed(obj.error));
        if(obj.data)
          dispatch(fetchFinished([obj.data]));
        return obj;
      });
  };
};

export const updateById = (id, data) => { 
  return (dispatch: (action) => void) => {
    dispatch(fetchStarted());
    return api.privilegeModule.updateById(data, id)
      .then(obj => {
        if(!!obj.data)
          dispatch(fetchFinished([obj.data]))
        else dispatch(fetchFailed(obj.error));
        return obj
      });
  }
}


export const deleteItem = (id) => {
  return (dispatch: (action: Action) => void, getState: () => GlobalState) => {
    dispatch(fetchStarted());
    return api.privilegeModule.del(id)
      .then(res => {
        dispatch(delFinished(id));
        return res;
      });
  }
}
