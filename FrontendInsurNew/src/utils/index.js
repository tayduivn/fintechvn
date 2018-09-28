import * as localStorage from './localStorage';
import * as sessionStorage from './sessionStorage';

import * as user from './api/users';
import * as email from './api/email';
import * as agency from './api/agency';
import * as years from './api/years';
import * as groups from './api/groups';
import * as seatsPayload from './api/seatsPayload';
import * as ruleExtend from './api/ruleExtend';

export const api = {
  user,
  email,
  agency,
  years,
  groups,
  seatsPayload,
  ruleExtend
}

export { localStorage, sessionStorage };