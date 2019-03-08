/*
const signer = require('node-signpdf').default;
const { addSignaturePlaceholder } = require('node-signpdf/dist/helpers');
const PDFDocument = require('pdfkit');




const createPdf = (params = {
    placeholder: { reason : 'Được ký bởi: Tổng Công ty Cổ phần Bảo Minh' },
    text: '',
  }) => new Promise((resolve) => {
    const pdf = new PDFDocument({
        autoFirstPage: true,
        size: 'A4',
        layout: 'portrait',
        bufferPages: true,
    });

    pdf.info.CreationDate = '';

    //pdf.fillColor('#333').fontSize(25).moveDown().text(params.text);

    const pdfChunks = [];
    pdf.on('data', (data) => {
        pdfChunks.push(data);
    });
    pdf.on('end', () => {
        resolve(Buffer.concat(pdfChunks));
    });

    const refs = addSignaturePlaceholder({
        pdf,
        reason: 'I am the author',
        ...params.placeholder,
    });

    Object.keys(refs).forEach(key => refs[key].end());

    pdf.end();
});
*/
// signer.byteRangePlaceholder = '12345678';



const signer = require('node-signpdf').default;
const fs = require('fs');
let Contract = require('./baominh');
let data = {};
let pathFile = 'unknown.pdf';

const createPdf = function(){
  return new Promise(resolve => {
    let Contract = require('./baominh');
    let contract = new Contract(data);
    let pdf = contract.generate()
  });
}

const action = async () => {
  let contract = new Contract(data).generate();
  let pdfBuffer = await contract.getBuffer();

  const p12Buffer = fs.readFileSync(__dirname + '/baominh/baominh.key.p12');
  let pdf = signer.sign(pdfBuffer, p12Buffer, { passphrase : '12345678', asn1StrictParsing : true });
  fs.writeFileSync(pathFile, pdf);
}

module.exports = class Sign{

  constructor(content, pathname){
    data = content;
    pathFile = pathname;
    action();
  }

}