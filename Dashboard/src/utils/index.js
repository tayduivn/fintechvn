import * as localStorage from './localStorage';
import * as sessionStorage from './sessionStorage';

import * as user from './api/users';
import * as email from './api/email';
import * as agency from './api/agency';
import * as channel from './api/channel';

export const api = {
  user,
  email,
  agency,
  channel
}

export { localStorage, sessionStorage };