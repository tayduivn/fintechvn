import { api } from 'utils';

export const login = (email, password) => {
  return api.user.login(email, password)
    .then(res => res)
}

export const forgotPassword = (email) => {
  return api.user.forgotPassword(email)
    .then(res => res)
}

export const sendEmail = (data) => {
  return api.email.sendEmail(data)
    .then(res => res)
}

export const checkToken = (token) => {
  return api.user.checkToken(token)
      .then(res => res);
}

export const accessForgotPassword = (data) => {
  return api.user.accessForgotPassword(data)
      .then(res => res);
} 