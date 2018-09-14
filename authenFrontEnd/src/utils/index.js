import * as localStorage from './localStorage';
import * as sessionStorage from './sessionStorage';

import * as user from './api/users';
import * as email from './api/email';

export const api = {
  user,
  email
}

export { localStorage, sessionStorage };