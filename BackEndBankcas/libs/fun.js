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
    if(isNaN(m) || m < 1 || m > 12) return null;
    if( !(/^\d{4}$/.test(y)) ) return null;

    var d = new Date(y, m, 0);

    return d.getDate();
  }

};

module.exports = Functions;
