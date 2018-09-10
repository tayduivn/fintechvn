import * as constant from './constants';
import { api } from 'utils';

// const reset = () => {
//   return {
//     type: constant.RESET,
//     payload: null
//   };
// }

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

const delFinished = (id) => {
  return {
    type: constant.DEL_FINISHED,
    payload: id
  }
}

export const fetchAll = (filter?, skip?, limit?, where?) => { 
  return (dispatch: (action) => void) => {
    dispatch(fetchStarted());
    return api.productDetail.fetchAll(filter, skip, limit, where)
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
    return api.productDetail.create(data)
      .then(obj => {
        if(obj.error)
          dispatch(fetchFailed(obj.error));
        if(obj.data)
          dispatch(fetchFinished([obj.data]));
        return obj;
      });
  };
};

export const del = (id) => {
  return (dispatch: (action: Action) => void, getState: () => GlobalState) => {
    dispatch(fetchStarted());
    return api.productDetail.del(id)
      .then(res => {
        dispatch(delFinished(id));
        return res;
      });
  }
}

export const updateById = (id, data) => { 
  return (dispatch: (action) => void) => {
    dispatch(fetchStarted());
    return api.productDetail.updateById(id, data)
      .then(obj => {
        dispatch(fetchFinished([obj.data]))
        return obj
      });
  }
}

export const uploadFile = (file, id) => {
  return (dispatch: (action) => void) => {
    
    return api.productDetail.uploadFile(file, id)
      .then(obj => {
        if(obj.data)
          dispatch(fetchFinished([obj.data]))
        return obj
      });
  }
}

export const removeFile = (name, id) => {
  return (dispatch: (action) => void) => {
    return api.productDetail.removeFile(name, id)
      .then(obj => {
        if(obj.data)
          dispatch(fetchFinished([obj.data]))
        return obj
      });
  }
}
  