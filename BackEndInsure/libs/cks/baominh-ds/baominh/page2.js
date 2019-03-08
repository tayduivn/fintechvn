const Vec2 = require('../vector/vec2');
const {
  color, 
  optionsTextAtNormal, 
  optionsTextAtNormalB, 
  optionsTextAtSmall,
  optionsBox
} = require('../helpers');

const page2 = require('./base').page2;

let 
  contract, 
  data, 
  cfg = { padding : 5, line : 2 }, 
  polNo = '', 
  startBox, 
  startText = startBox + cfg.padding,
  currentHeight;

function endPage(){
  return contract.pageSize().height - 30;
}

let initRow_PaymentInformation = function(){
  startBox = contract.height() + cfg.padding;
  startText = startBox + cfg.padding;

  contract
    .textJoin(
      page2.table.payment.duePaymentDate.name.vn + page2.table.payment.duePaymentDate.name.en,
      optionsTextAtNormal(cfg.padding + 30, startText, { options : { width : 180, continued : true } }),
      optionsTextAtSmall(0, 0, { position : page2.table.payment.duePaymentDate.name.vn.length })
    )
    .textAt(page2.table.payment.premium.vn, optionsTextAtNormal(cfg.padding + 143, startText))
    .textAt(page2.table.payment.vat.vn, optionsTextAtNormal(cfg.padding + 320, startText))
    .textAt(page2.table.payment.amountPayable.vn, optionsTextAtNormal(cfg.padding + 430, startText))

    .textJoin(
      page2.table.payment.duePaymentDate.dueDate.vn + page2.table.payment.duePaymentDate.dueDate.en,
      optionsTextAtNormal(cfg.padding + 30, current = contract.height() + cfg.line, { options : { width : 80, continued : true } }),
      optionsTextAtSmall(0, 0, { position : page2.table.payment.duePaymentDate.dueDate.vn.length })
    )
    .textJoin(
      page2.table.payment.duePaymentDate.paymentDate.vn + page2.table.payment.duePaymentDate.paymentDate.en,
      optionsTextAtNormal(cfg.padding + 120, current, { options : { width : 80, continued : true } }),
      optionsTextAtSmall(0, 0, { position : page2.table.payment.duePaymentDate.paymentDate.vn.length })
    )
    .textAt(page2.table.payment.premium.en, optionsTextAtSmall(cfg.padding + 215, current))
    .textAt(page2.table.payment.vat.en, optionsTextAtSmall(cfg.padding + 320, current))
    .textAt(page2.table.payment.amountPayable.en, optionsTextAtSmall(cfg.padding + 430, current))

    .textAt(data.payment.duePaymentDate.dueDate, optionsTextAtNormal(cfg.padding + 30, current = contract.height() + cfg.line))
    .textAt(data.payment.duePaymentDate.paymentDate, optionsTextAtNormal(cfg.padding + 120, current))
    .textAt(data.payment.premium, optionsTextAtNormal(cfg.padding + 215, current))
    .textAt(data.payment.vat, optionsTextAtNormal(cfg.padding + 320, current))
    .textAt(data.payment.amountPayable, optionsTextAtNormal(cfg.padding + 430, current))

    .textJoin(
      page2.table.payment.total.vn + page2.table.payment.total.en,
      optionsTextAtNormalB(cfg.padding + 30, current = contract.height() + cfg.line, { options : { width : 180, continued : true } }),
      optionsTextAtSmall(0, 0, { position : page2.table.payment.total.vn.length })
    )
    .textAt(data.payment.total.premium, optionsTextAtNormalB(cfg.padding + 215, current - 14))
    .textAt(data.payment.total.vat, optionsTextAtNormalB(cfg.padding + 320, current))
    .textAt(data.payment.total.amountPayable, optionsTextAtNormalB(cfg.padding + 430, current))
}

let initParagraph_Note = function(){
  let width = contract.pageSize().width - (cfg.padding + 30) * 2;
  for (let index in page2.content.note){
    let current = contract.height() + cfg.line;
    contract.textAt((+index + 1).toString(), optionsTextAtNormal(cfg.padding + 30, current));
    for (let key in page2.content.note[index]){
      contract.textJoin(
        page2.content.note[index][key].vn + page2.content.note[index][key].en,
        optionsTextAtNormal(cfg.padding + 45, current, { options : { width } }),
        optionsTextAtSmall(0, 0, { position : page2.content.note[index][key].vn.length })
      );
      current = contract.height() + cfg.line;
    }
  }
}

let initParagraph_TermsInheritor = function(){
  startText = contract.height() + cfg.line * 2;
  let width = contract.pageSize().width - (cfg.padding + 30) * 2 - 15;
  let pos = 'abcdefghijklmnopqrstuvwxyz';

  contract
    .textAt(page2.terms.name.vn, optionsTextAtNormal(cfg.padding + 30, startText, { options : { width } }))
    .textAt(page2.terms.name.en, optionsTextAtSmall(cfg.padding + 30, contract.height + cfg.line));

  startText = contract.height() + cfg.line * 2;

  for (let i in page2.terms.paragraph){
    let heightText = startText + cfg.line + contract.heightString(page2.terms.paragraph[i].vn, { width });
    
    if (heightText + cfg.line >= endPage()){
      contract.box(optionsBox(30, startBox, startText, 1, color.tableBg));
      contract.addPage();
      startBox = contract.height() + cfg.padding;
      startText = startBox + cfg.padding;
    }

    contract
      .textAt(pos[i] + ')', optionsTextAtNormal(cfg.padding + 30, startText))
      .textAt(page2.terms.paragraph[i].vn, optionsTextAtNormal(cfg.padding + 45, startText, { options : { width, align : 'justify' } }))

    if (page2.terms.paragraph[i].en.length){
      heightText = startText + cfg.line + contract.heightString(page2.terms.paragraph[i].en, optionsTextAtSmall(0, 0, {  }));

      if (heightText + cfg.line >= endPage()){
        contract.box(optionsBox(30, startBox, startText, 1, color.tableBg));
        contract.addPage();
        startBox = contract.height() + cfg.padding;
        startText = startBox + cfg.padding;
      }

      contract.textAt(page2.terms.paragraph[i].en, optionsTextAtSmall(cfg.padding + 45, startText, { options : { width, align : 'justify' } }))
    }

    startText = contract.height() + cfg.line;
  }
}

let initParagraph_Other = function(){
  let width = contract.pageSize().width - (cfg.padding + 30) * 2;
  let align = 'justify';

  for(let x in page2.terms.other){
    let heightText = startText + cfg.line + contract.heightString(page2.terms.other[x], { width });

    if (heightText >= endPage()){
      contract.box(optionsBox(30, startBox, startText, 1, color.tableBg));
      contract.addPage();
      startBox = contract.height() + cfg.padding;
      startText = startBox + cfg.padding;
    }

    contract.textAt(page2.terms.other[x], optionsTextAtNormal(cfg.padding + 30, startText, { options : { width, align } }));
    startText = contract.height() + cfg.line * 2;
  }
}

let initParagraph_Additional = function(){
  let width = contract.pageSize().width - (cfg.padding + 30) * 2;
  let align = 'justify';

  for(let x in page2.terms.additional){
    let heightText = startText + cfg.line + contract.heightString(page2.terms.additional[x], { width });

    if (heightText >= endPage()){
      contract.box(optionsBox(30, startBox - 1, startText - startBox, 1, color.tableBg));
      contract.addPage();
      startBox = contract.height() + cfg.padding;
      startText = startBox + cfg.padding;
    }

    contract.textAt(page2.terms.additional[x], optionsTextAtNormal(cfg.padding + 30, startText, { options : { width, align } }));
    startText = contract.height() + cfg.line * 2;
  }
}

let initInformationAgency = function(){
  startText += 30;
  let x = contract.pageSize().width / 2 - 20;
  contract
    .textAt(page2.sign.inheritor.vn, optionsTextAtNormalB(cfg.padding + 30, startText))
    .textAt(
      page2.sign.insurance.vn, 
      optionsTextAtNormalB(contract.pageSize().width / 2 + 10, startText, { width : x, align : 'center' })
    )
    .textAt(page2.sign.inheritor.en, optionsTextAtSmall(cfg.padding + 30, startText = contract.height() + cfg.line))
    .textAt(
      page2.sign.insurance.en, 
      optionsTextAtSmall(contract.pageSize().width / 2 + 10, startText, { width : x, align : 'center' })
    )
    .signText('Được ký bởi: CÔNG TY BẢO MINH GIA ĐỊNH', Vec2(x + 30, contract.height() + 30), false);

  contract.box(optionsBox(30, startBox - 1, endPage() - startBox, 1, color.tableBg));
}

module.exports = class Page2{

  constructor(cont, policyNoVal, detail){
    contract = cont;
    polNo = policyNoVal;
    contract.addPage();
  }

  init(valueable, config){
    cfg = { ...cfg, config };
    data = valueable;

    initRow_PaymentInformation();
    initParagraph_Note();
    initParagraph_TermsInheritor();
    initParagraph_Other();
    initParagraph_Additional();
    initInformationAgency();
  }

}