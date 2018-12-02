// @flow

import Loadable from 'react-loadable';
import Config from 'config/config';
import { Loading } from 'components';

export default Loadable({
  loader: () => import('./CarType'),
  loading: Loading,
  delay: Config.async.delay,
  timeout: Config.async.timeOut
});