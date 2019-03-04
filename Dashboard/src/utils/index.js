import * as localStorage from './localStorage';
import * as sessionStorage from './sessionStorage';

import * as user from './api/users';
import * as email from './api/email';
import * as agency from './api/agency';
import * as channel from './api/channel';
import * as groups from './api/groups';
import * as privilegeGroup from './api/privilegeGroup';
import * as privilegeModule from './api/privilegeModule';
import * as apiClient from './api/apiClient';

export const api = {
  user,
  email,
  agency,
  channel,
  groups,
  privilegeGroup,
  privilegeModule,
  apiClient
}

export { localStorage, sessionStorage };
