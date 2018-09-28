export function getJsonFromSearch(search) {
  search = search.substr(1);
  var result = {};
   search.split("&").forEach(function(part) {
    var item = part.split("=");
    result[item[0]] = decodeURIComponent(item[1]);
  });
  return result;
} 