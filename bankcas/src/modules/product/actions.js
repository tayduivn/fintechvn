import * as constant from './constants';
import { api } from 'utils';

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
    dispatch(fetchStarted());
    return api.product.fetchAll(filter, skip, limit, where)
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