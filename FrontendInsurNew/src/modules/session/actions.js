import * as constant from './constants';
import { KEY_SESSION } from 'config/constants';
import { localStorage, sessionStorage } from 'utils';

export const setSession = (res, saveInfo) => {
  let { id: token, ttl, created } = res;
  let payload = {
    token,
    ttl,
    created
  };

  if(saveInfo) localStorage.saveState(KEY_SESSION, { session: payload });
  else sessionStorage.saveState(KEY_SESSION, { session: payload });

  return {
    type: constant.SET_SESSION,
    payload: {token, ttl, created }
  };
};

export const resetSession = () => {
  localStorage.deleteState(KEY_SESSION);
  sessionStorage.deleteState(KEY_SESSION);
  return {
    type: constant.RESET_SESSION,
    payload: null
  };
};