// @flow

import numeral from 'numeral';

export const numberToDateTime = (date: number, month: number, year: number): string => {
  year = numeral(year).format('0000');
  month = numeral(month).format('00');
  date = numeral(date).format('00');

  return `${ year }-${ month }-${ date }`;
}

export const dateToFornatDateTimeString = (date: Date,format:string,sperator:string): string => {
let  year = numeral(date.getFullYear()).format('0000');
let  month = numeral(date.getMonth()+1).format('00');
let day = numeral(date.getDate()).format('00');
if(format === 'ymd')
  return `${ year }${sperator}${ month }${sperator}${ day }`;
else if(format === 'dmy')
  return `${ day }${sperator}${ month }${sperator}${ year }`;
else if(format === 'mdy')
  return `${ month }${sperator}${ day }${sperator}${ year }`;
return 'unknow';
}

export const dataAndOrderToList = (data: any, ordered: Array<string>): Array<any> => {
  return ordered.map((id: string) => data[id]);
}
export const convertStringToDate = (date:string,format:string) => {
  let normalized      = date.replace(/[^a-zA-Z0-9]/g, '-');
  let normalizedFormat= format.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
  let formatItems     = normalizedFormat.split('-');
  let dateItems       = normalized.split('-');

  let monthIndex  = formatItems.indexOf("mm");
  let dayIndex    = formatItems.indexOf("dd");
  let yearIndex   = formatItems.indexOf("yyyy");
  let hourIndex     = formatItems.indexOf("hh");
  let minutesIndex  = formatItems.indexOf("ii");
  let secondsIndex  = formatItems.indexOf("ss");

  let today = new Date();

  let year  = yearIndex>-1  ? dateItems[yearIndex]    : today.getFullYear();
  let month = monthIndex>-1 ? parseInt(dateItems[monthIndex], 10) - 1 : today.getMonth() - 1;
  let day   = dayIndex>-1   ? dateItems[dayIndex]     : today.getDate();

  let hour    = hourIndex    > -1   ? dateItems[hourIndex]    : today.getHours();
  let minute  = minutesIndex > -1   ? dateItems[minutesIndex] : today.getMinutes();
  let second  = secondsIndex > -1   ? dateItems[secondsIndex] : today.getSeconds();

  let d = new Date();
  d.setFullYear(parseInt(year, 10));
  d.setMonth(parseInt(month, 10));
  d.setDate(parseInt(day, 10));
  d.setHours(parseInt(hour, 10));
  d.setMinutes(parseInt(minute, 10));
  d.setSeconds(parseInt(second, 10));
  return d;
}

export const convertDMY = (date, currency) => {
  if(!currency) currency = "-";
  let fullDate = new Date(date);

  let dd   = fullDate.getDate();
  if( dd < 10 )  dd = '0' + dd;

  let mm   = fullDate.getMonth() + 1;
  if( mm < 10 )  mm = '0' + mm;

  let yyyy   = fullDate.getFullYear();

  return dd + currency + mm + currency + yyyy;
}

export function formatPrice(n, currency) {
  if(!currency) currency = "";
  if(!n || n === 0) return 0 + ` ${currency}`;
  return n.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + currency;
}