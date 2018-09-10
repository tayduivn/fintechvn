import { api } from 'utils';

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