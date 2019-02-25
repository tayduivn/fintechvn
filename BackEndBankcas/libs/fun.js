'use strict';

const Functions = {
  ucfirst: str => {
    if (!str || str.length === 0 || typeof str !== 'string') return '';
    return str[0].toUpperCase() + str.slice(1).toLowerCase();
  },
  isFun: fn => fn instanceof Function,
  isExistFun: (it, fun) => !!it && !!fun && fun in it && Functions.isFun(it[fun]),
  isEmpty: input => !input || ('push' in input && input.length === 0) || Object.keys(input).length === 0,
  isArr: input => !!input && 'push' in input,
  isObj: input => !!input && Object.keys(input).length > 0,
  getLastDate: (m, y) => {
    if (isNaN(m) || m < 1 || m > 12) return null;
    if (!(/^\d{4}$/.test(y))) return null;

    var d = new Date(y, m, 0);

    return d.getDate();
  },
  getMonthInQuarter: (num) => {
    num = !isNaN(num) ? parseInt(num, 10) : 0;

    switch (num) {
      case 1: return [1, 2, 3];
      case 2: return [4, 5, 6];
      case 3: return [7, 8, 9];
      case 4: return [10, 11, 12];
      default: return [];
    }
  },
  getTime: (currency, time) => {
    time = time || Date.now();

    let fullDate = new Date(time);

    switch (currency) {
      case 'mm':
        let mm   = fullDate.getMonth() + 1;
        return (mm < 10) ? `0${mm}` : mm;
      case 'dd':
        let dd   = fullDate.getDate();
        return (dd < 10) ? `0${dd}` : dd;
      case 'yyyy': return fullDate.getFullYear();
      default: return '';
    }
  }

};

module.exports = Functions;
