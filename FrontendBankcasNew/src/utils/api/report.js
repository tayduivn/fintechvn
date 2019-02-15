// @flow

import * as base from './base';

const REPORT_BASE = `${ base.API_BASE }/reports`;

export const getReportRevenue = (data) => {
  return base.post(`${REPORT_BASE}/revenue`, data, 200)
  .then(obj => {
    return obj;
  });
}