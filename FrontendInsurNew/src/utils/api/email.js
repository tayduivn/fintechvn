
import * as base from './base';

const EMAIL = `${ base.API_BASE }/emails`;


export const sendEmail = (data) => {
  let url = `${EMAIL}/sendEmail`;

  return base.post(url, data, 200)
    .then(obj => {
      return obj;
    });
}