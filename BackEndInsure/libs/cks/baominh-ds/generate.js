const data = {
  policyNo : 'XCG-P00000053',
  page1 : {
    policyInformation : {
      bestCode : '6569494',
      companyName : 'TỔNG CÔNG TY CỔ PHẦN BẢO MINH\n: BẢO MINH GIA ĐỊNH (MÃ SỐ: 90)',
      agency : 'Ngân hàng Maritime Bank TP. Hồ Chí Minh'
    },
    policyHolder : {
      policyHolder : 'Nguyễn Văn Cảnh',
      address : '1234 Đ. Bạch Đằng, P14, Q. Bình Thạnh, TP. HCM',
      idTaxNo : ''
    },
    periodInsurance : {
      from : '11-01-2019',
      to : '11-01-2020'
    },
    dateProposal : '11-01-2019',
    premium : {
      compulsory : '0 VNĐ',
      voluntary : '819,000.00 VNĐ',
      total : '819,000.00 VNĐ',
      vat : '81,900.00 VNĐ',
      totalVat : '900,900.00 VNĐ'
    },
    riskDetail : {
      typeCover : 'Bảo hiểm tự nguyện vật chất xe',
      regnNo : 'VF77180',
      chassisNo : '',
      engineNo : '',
      typeUse : 'Kinh doanh vận tải',
      makeModel : 'TOYOTA LUXURY',
      yearManufacture : '2017',
      seating : '9',
      carValue : '2,000,000,000 VNĐ',
      sumInsured : '1,500,000,000 VNĐ'
    },
    inheritorInformation : {
      inheritor : 'Ngân hàng Maritime Bank - TP. Hồ Chí Minh',
      address : '150 Cách Mạng Tháng 8, Quận 3, TPHCM',
      taxId : '123456789'
    },
    listCoverage : {
      compulsoryCoverage : {
        value : '0 VNĐ',
        childList : {
          thirdPartyBodilyInjury : {
            sumInsured : '0 VNĐ',
            passengerWeight : '',
            premium : ''
          },
          thirdPartyPropertyDamage : {
            sumInsured : '0 VNĐ',
            passengerWeight : '',
            premium : ''
          },
          passengerBodilyInjury : {
            sumInsured : '0 VNĐ',
            passengerWeight : '',
            premium : ''
          },
          motorCertificate : {
            sumInsured : '',
            passengerWeight : '',
            premium : ''
          },
        }
      },
      voluntaryCoverage : {
        value : '',
        childList : {
          physicalDamage : {
            sumInsured : '0 VNĐ',
            passengerWeight : '',
            premium : ''
          },
          deductible : {
            sumInsured : '0.00',
            passengerWeight : '',
            premium : ''
          }
        }
      },
      additionalCoverage : {
        value : '',
        childList : {
          newReplacementy : {
            sumInsured : '56,000,000.00 VNĐ',
            passengerWeight : '',
            premium : '50,400.00 VNĐ'
          },
          approvedRepairer : {
            sumInsured : '56,000,000.00 VNĐ',
            passengerWeight : '',
            premium : '50,400.00 VNĐ'
          },
          causedByWater : {
            sumInsured : '56,000,000.00 VNĐ',
            passengerWeight : '',
            premium : '50,400.00 VNĐ'
          },
          robberyVehicle : {
            sumInsured : '56,000,000.00 VNĐ',
            passengerWeight : '',
            premium : '100,800.00 VNĐ'
          }
        }
      }
    }
  },
  page2 : {
    payment : {
      duePaymentDate : {
        dueDate : '11-01-2019',
        paymentDate : '11-01-2020'
      },
      premium : '819,000.00 VNĐ',
      vat : '81,900.00 VNĐ',
      amountPayable : '900,900.00 VNĐ',
      total : {
        premium : '819,000.00 VNĐ',
        vat : '81,900.00 VNĐ',
        amountPayable : '900,900.00 VNĐ'
      }
    }
  }
};

const Sign = require('./index');
new Sign(data, __dirname + '/demo-baominh-pdf.pdf');

// const BaoMinh = require('./baominh');
// new BaoMinh(data).generate().write(__dirname + '/demo-baominh-pdf.pdf');