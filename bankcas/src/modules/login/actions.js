import { api } from 'utils';

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