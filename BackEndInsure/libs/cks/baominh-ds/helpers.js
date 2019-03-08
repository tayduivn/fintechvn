const Vec2 = require('./vector/vec2');

const fonts = {
  name : {
    Time : `${__dirname}/fonts/TIMES.TTF`,
    TimeBold : `${__dirname}/fonts/TIMESBD.TTF`,
    TimeItalic : `${__dirname}/fonts/timesi.ttf`
  },
  size : {
    superSmall : 9,
    small : 10,
    normal : 12,
    rather : 18,
    medium : 20,
    large : 25
  }
};

const color = {
  normal : '#000',
  border : '#888',
  background : '#e0e0e0',
  headerBg : '#f00',
  headerTxt : '#fff',
  tableBg : '#fff'
};


const pdfConfig = {
  size : 'A4',
  sizePixel : { width : 595, height : 1119 },
  layout : 'portrait',
  fillColor : '#333',
  fontSize : 13,
  margin : 10,
}

exports.fonts = fonts;
exports.color = color;
exports.pdfConfig = pdfConfig;

/**
 * Add colon for value
 * @param text String
 * @return ':' + text
 */
exports.addColon = function(text = ''){
  return ': ' + text;
}

/**
 * Return options for .textAt() method position of PDFSign class with normal text
 * @param Number x : position X of text
 * @param Number y : position Y of text
 * @param Object options : other options for return
 * @return Object options
 */
exports.optionsTextAtNormal = function(x = 0, y = 0, options = {}){
  return {
    startAt : Vec2(x, y),
    font : { size : fonts.size.normal, name : fonts.name.Time },
    color : color.normal,
    ...options
  }
}

/**
 * Return options for .textAt() method position of PDFSign class with small text
 * @param Number x : position X of text
 * @param Number y : position Y of text
 * @param Object options : other options for return
 * @return Object options
 */
exports.optionsTextAtSmall = function(x = 0, y = 0, options = {}){
  return {
    startAt : Vec2(x, y),
    font : { size : fonts.size.small, name : fonts.name.TimeItalic },
    color : color.normal,
    ...options
  }
}

/**
 * Return options for .textAt() method position of PDFSign class with normal bold text
 * @param Number x : position X of text
 * @param Number y : position Y of text
 * @param Object options : other options for return
 * @return Object options
 */
exports.optionsTextAtNormalB = function(x = 0, y = 0, options = {}){
  return {
    startAt : Vec2(x, y),
    font : { size : fonts.size.normal, name : fonts.name.TimeBold },
    color : color.normal,
    ...options
  }
}

exports.optionsTextJoinSmall = function(position){
  return {
    position, color : color.normal,
    font : { size : fonts.size.small, name : fonts.name.TimeItalic }
  }
}

/**
 * Return array params for .boxBorder() method of PDFSign class
 * @param Number x : position X of box
 * @param Number y : position Y of box
 * @param Number height : height of box
 * @param StringColor background : background color of box
 * @return Array params
 */
exports.optionsBox = function(x = 0, y = 0, height = 0, box = 0, background = color.background){
  return {
    color : background,
    startAt : Vec2(x, y),
    size : { width : pdfConfig.sizePixel.width - 60, height },
    box,
    border : { color : color.border, width : 1 }
  };
}
