const signer = require('node-signpdf').default;


const Handler = require('../Handler');
const Vec2 = require('../vector/vec2');

const { title, policyNo } = require('./base');
const { 
  pdfConfig, 
  fonts, 
  color, 
  addColon, 
  optionsBox, 
  optionsTextAtNormal, 
  optionsTextAtSmall 
} = require('../helpers');

let cfg = { padding : 5, line : 3 };
let page2Detail = { compulsory : {}, voluntary : {}, additional : {} };
let val, contract;

function addedPage(){
  contract.textAt(title, {
    startAt : Vec2(0, 20),
    color : color.normal,
    font : { size : fonts.size.medium, name : fonts.name.TimeBold },
    options : { width : pdfConfig.sizePixel.width, align : 'center' }
  });
    
  let heightVn = contract.heightString(policyNo.vn);
  let startBox = contract.height() + 10;

  contract
    .box(optionsBox(30, startBox, heightVn + 14, 2, color.background))
    .textAt(policyNo.vn + addColon(val.policyNo), optionsTextAtNormal(cfg.padding + 30, startBox + cfg.padding))
    .textAt(policyNo.en, optionsTextAtSmall(35, contract.height() + cfg.line));
}

function generateContract(){
  contract.onAddedPage(addedPage);

  let Page1 = require('./page1');
  new Page1(contract, val.policyNo).init(val.page1, cfg);

  let Page2 = require('./page2');
  new Page2(contract, val.policyNo, page2Detail).init(val.page2, cfg);

  contract.paging('Trang/page');
  contract.signFooter('Được ký bởi: CÔNG TY BẢO MINH GIA ĐỊNH');
}

module.exports = class Contract{

  constructor(valueable, config = { padding : 5, line : 3 }){
    cfg = { ...cfg, ...config };
    val = { ...valueable };
    contract = new Handler();
  }

  generate(){
    generateContract();
    return this;
  }

  // addCompulsory(compulsory){
  //   if (null !== compulsory && Object.name.toLowerCase() === typeof(compulsory)){
  //     page2Detail.compulsory = { ...page2Detail.compulsory, ...compulsory };
  //   }
  //   return this;
  // }

  // setCompulsory(compulsory){
  //   if (null !== compulsory && Object.name.toLowerCase() === typeof(compulsory)){
  //     page2Detail.compulsory = { ...compulsory };
  //   }
  //   return this;
  // }

  // addVoluntary(voluntary){
  //   if (null !== voluntary && Object.name.toLowerCase() === typeof(voluntary)){
  //     page2Detail.voluntary = { ...page2Detail.voluntary, ...voluntary };
  //   }
  //   return this;
  // }

  // setVoluntary(voluntary){
  //   if (null !== voluntary && Object.name.toLowerCase() === typeof(voluntary)){
  //     page2Detail.voluntary = { ...voluntary };
  //   }
  //   return this;
  // }

  // addAdditional(additional){
  //   if (null !== additional && Object.name.toLowerCase() === typeof(additional)){
  //     page2Detail.additional = { ...page2Detail.additional, ...additional };
  //   }
  //   return this;
  // }

  // setAdditional(additional){
  //   if (null !== additional && Object.name.toLowerCase() === typeof(additional)){
  //     page2Detail.additional = { ...additional };
  //   }
  //   return this;
  // }

  async getBuffer(){
    return await contract.getBuffer();
  }

}