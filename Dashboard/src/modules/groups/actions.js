import * as constant from './constants';
import { api } from 'utils';

const reset = () => {
  return {
    type: constant.RESET,
    payload: null
  };
}

const fetchStarted = () => {
  return {
    type: constant.FETCH_STARTED,
    payload: null
  };
};

const fetchFinished = (data) => {
  return {
    type: constant.FETCH_FINISHED,
    payload: data
  };
};

const fetchFailed = (error) => {
  return {
    type: constant.FETCH_FAILED,
    payload: error
  };
};


export const fetchAll = (filter?, skip?, limit?, where?) => {
  return (dispatch: (action) => void) => {
    dispatch(reset());
    dispatch(fetchStarted());
    return api.groups.fetchAll(filter, skip, limit, where)
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
    return api.groups.create(data)
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
    return api.groups.updateById(data, id)
      .then(obj => {
        if(!!obj.data)
          dispatch(fetchFinished([obj.data]))
        else dispatch(fetchFailed(obj.error));
        return obj
      });
  }
}
