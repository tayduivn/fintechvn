export function getJsonFromSearch(search) {
  search = search.substr(1);
  var result = {};
   search.split("&").forEach(function(part) {
    var item = part.split("=");
    result[item[0]] = decodeURIComponent(item[1]);
  });
  return result;
}

export const isEmpty = function (input) {
  if(!input) return true;
  if ('push' in input) {
    return input.length === 0;
  }
  return !input || Object.keys(input).length === 0;
}

export const rmv = (str) => {
  if(undefined === str || str == null || str === "") return "";
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
  str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
  str = str.replace(/đ/g,"d");
  str = str.replace(/([^\w]+)|\s+/g,"-");
  str = str.replace(/[-+]/g,"-");
  str = str.replace(/^-+/g,"");
  str = str.replace(/-+$/g,""); 
  return str;
}

export const isFnStatic = function(fun, ...params){
  return true;
  // return !!fun && fun in window && window[fun] instanceof Function && window[fun](...params);
}

export const monthNumToName = (num) => {
  if(!num) return '';

  var months = [
    'January', 'February', 'March', 'April', 'May',
    'June', 'July', 'August', 'September',
    'October', 'November', 'December'
    ];

  return months[num - 1] || '';
}

export const arrayNumFrom = (begin, end) => {
  let arr = [];
  for(let i = begin; i <= end; i++) arr.push(i);
  return arr;
}

export const getTime = (time, currency) => {
  time = time || Date.now();
  
  let fullDate = new Date(time);

  switch(currency){
    case 'mm':
      let mm   = fullDate.getMonth() + 1;
      return (mm < 10 ) ? `0${mm}` : mm;
    case 'dd':
      let dd   = fullDate.getDate();
      return (dd < 10 ) ? `0${dd}` : dd;
    case 'yyyy': return fullDate.getFullYear();
    default: return '';
  }
}

export const getLastDate = (m, y) => {
  if(isNaN(m) || m < 1 || m > 12) return null;
  if( !(/^\d{4}$/.test(y)) ) return null;

  var d = new Date(y, m, 0);

  return d.getDate();
}

export const getTimeNextDay = (date, num = 1) => {
  let timeOneDay = 24*60*60*1000;
  num = num > 0 ? num : 1;
  return date + timeOneDay * num;
}

export const getMonthInQuarter = (num) => {
  num = !isNaN(num) ? parseInt(num, 10) : 0;

  switch (num) {
    case 1: return [1, 2, 3];
    case 2: return [4, 5, 6];
    case 3: return [7, 8, 9];
    case 4: return [10, 11, 12];
    default: return [];
  }
}
