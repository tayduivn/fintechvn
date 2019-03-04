

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
