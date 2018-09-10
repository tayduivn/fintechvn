// @flow

import * as base from './base';

const USER = `${ base.API_BASE }/users`;

export const login = (email, password) => {
  let body = { email, password };
  let url = `${USER}/login`;

  return base.post(url, body, 200)
    .then(obj => {
      return {
        ...obj
      };
    });
}

export const forgotPassword = (email) => {
  let url = `${USER}/forgotPassword`;

  return base.post(url, {email}, 200)
    .then(obj => {
      return obj;
    });
}

export const checkToken = (token) => {
  let url = `${USER}/checkToken`;

  return base.post(url, {token}, 200)
    .then(obj => {
      return obj;
    });
}

export const accessForgotPassword = (data) => {
  let url = `${USER}/accessForgotPassword`;

  return base.post(url, data, 200)
    .then(obj => {
      return obj;
    });
}

export const getUserInToken = (token) => {
  let url = `${USER}/getUserInToken?token=${token}`;
  return base.get(url, 200)
    .then(obj => {
      return obj;
    });
}

export const signOut = (token) => {
  let url = `${USER}/signOut`;
  return base.post(url, {token}, 200)
    .then(obj => {
      return obj;
    });
}

export const updateUserById = (data, id) => {
  let url = `${USER}/${id}`;
  return base.patch(url, data, 200)
    .then(obj => {
      return obj;
    });
}