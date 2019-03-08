const Vec2 = require('../vector/vec2');
const {
  fonts, 
  color,
  pdfConfig,
  addColon, 
  optionsTextAtNormal, 
  optionsTextAtSmall,
  optionsTextAtNormalB,
  optionsBox
} = require('../helpers');

const { page1, policyNo, title } = require('./base');
let contract, data, cfg = { padding : 5, line : 2 }, imageHeight = 80, polNo = '';

function startBoxY(){
  return contract.height() + cfg.padding;
}

function endPage(){
  return contract.pageSize().height - 30;
}

function initHeader(){
  contract
    .box({ color : color.headerBg, startAt : Vec2(10, imageHeight), size : { width : 80, height : 20 } })
    .textAt(page1.header.left, { 
      startAt : Vec2(cfg.padding + 10, cfg.padding + imageHeight) ,
      color : color.headerTxt,
      font : { size : fonts.size.superSmall, name : fonts.name.TimeBold }
    })
    .image(page1.header.image, Vec2(cfg.padding + 90, 20), { height : imageHeight })
    .box({ 
      color : color.headerBg, 
      startAt : Vec2(contract.imageWidth + 100, imageHeight), 
      size : { width : contract.pageSize().width - (contract.imageWidth + 110), height : 20 } 
    })
    .textAt(page1.header.right, { 
      startAt : Vec2(contract.imageWidth + cfg.padding + 100, cfg.padding + imageHeight),
      color : color.headerTxt,
      font : { size : fonts.size.superSmall, name : fonts.name.TimeBold },
      options : { width : contract.pageSize().width - (contract.imageWidth + cfg.padding + 110) }
    })
    .textAt(page1.header.rightExtend, {
      startAt : Vec2(contract.imageWidth + cfg.padding + 100, 20),
      color : color.headerBg,
      font : { size : fonts.size.rather, name : fonts.name.TimeBold },
      options : { width : contract.pageSize().width - (contract.imageWidth + cfg.padding + 110) }
    })
    .textAt(page1.header.rightName, {
      startAt : Vec2(contract.imageWidth + cfg.padding + 100, 45),
      color : color.headerBg,
      font : { size : fonts.size.large, name : fonts.name.TimeBold }
    })
}

function initTitlePage(){
  contract.textAt(title, {
    startAt : Vec2(0, 100 + cfg.padding * 3),
    color : color.normal,
    font : { size : fonts.size.medium, name : fonts.name.TimeBold },
    options : { width : contract.pageSize().width, align : 'center' }
  })
}

function initRow_PolicyInformation(){
  let startBox = startBoxY() + cfg.padding * 2;
  contract

    .box(optionsBox(30, startBox, 112, 2, color.background))

    .textAt(page1.table.policyInfo.name.vn, optionsTextAtNormalB(30 + cfg.padding, startBox + cfg.padding))
    .textAt(policyNo.vn, optionsTextAtNormal(230, startBox + cfg.padding))
    .textAt(addColon(polNo), optionsTextAtNormal(340, startBox + cfg.padding))
    
    .textAt(page1.table.policyInfo.name.en, optionsTextAtSmall(30 + cfg.padding, current = contract.height() + cfg.line))
    .textAt(policyNo.en, optionsTextAtSmall(230, current))

    .textAt(page1.table.policyInfo.bestCode, optionsTextAtNormal(230, current = contract.height() + cfg.line))
    .textAt(addColon(data.policyInformation.bestCode), optionsTextAtNormal(340, current))

    .textAt(page1.table.policyInfo.companyName.vn, optionsTextAtNormal(230, current = contract.height() + cfg.line))
    .textAt(page1.table.policyInfo.companyName.en, optionsTextAtSmall(230, contract.height() + cfg.line))
    .textAt(addColon(data.policyInformation.companyName), optionsTextAtNormal(340, current, { options : { width : 400 } }))

    .textAt(page1.table.policyInfo.agency.vn, optionsTextAtNormal(230, current = contract.height() + cfg.line))
    .textAt(addColon(data.policyInformation.agency), optionsTextAtNormal(340, current, { options : { width : 400 } }))
    .textAt(page1.table.policyInfo.agency.en, optionsTextAtSmall(230, contract.height() + cfg.line))
}

function initRow_PolicyHolder(){
  let startBox = startBoxY();
  contract
    .textAt(page1.table.holderInfo.policyHolder.vn, optionsTextAtNormal(30 + cfg.padding, current = startBox + cfg.padding))
    .textAt(addColon(data.policyHolder.policyHolder), optionsTextAtNormal(230, current))
    .textAt(page1.table.holderInfo.policyHolder.en, optionsTextAtSmall(30 + cfg.padding,  contract.height() + cfg.line))

    .textJoin(
      page1.table.holderInfo.address.vn + page1.table.holderInfo.address.en,
      optionsTextAtNormal(
        cfg.padding + 30, current = contract.height() + cfg.line, 
        { options : { width : contract.pageSize().width - (cfg.padding + 260), continued : true } 
      }),
      optionsTextAtSmall(0, 0, { position : page1.table.holderInfo.address.vn.length })
    )
    .textAt(addColon(data.policyHolder.address), optionsTextAtNormal(230, current))

    .textAt(page1.table.holderInfo.idTaxNo.vn, optionsTextAtNormal(cfg.padding + 30, current = contract.height() + cfg.line))
    .textAt(addColon(data.policyHolder.idTaxNo), optionsTextAtNormal(230, current))
    .textAt(page1.table.holderInfo.idTaxNo.en, optionsTextAtSmall(35, contract.height() + cfg.line))

    .box(optionsBox(30, startBox, contract.height() - startBox + cfg.padding, 1, color.tableBg))
}

function initRow_PeriodInsurance(){
  let startBox = startBoxY();
  contract
    .textAt(page1.table.periodInsurance.vn, optionsTextAtNormal(cfg.padding + 30, current = startBox + cfg.padding))
    
    .textJoin(
      page1.table.periodInsurance.from.vn + page1.table.periodInsurance.from.en,
      optionsTextAtNormal(230, current, { options : { continued : true } }),
      optionsTextAtSmall(0, 0, { position : page1.table.periodInsurance.from.vn.length })
    )
    .textAt(data.periodInsurance.from, optionsTextAtNormal(280, current))
    
    .textJoin(
      page1.table.periodInsurance.to.vn + page1.table.periodInsurance.to.en,
      optionsTextAtNormal(350, current, { options : { continued : true } }),
      optionsTextAtSmall(0, 0, { position : page1.table.periodInsurance.to.vn.length })
    )
    .textAt(data.periodInsurance.to, optionsTextAtNormal(390, current))
    
    .textAt(page1.table.periodInsurance.en, optionsTextAtSmall(cfg.padding + 30, current = contract.height() + cfg.line))
    .textJoin(
      page1.table.periodInsurance.note.vn + page1.table.periodInsurance.note.en,
      optionsTextAtNormal(230, current, { options : { continued : true } }),
      optionsTextAtSmall(0, 0, { position : page1.table.periodInsurance.note.vn.length })
    )

    .box(optionsBox(30, startBox, contract.height() - startBox + cfg.padding, 1, color.tableBg))
}

function initRow_DateProposal(){
  let startBox = startBoxY();
  contract
    .textAt(page1.table.dateProposal.vn, optionsTextAtNormal(cfg.padding + 30, current = startBox + cfg.padding))
    .textAt(addColon(data.dateProposal), optionsTextAtNormal(230, current))
    .textAt(page1.table.dateProposal.en, optionsTextAtSmall(cfg.padding + 30, contract.height() + cfg.line))
    .box(optionsBox(30, startBox, contract.height() - startBox + cfg.padding, 1, color.tableBg))
}

function initRow_PremiumName(){
  let startBox = startBoxY();
  contract
    .box(optionsBox(30, startBox, 24, 2, color.background))
    .textJoin(
      page1.table.premium.vn + page1.table.premium.en,
      optionsTextAtNormalB(cfg.padding + 30, startBox + cfg.padding, { options : { continued : true } }),
      optionsTextAtSmall(0, 0, { position : page1.table.premium.vn.length })
    )
}

function initRow_PremiumInformation(){
  let startBox = startBoxY();
  contract
    // Compulsory premium
    .textAt(page1.table.premium.compulsory.vn, optionsTextAtNormal(cfg.padding + 30, current = startBox + cfg.padding))
    .textAt(addColon(data.premium.compulsory), optionsTextAtNormal(230, current))
    .textAt(page1.table.premium.compulsory.en, optionsTextAtSmall(cfg.padding + 30, contract.height() + cfg.line))
    
    // Voluntary premium
    .textAt(page1.table.premium.voluntary.vn, optionsTextAtNormal(cfg.padding + 30, current = contract.height() + cfg.line))
    .textAt(addColon(data.premium.voluntary), optionsTextAtNormal(230, current))
    .textAt(page1.table.premium.voluntary.en, optionsTextAtSmall(cfg.padding + 30, contract.height() + cfg.line))
    
    // Total premium
    .textAt(page1.table.premium.total.vn, optionsTextAtNormal(cfg.padding + 30, current = contract.height() + cfg.line))
    .textAt(addColon(data.premium.total), optionsTextAtNormal(230, current))
    .textAt(page1.table.premium.total.en, optionsTextAtSmall(cfg.padding + 30, contract.height() + cfg.line))
    
    // VAT
    .textJoin(
      page1.table.premium.vat.vn + page1.table.premium.vat.en,
      optionsTextAtNormal(cfg.padding + 30, current = contract.height() + cfg.line, { options : { continued : true } }),
      optionsTextAtSmall(0, 0, { position : page1.table.premium.vat.vn.length })
    )
    .textAt(addColon(data.premium.vat), optionsTextAtNormal(230, current))
    
    // Total VAT premium
    .textAt(
      page1.table.premium.totalVat.vn, 
      optionsTextAtNormal(cfg.padding + 30, current = contract.height() + cfg.line, { options : { width : 170 } })
    );
  let startLine = contract.height();
  contract
    .textAt(addColon(data.premium.totalVat), optionsTextAtNormal(230, current))
    .textAt(page1.table.premium.totalVat.en, optionsTextAtSmall(cfg.padding + 30, startLine + cfg.line))
  
    .box(optionsBox(30, startBox, contract.height() - startBox + cfg.padding, 1, color.tableBg))
    
}

function initRow_RiskDetailName(){
  let startBox = contract.height() + cfg.padding;
  contract
  .box(optionsBox(30, startBox, 23, 2, color.background))
    .textJoin(
      page1.table.riskDetail.name.vn + page1.table.riskDetail.name.en,
      optionsTextAtNormalB(35, startBox + cfg.padding, { options : { continued : true } }),
      optionsTextAtSmall(0, 0, { position : page1.table.riskDetail.name.vn.length })
    )    
}

function initRow_RiskDetailInformation(){
  let line = 9;
  let startBox = startBoxY();
  let startText = startBox + cfg.padding;

  for (let name in data.riskDetail){
    let heightText = contract.heightString(
      page1.table.riskDetail.detail[name].vn +
      page1.table.riskDetail.detail[name].en,
      { width : 185 }
    );

    let heightSpace = heightText + line;
    if (startText + heightSpace >= endPage()){
      contract.box(optionsBox(30, startBox - 1, startText - startBox, 1, color.tableBg));
      contract.addPage();
      startBox = startBoxY()
      startText = startBox + cfg.padding;
    }

    contract.textJoin(
      page1.table.riskDetail.detail[name].vn + page1.table.riskDetail.detail[name].en,
      optionsTextAtNormal(cfg.padding + 30, startText, { options : { width : 185, continued : true } }),
      optionsTextAtSmall(0, 0, { position : page1.table.riskDetail.detail[name].vn.length })
    );
    
    nextText = contract.height() + line;
    contract.textAt(addColon(data.riskDetail[name]), optionsTextAtNormal(230, startText))
    startText = nextText;
    
  }

  contract.box(optionsBox(30, startBox - 1, startText - startBox - cfg.padding + 1, 1, color.tableBg));

}

function initRow_InheritorInformation(){
  let line = 9;
  let startBox = startBoxY();
  let startText = startBox + cfg.padding;

  for (let name in data.inheritorInformation){
    let heightSpace = contract.heightString(
      page1.table.inheritorInformation[name].vn + 
      page1.table.inheritorInformation[name].en,
      { width : 185 }
    ) + cfg.padding;

    if (startText + heightSpace >= endPage()){
      contract.box(optionsBox(30, startBox, startText - startBox, 1, color.tableBg));
      contract.addPage();
      startBox = startBoxY()
      startText = startBox + cfg.padding;
    }

    contract
      .textJoin(
        page1.table.inheritorInformation[name].vn + page1.table.inheritorInformation[name].en,
        optionsTextAtNormal(cfg.padding + 30, startText, { options : { width : 185, continued : true } }),
        optionsTextAtSmall(0, 0, { position : page1.table.inheritorInformation[name].vn.length })
      )

    nextText = contract.height() + line;
    contract.textAt(addColon(data.inheritorInformation[name]), optionsTextAtNormal(230, startText))
    startText = nextText;
  }

  contract.box(optionsBox(30, startBox - 1, startText - startBox - cfg.padding, 1, color.tableBg));
}

function initRow_ListCoverageName(){
  let startBox = startBoxY();
  let startText = startBox;
  let heightText = contract.heightString(page1.table.listCoverage.name.vn + page1.table.listCoverage.name.en);
  
  if (startText + heightText + cfg.padding >= endPage()){
    contract.endPage();
    startBox = startBoxY();
    startText = startBox + cfg.padding;
  }

  contract
    .textJoin(
      page1.table.listCoverage.name.vn + page1.table.listCoverage.name.en,
      optionsTextAtNormal(cfg.padding + 30, startText, { options : { continued : true } }),
      optionsTextAtSmall(0, 0, { position : page1.table.listCoverage.name.vn.length })
    )
    .box(optionsBox(30, startBox - 2, heightText + cfg.padding, 1, color.tableBg))
}

function initRow_ListCoverageDescription(){
  let startBox = startBoxY();
  let heightRow1 = contract.heightString(
    page1.table.listCoverage.description.numberPassenger.vn +
    page1.table.listCoverage.description.numberPassenger.en,
    { width : 90 }
  );
  let heightRow2 = contract.heightString(
    page1.table.listCoverage.description.goodWeight.vn +
    page1.table.listCoverage.description.goodWeight.en,
    { width : 90 }
  );
  let endBox = startBox + heightRow1 + heightRow2 + cfg.padding * 2;

  if (endBox >= endPage()){
    contract.addPage();
    startBox = startBoxY();
  }

  let startText = startBox + cfg.padding;

  contract
    .textJoin(
      page1.table.listCoverage.description.coverage.vn + page1.table.listCoverage.description.coverage.en,
      optionsTextAtNormal(cfg.padding + 30, startText, { options : { continued : true } }),
      optionsTextAtSmall(0, 0, { position : page1.table.listCoverage.description.coverage.vn.length })
    )
    .textJoin(
      page1.table.listCoverage.description.limits.vn +  page1.table.listCoverage.description.limits.en,
      optionsTextAtNormal(230, startText, { options : { width : 100, continued : true } }),
      optionsTextAtSmall(0, 0, { position : page1.table.listCoverage.description.limits.vn.length })
    )
    .textJoin(
      page1.table.listCoverage.description.numberPassenger.vn +  page1.table.listCoverage.description.numberPassenger.en,
      optionsTextAtNormal(340, startText, { options : { width: 90, continued : true } }),
      optionsTextAtSmall(0, 0, { position : page1.table.listCoverage.description.numberPassenger.vn.length })
    )
  current = startBoxY();
  contract
    .textJoin(
      page1.table.listCoverage.description.premium.vn +  page1.table.listCoverage.description.premium.en,
      optionsTextAtNormal(440, startText, { options : { width : contract.pageSize().width - 475, continued : true } }),
      optionsTextAtSmall(0, 0, { position : page1.table.listCoverage.description.premium.vn.length })
    )
    .textJoin(
      page1.table.listCoverage.description.sumInsured.vn +  page1.table.listCoverage.description.sumInsured.en,
      optionsTextAtNormal(230, current, { options : { width : 100, continued : true } }),
      optionsTextAtSmall(0, 0, { position : page1.table.listCoverage.description.sumInsured.vn.length })
    )
    .textJoin(
      page1.table.listCoverage.description.goodWeight.vn +  page1.table.listCoverage.description.goodWeight.en,
      optionsTextAtNormal(340, current, { options : { width : 90, continued : true } }),
      optionsTextAtSmall(0, 0, { position : page1.table.listCoverage.description.goodWeight.vn.length })
    )
    .box(optionsBox(30, startBox - 2, startBoxY() - startBox, 1, color.tableBg))
}

function initRow_ListCoverageDetail(){
  let startBox = startBoxY();
  let startText = startBox;

  for (let name in data.listCoverage){
    let heightRow1 = contract.heightString(page1.table.listCoverage.detail[name].name.vn, { width : 185 });
    let heightRow2 = contract.heightString(page1.table.listCoverage.detail[name].name.en, { width : 185 });
    let heightRow = startBox + cfg.padding * 2 + heightRow1 + heightRow2;
    startText += cfg.padding;

    if (heightRow >= endPage()){
      if (startBox < startText - cfg.padding) contract.box(optionsBox(30, startBox - 2, startText - startBox, 1, color.tableBg))
      contract.addPage();
      startBox = startBoxY();
    }

    contract
      .textAt(page1.table.listCoverage.detail[name].name.vn, optionsTextAtNormal(cfg.padding + 30, startText))
      .textAt(addColon(data.listCoverage[name].value), optionsTextAtNormal(230, startText))
      .textAt(page1.table.listCoverage.detail[name].name.en, optionsTextAtSmall(cfg.padding + 30, contract.height() + cfg.line));

    startText = contract.height() + cfg.line;

    for (let subName in data.listCoverage[name].childList){
      let subHeight = contract.heightString(
        page1.table.listCoverage.detail[name].detail[subName].vn + 
        page1.table.listCoverage.detail[name].detail[subName].en,
        { width : 185 }
      )

      if (subHeight + cfg.line >= endPage()){
        contract
          .box(optionsBox(30, startBox - 2, startText - startBox, 1, color.tableBg))
          .addPage();

        startBox = startBoxY();
        startText = startBox + cfg.padding;
      }

      contract.textJoin(
        page1.table.listCoverage.detail[name].detail[subName].vn +  page1.table.listCoverage.detail[name].detail[subName].en,
        optionsTextAtNormal(cfg.padding + 30, startText, { options : { width : 185, continued : true } }),
        optionsTextAtSmall(0, 0, { position : page1.table.listCoverage.detail[name].detail[subName].vn.length })
      );

      let nextText = contract.height() + cfg.line;
      contract
        .textAt(addColon(data.listCoverage[name].childList[subName].sumInsured), optionsTextAtNormal(230, startText))
        .textAt(data.listCoverage[name].childList[subName].passengerWeight, optionsTextAtNormal(340, startText))
        .textAt(data.listCoverage[name].childList[subName].premium, optionsTextAtNormal(440, startText));
      
      startText = nextText;
    }
  }

  contract.box(optionsBox(30, startBox - 2, startText - startBox + cfg.padding, 1, color.tableBg))
}

function initRow_MemorandaName(){
  let startBox = startBoxY() + cfg.padding * 5;
  let startText = startBox + cfg.padding;
  let width = contract.pageSize().width - 70;
  let height = contract.heightString(page1.table.memoranda.name.vn + page1.table.memoranda.name.en, { width })

  if (startText + height + cfg.padding >= endPage()){
    contract.addPage();
    startBox = startBoxY();
    startText = startBox + cfg.padding;
  }

  contract
    .box(optionsBox(30, startBox - 1, height + cfg.padding + 2, 2, color.background))
    .textJoin(
      page1.table.memoranda.name.vn + page1.table.memoranda.name.en,
      optionsTextAtNormalB(cfg.padding + 30, startText, { options : { width, continued : true } }),
      optionsTextAtSmall(0, 0, { position : page1.table.memoranda.name.vn.length })
    )
}

function initRow_MemorandaDescription(){
  let startBox = startBoxY();
  let startText = startBox + cfg.padding;
  let width = contract.pageSize().width - 70;
  let height = contract.heightString(page1.table.memoranda.description.vn + page1.table.memoranda.description.en, { width })

  if (startText + height + cfg.padding >= endPage()){
    contract.addPage();
    startBox = startBoxY();
    startText = startBox + cfg.padding;
  }

  contract
    .textJoin(
      page1.table.memoranda.description.vn + page1.table.memoranda.description.en,
      optionsTextAtNormal(cfg.padding + 30, startText, { options : { width, continued : true } }),
      optionsTextAtSmall(0, 0, { position : page1.table.memoranda.description.vn.length })
    )
    .box(optionsBox(30, startBox - 1, height + cfg.padding * 2 + cfg.line * 2, 1, color.tableBg))
}

function initRow_MemorandaLine(){
  let startBox = startBoxY();
  let startText = startBox;
  let width = contract.pageSize().width - 70;
  let options = { width, align : 'justify' };

  for (let x in page1.table.memoranda.line){
    let heightVn = contract.heightString(page1.table.memoranda.line[x].vn, { width });
    let heightEn = contract.heightString(page1.table.memoranda.line[x].en, { width });

    if (heightVn + heightEn + cfg.line + startText + cfg.padding >= endPage()){
      if (startText > startBox) contract.box(optionsBox(30, startBox - 2, startText - startBox, 1, color.tableBg))
      contract.addPage();
      startBox = startBoxY();
      startText = startBox + cfg.padding;
    }

    contract
      .textAt(page1.table.memoranda.line[x].vn, optionsTextAtNormal(cfg.padding + 30, startText, { options }))
      .textAt(page1.table.memoranda.line[x].en, optionsTextAtSmall(cfg.padding + 30, contract.height() + cfg.line, { options }))

    startText = contract.height() + cfg.padding;
  }

  contract.box(optionsBox(30, startBox - 1, startText - startBox, 1, color.tableBg))
}

module.exports = class Page1{

  constructor(cont, policyNoVal){
    contract = cont;
    polNo = policyNoVal;
  }

  init(valueable, config){
    cfg = { ...cfg, config };
    data = valueable;

    initHeader();
    initTitlePage();

    initRow_PolicyInformation();
    initRow_PolicyHolder();
    initRow_PeriodInsurance();
    initRow_DateProposal();

    initRow_PremiumName();
    initRow_PremiumInformation();

    initRow_RiskDetailName();
    initRow_RiskDetailInformation();

    initRow_InheritorInformation();

    initRow_ListCoverageName();
    initRow_ListCoverageDescription();
    initRow_ListCoverageDetail();

    initRow_MemorandaName();
    initRow_MemorandaDescription();
    initRow_MemorandaLine();
  }

}