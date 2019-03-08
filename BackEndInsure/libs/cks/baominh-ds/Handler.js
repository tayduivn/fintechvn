const { addSignaturePlaceholder } = require('node-signpdf/dist/helpers');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const { fonts } = require('./helpers');

const chunk = [];
let pdf, buffer = null, currentHeight = 0;

let CFG = {
  pdf : { size : 'A4', layout : 'portrait', fontSize : 13, margin : 10, },
  page : { width : 595, height : 841 },
  logoSize : { width : 70, height : 80 },
};

const initPDF = () => new PDFDocument({ autoFirstPage: true, bufferPages: true, ...CFG.pdf });

module.exports = class Handler{

  constructor(config = { size : 'A4', layout : 'portrait', fontSize : 13, margin : 10 }){
    CFG.pdf = { ...CFG.pdf, ...config };
    pdf = initPDF();
    pdf.on('data', data => chunk.push(data));
  }

  onAddedPage(callback){
    pdf.on('pageAdded', () => {
      currentHeight = 0;
      callback();
    });
  }

  addPage(options = { ...CFG.pdf }){
    pdf.addPage(options);
    // currentHeight = 0;
    return this;
  }

  font(name){
    pdf.font(name);
    return this;
  }

  box(boxRule = {
    color : '#fff',
    startAt : { x : 0, y : 0 },
    size : { width : 0, height : 0 },
    border : { color : '#000', width : 1 }
  }){
    let dfBox = {
      color : '#000',
      startAt : { x : 0, y : 0 },
      size : { width : 0, height : 0 },
      border : { color : '#888', width : 1 },
      box : 0,
      ...boxRule
    };
    pdf.rect(dfBox.startAt.x, dfBox.startAt.y, dfBox.size.width, dfBox.size.height);
    if (dfBox.box > 0){
      pdf.lineWidth(dfBox.border.width);
      dfBox.box === 2 ? pdf.fillAndStroke(dfBox.color, dfBox.border.color) : pdf.stroke();
    }
    else pdf.fill(dfBox.color);
    return this;
  }

  image(path, startAt, size = { width : undefined, height : undefined, scale : 1 }){
    pdf.image(path, startAt.x, startAt.y, { ...size });
    let imgW = pdf._imageRegistry[path].width;
    let imgH = pdf._imageRegistry[path].height;

    if (typeof(size.width) === Number.name.toLowerCase()){
      this.imageWidth = size.width;
      this.imageHeight = Math.round(imgH * size.width / imgW);
    }
    if (typeof(size.height) === Number.name.toLowerCase()){
      this.imageHeight = size.height;
      this.imageWidth = Math.round(imgW * size.height / imgH);
    }
    return this;
  }

  heightString(str = 'A', options){
    return pdf.heightOfString(str, { ...options });
  }

  textAt(text, textRule = {
      startAt : { x, y },
      font : { size : fonts.size.normal, name : fonts.name.Time },
      color : '#000',
      options : { width : undefined, align : 'left' }
  }){
    if (text.length) pdf
      .fontSize(textRule.font.size)
      .font(textRule.font.name)
      .fillColor(textRule.color)
      .text(text, textRule.startAt.x, textRule.startAt.y, { ...textRule.options });
    currentHeight = pdf.y;
    return this;
  }

  textJoin(text, textRule = {
    startAt : { x, y },
    font : { size : fonts.size.normal, name : fonts.name.Time },
    color : '#000',
    options : { width : undefined, align : 'left', continued : true }
  }, joinRule = {
    position : 0,
    font : { size : fonts.size.normal, name : fonts.name.Time },
    color : '#000',
    moveY : 2
  }){
    joinRule = {
      position : 0,
      font : { size : fonts.size.normal, name : fonts.name.Time },
      color : '#000',
      moveY : 2,
      ...joinRule
    };
    pdf
      .fontSize(textRule.font.size)
      .font(textRule.font.name)
      .fillColor(textRule.color)
      .text(text.slice(0, joinRule.position), textRule.startAt.x, textRule.startAt.y, { ...textRule.options })
    if (text.slice(joinRule.position)){
      pdf.y += joinRule.moveY;
      pdf
        .fontSize(joinRule.font.size)
        .font(joinRule.font.name)
        .fillColor(joinRule.color)
        .text(text.slice(joinRule.position));
    }
    currentHeight = pdf.y;
    return this;
  }

  height(){
    return currentHeight;
  }

  pageSize(){
    return CFG.page;
  }

  paging(prefix){
    let { start, count } = pdf.bufferedPageRange();
    for (let i = start; i < start + count; ++i){
      pdf.switchToPage(i);
      pdf.fillColor('#000').text(prefix + ' ' + (i + 1), pdf.page.width - 100, pdf.page.height - 30);
    }
  }

  signFooter(name){
    let { start, count } = pdf.bufferedPageRange();
    for (let i = start; i < start + count - 1; ++i){
      pdf.switchToPage(i);
      this.signText(name, { x : 30, y : pdf.page.height - 30 });
    }
  }

  switchAddSign(callback){
    let { start, count } = pdf.bufferedPageRange();
    for (let i = start; i < start + count; ++i){
      pdf.switchToPage(i);
      callback(pdf);
    }
  }

  getBuffer(){
    return new Promise(resolve => {
      pdf.on('end', () => resolve(Buffer.concat(chunk)));
      const refs = addSignaturePlaceholder({
          pdf,
          reason: 'Được ký bởi: Tổng Công ty Cổ phần Bảo Minh'
      });
      Object.keys(refs).forEach(key => refs[key].end());
      pdf.end();
    });
  }

  getPDF(){
    return pdf;
  }

  signText(name, startAt, showBox = true){
    let signConfig = { fontSize : 10 };
    let maxWidth = CFG.page.width;
    let width = pdf.widthOfString(name, signConfig) + 30;
    let height = 20;

    if (width >= maxWidth){
      width = maxWidth;
      height = pdf.heightOfString(name, { width }) + 8;
    }

    if (showBox){
      this.box({
        color : '#bfefc8',
        startAt,
        size : { width, height },
        box : 2,
        border : { color : '#11c432', width : 1 }
      })
    }

    this.textAt(name, {
      startAt : { x : startAt.x + 4, y : startAt.y + 4 },
      font : { size : 10, name : `${__dirname}/fonts/TIMESBD.TTF` },
      options : { width },
      color : '#105e1f'
    })
  }

}
