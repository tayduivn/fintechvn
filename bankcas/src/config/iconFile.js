import microsoft_word_icon from './icon/microsoft-word-icon.jpg';
import icon_pdf_png from './icon/icon-pdf.png';
import excel_icon from './icon/excel_icon.png';
import txt_icon from './icon/txt_icon.jpg';
import file from './icon/file.png';

export default  (type) => {
  switch (type){
    case "application/msword":
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return microsoft_word_icon;
    case "application/pdf":
    case "application/x-pdf":
    case "applications/vnd.pdf":
      return icon_pdf_png;
    case "application/vnd.ms-excel":
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      return excel_icon;
    case "text/plain":
      return txt_icon;
    default:
      return file;
  }
}