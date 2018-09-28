import Loadable from 'react-loadable';
import Config from './../config';
import { Loading } from '../components';

export default Loadable({
  loader    : () => import('./DashboardPage'),
  loading   : Loading,
  delay     : Config.async.delay,
  timeout   : Config.async.timeOut
});