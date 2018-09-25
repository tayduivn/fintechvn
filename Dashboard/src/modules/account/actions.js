import * as constant from './constants';
import { api } from 'utils';
import { actions as sessionActions } from 'modules/session';

const fetchFinished = (data: any): Action => {
  return {
    type: constant.FETCH_FINISHED,
    payload: data
  };
};

const start = () => {
  return {
    type: constant.FETCH_STARTED
  };
}

const updateFail = () => {
  return {
    type: constant.UPDATE_FAILED
  };
}

export const resetProfile = () => {
  return {
    type: constant.RESET
  };
}

export const getUserInToken = (token) => {
  return (dispatch: (acction) => void) => {
    return api.user.getUserInToken(token)
      .then(res => {
        if (res.data != null)
          dispatch(fetchFinished(res.data));
        return res;
      });
  };
};

export const signOut = (token) => {
  return (dispatch: (acction) => void) => {
    return api.user.signOut(token)
      .then(res => {
        if (res.data != null)
          dispatch(resetProfile());
        return res;
      });
  };
};

export const updateUserById = (data, id) => {
  return (dispatch: (acction) => void) => {
    dispatch(start());
    return api.user.updateUserById(data, id)
      .then(res => {
        if (res.data != null){
          dispatch(fetchFinished(res.data));
          if(undefined !== data.password){
            dispatch(resetProfile());
            sessionActions.resetSession();
          }
        } else dispatch(updateFail());
        return res;
      });
  };
}

export const login = (email, password) => {
  return () => {
    return api.user.login(email, password)
    .then(res => res)
  }
}

export const forgotPassword = (email) => {
  return () => {
    return api.user.forgotPassword(email)
    .then(res => res)
  }
}

export const sendEmail = (data) => {
  return () => {
    return api.email.sendEmail(data)
    .then(res => res)
  }
}

export const checkToken = (token) => {
  return () => {
    return api.user.checkToken(token)
      .then(res => res);
  }
  
}

export const accessForgotPassword = (data) => {
  return () => {
    return api.user.accessForgotPassword(data)
      .then(res => res);
  }
} 