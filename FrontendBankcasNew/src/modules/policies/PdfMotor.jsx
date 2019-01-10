import React, { Component, Fragment } from 'react';

import './pdf.css';
import logo from './logo-baominh.png';
import { formatPrice, convertDMY } from 'utils/format';

class PdfMotor extends Component {
  _policiesPrint  = null;
  

  componentDidMount(){
    if(!!this.props.printData && !!this._policiesPrint) this.props.printData(this._policiesPrint, this.props.dataPrint);
  }

  render() {
    let { working, dataPrint, provision } = this.props;
    
    if(!dataPrint) return null;

    let detail = !!dataPrint.detail ? dataPrint.detail : {};
    let _sttBHTN        = 1;

    return (
      <div  id="tool" className={`tool ${!!working ? "loading": ""}`}>

        <div style={{ opacity: 0 }} >
          <div style={{width: '794px', margin: 'auto', zIndex: '-1'}} ref={e => this._policiesPrint = e }>
            <div className="paper A4">
              <header className="header">
                <table>
                  <tbody>
                    <tr>
                      <td className="w-90">
                        <div className="fs-10 fw-bold cl-white bg-red p-5">ISO 9001 : 2000</div>
                      </td>
                      <td className="w-80 ta-center">
                        <img alt={logo} className="w-70" src={logo} />
                      </td>
                      <td>
                        <div className="cl-red fw-bold fs-18 p-0-5">TỔNG CÔNG TY CỔ PHẦN BẢO MINH</div>
                        <div className="cl-red fw-bold fs-28 p-0-5">BẢO MINH</div>
                        <div className="fs-10 fw-bold cl-white bg-red p-5">26 Tôn Thất Đạm, Phường Nguyễn Thái Bình, Quận 1, Thành phố Hồ Chí Minh - ĐT: 84.8.38294180</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </header>
              <div className="name ta-center fs-28 fw-bold">ĐƠN BẢO HIỂM</div>
              <div className="info">
                <table>
                  <tbody>
                    <tr className="bg-gray">
                      <td className="wp-40">
                        <p className="fw-bold fs-15">THÔNG TIN ĐƠN BẢO HIỂM/</p>
                        <p className="fs-12 fi-italic">POLICY INFORMATION</p>
                      </td>
                      <td>
                        <table>
                          <tbody>
                            <tr>
                              <td className="wp-30 p-0 pb-8">
                                <p>Số Đơn Bảo Hiểm/</p>
                                <p className="fs-12 fi-italic">Policy NO.</p>
                              </td>
                              <td className="p-0 pb-8">
                                <p>: XCG-P00000053</p>
                              </td>
                            </tr>
                            <tr>
                              <td className="p-0 pb-8">
                                <p>BEST code</p>
                              </td>
                              <td className="p-0 pb-8">
                                <p>: {!!dataPrint.code ? dataPrint.code : ""}</p>
                              </td>
                            </tr>
                            <tr>
                              <td className="p-0 pb-8">
                                <p>Tên công ty</p>
                                <p className="fs-12 fi-italic">Company name</p>
                              </td>
                              <td className="p-0 pb-8">
                                <p>: TỔNG CÔNG TY CỔ PHẦN BẢO MINH</p>
                                <p>: BẢO MINH GIA ĐỊNH (MÃ SỐ: 90)</p>
                              </td>
                            </tr>
                            <tr>
                              <td className="p-0">
                                <p>Nơi cấp đơn</p>
                                <p className="fs-12 fi-italic">Agency</p>
                              </td>
                              <td className="p-0">
                                <p>: { !!dataPrint.agency && !!dataPrint.agency.name ? dataPrint.agency.name : "" }</p>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td className="b-none">
                        <p>Người được bảo hiểm</p>
                        <p className="fs-12 fi-italic">Policy Holder</p>
                      </td>
                      <td className="b-none">: {!!detail.nameCustomer ? detail.nameCustomer : ""}</td>
                    </tr>
                    <tr>
                      <td className="b-none">
                        <p>Địa chỉ/<span className="fs-12 fi-italic">Address</span></p>
                      </td>
                      <td className="b-none">: {!!detail.addressCustomer && !!detail.addressCustomer.addressFull ? detail.addressCustomer.addressFull : ""}</td>
                    </tr>
                    <tr>
                      <td>
                        <p>CMND/Mã số thuế/</p>
                        <p className="fs-12 fi-italic">ID No./Tax No.</p>
                      </td>
                      <td>: {!!detail.tax_number ? detail.tax_number : ""}</td>
                    </tr>
                    <tr>
                      <td>
                        <p>Thời hạn bảo hiểm/</p>
                        <p className="fs-12 fi-italic">Period of Insurance</p>
                      </td>
                      <td>
                        <p>
                          <span>: Từ/</span> 
                          <span className="fs-12 fi-italic">From</span> 
                          <span className="ml-5">{!!dataPrint.startDay ? convertDMY(dataPrint.startDay, '-') : ""}</span> 
                          <span className="ml-5">Đến/</span> 
                          <span className="fs-12 fi-italic">To </span> 
                          <span>{!!dataPrint.endDay ? convertDMY(dataPrint.endDay, '-') : ""}</span>
                        </p>
                        <p>(Bao gồm cả hai ngày này/<span className="fs-12 fi-italic">Both Dates Inclusive</span>)</p>
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <p>Ngày yêu cầu bảo hiểm/</p>
                        <p className="fs-12 fi-italic">Date of proposal and declaration</p>
                      </td>
                      <td>
                        <p> 
                          <span className="ml-5">{!!dataPrint.create_at ? convertDMY(dataPrint.create_at, '-') : ""}</span> 
                        </p>
                      </td>
                    </tr>

                    <tr className="bg-gray">
                      <td colSpan={2}>
                        <p>
                          <span className="fw-bold">PHÍ BẢO HIỂM (đã được làm tròn)</span>/ 
                          <span className="fs-12 fi-italic">PREMIUM (Rounded)</span>
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td className="b-none">
                        <p>Phí bảo hiểm bắt buộc/</p>
                        <p className="fs-12 fi-italic">Compulsory premium</p>
                      </td>
                      <td className="b-none">
                        <p>: { !!detail.tnds && !!detail.tnds.feeTnds ? formatPrice(detail.tnds.feeTnds) : 0} VNĐ</p>
                      </td>
                    </tr>
                    <tr>
                      <td className="b-none">
                        <p>Phí bảo hiểm tự nguyện/</p>
                        <p className="fs-12 fi-italic">Voluntary premium</p>
                      </td>
                      <td className="b-none">
                        <p>: {
                          (() => {
                            let { price, connguoi, hanghoa, priceMore, disPrice } = detail;
                            connguoi  = !!connguoi && !!connguoi.sumFee ? connguoi.sumFee: 0;
                            hanghoa   = !!hanghoa && !!hanghoa.fee ? hanghoa.fee: 0;
                            priceMore = !!priceMore ? priceMore : 0;
                            disPrice  = !!disPrice ? disPrice : 0;
                            return formatPrice(price +  connguoi + hanghoa + priceMore - disPrice);
                          })()
                        } VNĐ</p>
                      </td>
                    </tr>
                    <tr>
                      <td className="b-none">
                        <p>Tổng phí bảo hiểm chưa thuế/</p>
                        <p className="fs-12 fi-italic">Total Premium</p>
                      </td>
                      <td className="b-none">
                        <p>: { !!detail.sumPrice ? formatPrice(detail.sumPrice) : 0} VNĐ</p>
                      </td>
                    </tr>
                    <tr>
                      <td className="b-none">
                        <p>
                          <span>Thuế/</span>
                          <span className="fs-12 fi-italic">VAT</span>
                        </p>
                      </td>
                      <td className="b-none">
                        <p>: { !!detail.priceVAT ? formatPrice(detail.priceVAT) : 0} VNĐ</p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p>Tổng phí bảo hiểm phải trả (bao gồm thuế GTGT)/</p>
                        <p className="fs-12 fi-italic">Total Payable incl.VAT</p>
                      </td>
                      <td>
                        <p>: { !!dataPrint.price ? formatPrice(dataPrint.price) : 0} VNĐ</p>
                      </td>
                    </tr>
                    <tr className="bg-gray">
                      <td colSpan={2}>
                        <p>
                          <span className="fw-bold">THÔNG TIN CHI TIẾT VỀ ĐỐI TƯỢNG ĐƯỢC BẢO HIỂM/</span>
                          <span className="fs-12 fi-italic">RISK DETAILS</span>
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td className="b-none">
                        <p>
                          <span>Loại hợp đồng/</span>
                          <span className="fs-12 fi-italic">Type Of Cover</span>
                        </p>
                      </td>
                      <td className="b-none">
                        <p>: Bảo hiểm tự nguyện vật chất xe</p>
                      </td>
                    </tr>
                    <tr>
                      <td className="b-none">
                        <p>
                          <span>Biển số xe/</span>
                          <span className="fs-12 fi-italic">Regn No.</span>
                        </p>
                      </td>
                      <td className="b-none">
                        <p>: {!!detail.registration_number ? detail.registration_number : ""}</p>
                      </td>
                    </tr>
                    <tr>
                      <td className="b-none">
                        <p>
                          <span>Số khung/</span>
                          <span className="fs-12 fi-italic">Chassis No.</span>
                        </p>
                      </td>
                      <td className="b-none">
                        <p>: {!!detail.chassis_number ? detail.chassis_number : ""}</p>
                      </td>
                    </tr>
                    <tr>
                      <td className="b-none">
                        <p>
                          <span>Số máy/</span>
                          <span className="fs-12 fi-italic">Engine No.</span>
                        </p>
                      </td>
                      <td className="b-none">
                        <p>: {!!detail.engine_number ? detail.engine_number : ""} </p>
                      </td>
                    </tr>
                    <tr>
                      <td className="b-none">
                        <p>Mục đích sử dụng/</p>
                        <p className="fs-12 fi-italic">Type of Use</p>
                      </td>
                      <td className="b-none">
                        <p>: { !!detail.listInfo._getCareType && !!detail.listInfo._getCareType.text ? detail.listInfo._getCareType.text : "" }</p>
                      </td>
                    </tr>
                    <tr>
                      <td className="b-none">
                        <p>
                          <span>Loại xe/</span>
                          <span className="fs-12 fi-italic">Make/Model</span>
                        </p>
                      </td>
                      <td className="b-none">
                        <p>: {!!detail.make_model ? detail.make_model : ""}</p>
                      </td>
                    </tr>
                    <tr>
                      <td className="b-none">
                        <p>Năm sản xuất/</p>
                        <p className="fs-12 fi-italic">Year of Manufacture</p>
                      </td>
                      <td className="b-none">
                        <p>: {!!detail.yearcar ? detail.yearcar : ""} </p>
                      </td>
                    </tr>
                    <tr>
                      <td className="b-none">
                        <p>Số chỗ ngồi (Bao gồm lái xe)/</p>
                        <p className="fs-12 fi-italic">Seating Cap.Driver (inch.Driver)</p>
                      </td>
                      <td className="b-none">
                        <p>
                          <span>: {!!detail.listInfo && !!detail.listInfo._getSeatsPayload && !!detail.listInfo._getSeatsPayload.name
                          ? detail.listInfo._getSeatsPayload.name : ""}</span>
                          {/* <span className="ml-30">Trọng tải/</span>
                          <span className="fs-12 fi-italic">Weight:</span>
                          <span>1 Tấn</span> */}
                        </p>
                      </td>
                    </tr>
                    {/* <tr>
                      <td className="b-none">
                        <p>
                          <span>Giá trị xe/</span>
                          <span className="fs-12 fi-italic">Car value</span>
                        </p>
                      </td>
                      <td className="b-none">
                        <p>: { !!detail.listInfo && !!detail.listInfo._getPriceCar ? formatPrice(detail.listInfo._getPriceCar.value) : 0} VNĐ</p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p>
                          <span>Số tiền bảo hiểm/</span>
                          <span className="fs-12 fi-italic">Sum insured</span>
                        </p>
                      </td>
                      <td>
                        <p>: { !!detail.listInfo && !!detail.listInfo._getPriceCar ? formatPrice(detail.listInfo._getPriceCar.value) : 0}  VNĐ</p>
                      </td>
                    </tr> */}
                    <tr>
                      <td>
                        
                      </td>
                      <td>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="sign ta-right"></div>
              <footer className="footer">
                <div className="ta-right">Trang/<span className="fs-12 fi-italic">Page</span> 1</div>
              </footer>
            </div>
            <div className="paper A4">
              <div className="name ta-center fs-28 fw-bold">ĐƠN BẢO HIỂM</div>
              <div className="info">
                <table >
                  <tbody>
                    <tr className="bg-gray">
                      <td colSpan={2}>
                        <p>Số Đơn Bảo Hiểm/: {!!dataPrint.code ? dataPrint.code : ""}</p>
                        <p className="fs-12 fi-italic">Policy NO.</p>
                      </td>
                    </tr>
                    <tr>
                      <td className="b-none">
                        <p>
                          <span>Giá trị xe/</span>
                          <span className="fs-12 fi-italic">Car value</span>
                        </p>
                      </td>
                      <td className="b-none">
                        <p>: { !!detail.listInfo && !!detail.listInfo._getPriceCar ? formatPrice(detail.listInfo._getPriceCar.value) : 0} VNĐ</p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p>
                          <span>Số tiền bảo hiểm/</span>
                          <span className="fs-12 fi-italic">Sum insured</span>
                        </p>
                      </td>
                      <td>
                        <p>: { !!detail.listInfo && !!detail.listInfo._getPriceCar ? formatPrice(detail.listInfo._getPriceCar.value) : 0}  VNĐ</p>
                      </td>
                    </tr>
                    <tr>
                      <td className="wp-40 b-none">
                        <p>
                          <span>Người thụ hưởng/</span>
                          <span className="fs-12 fi-italic">Inheritor</span>
                        </p>
                      </td>
                      <td className="b-none">
                        <p>: {!!detail.inheritor ? detail.inheritor : ""}</p>
                      </td>
                    </tr>
                    <tr>
                      <td className="b-none">
                        <p>
                          <span>Địa chỉ/</span>
                          <span className="fs-12 fi-italic">Address</span>
                        </p>
                      </td>
                      <td className="b-none">
                        <p>: {!!detail.address ? detail.address : ""}</p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p className="lh-18">
                          <span>MST/</span>
                          <span className="fs-12 fi-italic">Tax ID</span>
                        </p>
                      </td>
                      <td>
                        <p>: {!!detail.tax_amount ? detail.tax_amount : ""}</p>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={2}>
                        <p>
                          <span>QUYỀN LỢI BẢO HIỂM/</span>
                          <span className="fs-12 fi-italic">LIST OF COVERAGE</span>
                        </p>
                      </td>
                    </tr>
                    <tr className="lh-18">
                      <td>
                        <p className="lh-18">Bảo hiểm/</p>
                        <p className="fs-12 fi-italic lh-18">Coverage</p>
                      </td>
                      <td>
                        <table>
                          <tbody>
                            <tr>
                              <td className="wp-40 p-0 pb-8">
                                <span>Mức trách nhiệm/</span>
                                <span className="fs-12 fi-italic">Limits</span>
                              </td>
                              <td className="wp-30 p-0 pb-8">
                                <span>Số lượng hành khách/</span>
                                <span className="fs-12 fi-italic">Number of Passenger</span>
                              </td>
                              <td className="p-0 pb-8">
                                <span>Phí/</span>
                                <span className="fs-12 fi-italic">Premium</span>
                              </td>
                            </tr>
                            <tr>
                              <td colSpan={1} className="p-0 pb-8">
                                <p className="lh-18">Số tiền bảo hiểm/</p>
                                <p className="fs-12 fi-italic lh-18">Sum Insured</p>
                              </td>
                              <td colSpan={1} className="p-0 pb-8">
                                <p className="lh-18">Trọng tải hàng hoá (tấn)/</p>
                                <p className="fs-12 fi-italic lh-18">Good Weight (Tonne)</p>
                              </td>
                              <td></td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                    <tr className="lh-18">
                      <td className="b-none">
                        <p className="lh-18">A - Bảo hiểm bắt buộc/</p>
                        <p className="fs-12 fi-italic lh-18">Compulsory Coverage</p>
                      </td>
                      <td className="b-none">
                        <table>
                          <tbody>
                            <tr>
                              <td className="wp-40 p-0 pb-8">
                                <span>: </span>
                              </td>
                              <td className="wp-30 p-0 pb-8"></td>
                              <td className="p-0 pb-8">
                                <span>{ !!detail.tnds && !!detail.tnds.feeTnds ? formatPrice(detail.tnds.feeTnds) : 0} VNĐ</span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                    
                    <tr className="lh-18">
                      <td className="b-none">
                        <p className="lh-18"> - Thiệt hại thân thể ngưới thức ba (người/vụ)/</p>
                        <p className="fs-12 fi-italic lh-18">Third Party Bodily Injury (person/occurrence)</p>
                      </td>
                      <td className="b-none">
                        <table>
                          <tbody>
                            <tr>
                              <td className="wp-40 p-0 pb-8">
                                <span>: { !!detail.tnds && !!detail.tnds.feeTnds ? formatPrice(100000000) : 0} VNĐ</span>
                              </td>
                              <td className="wp-30 p-0 pb-8"></td>
                              <td className="p-0 pb-8">
                                <span></span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>

                    <tr className="lh-18">
                      <td className="b-none">
                        <p className="lh-18"> - Thiệt hại tài sản ngưới thức ba trong 1 vụ/</p>
                        <p className="fs-12 fi-italic lh-18">Third Party Property Damage per occurrence</p>
                      </td>
                      <td className="b-none">
                        <table>
                          <tbody>
                            <tr>
                              <td className="wp-40 p-0 pb-8">
                                <span>: { !!detail.tnds && !!detail.tnds.feeTnds ? formatPrice(100000000) : 0} VNĐ</span>
                              </td>
                              <td className="wp-30 p-0 pb-8"></td>
                              <td className="p-0 pb-8">
                                <span></span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>

                    <tr className="lh-18">
                      <td className="b-none">
                        <p className="lh-18"> - Thiệt hại thân thể hành khách (người/vụ)/</p>
                        <p className="fs-12 fi-italic lh-18">Passenger Bodily Injury (person/occurrence)</p>
                      </td>
                      <td className="b-none">
                        <table>
                          <tbody>
                            <tr>
                              <td className="wp-40 p-0 pb-8">
                                <span>: { formatPrice(0) } VNĐ</span>
                              </td>
                              <td className="wp-30 p-0 pb-8"></td>
                              <td className="p-0 pb-8">
                                <span></span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>

                    <tr className="lh-18">
                      <td className="b-none">
                        <p>
                          <span>  - Số giấy CNBH/</span>
                          <span className="fs-12 fi-italic">Motor Certificate</span>
                        </p>
                      </td>
                      <td className="b-none">
                        <p>: </p>
                      </td>
                    </tr>

                    <tr className="lh-18">
                      <td className="b-none">
                        <p>
                          <span>B - Bảo hiểm tự nguyện/</span>
                          <span className="fs-12 fi-italic">Voluntary Coverage</span>
                        </p>
                      </td>
                      <td className="b-none">
                        <p></p>
                      </td>
                    </tr>



                    <tr className="lh-18">
                      <td className="b-none">
                        <p className="lh-18"> 1 -  Thiệt hại vật chất xe trong 1 vu/</p>
                        <p className="fs-12 fi-italic lh-18">Physical Damage Insurance per occurrence</p>
                      </td>
                      <td className="b-none">
                        <table>
                          <tbody>
                            <tr>
                              <td className="wp-40 p-0 pb-8">
                                <span>: { !!detail._getPriceCar && !!detail.listInfo._getPriceCar.value ?
                                  formatPrice(detail.listInfo._getPriceCar.value) : '0,00' } VNĐ</span>
                              </td>
                              <td className="wp-30 p-0 pb-8"></td>
                              <td className="p-0 pb-8">
                                <span>{ !!detail.price ?  formatPrice(detail.price) : '0,00' } VNĐ</span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>

                    <tr className="lh-18">
                      <td className="b-none">
                        <p>
                          <span> Mức khấu trừ/</span>
                          <span className="fs-12 fi-italic">Deductible</span>
                        </p>
                      </td>
                      <td className="b-none">
                        <p>: 0,00</p>
                      </td>
                    </tr>
                    
                    {
                      !!detail.connguoi && !!detail.connguoi.price && (_sttBHTN++) && (
                        <tr className="lh-18">
                          <td className="b-none">
                            <p className="lh-18"> { _sttBHTN } -  Bảo hiểm tai nạn lái xe, phụ xe và người được chở trên xe (người/vụ)/</p>
                            <p className="fs-12 fi-italic lh-18">Driver and Passengers Accident Insurance (person/occurrence)</p>
                          </td>
                          <td className="b-none">
                            <table>
                              <tbody>
                                <tr>
                                  <td className="wp-40 p-0 pb-8">
                                    <span>: { formatPrice(detail.connguoi.price) } VNĐ </span>
                                  </td>
                                  <td className="wp-30 p-0 pb-8">
                                  {
                                    detail.connguoi.numPeo ? formatPrice(detail.connguoi.numPeo) : '0,00' 
                                  }
                                  </td>
                                  <td className="p-0 pb-8">
                                    <span>{ !!detail.connguoi.sumFee  ?  formatPrice(detail.connguoi.sumFee) : '0,00' } VNĐ </span>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      )
                    }
                    
                    {
                      !!detail.hanghoa && detail.hanghoa.numPayLoad && (_sttBHTN++) && (
                        <tr className="lh-18" style={{borderBottom: '1px solid #aaa'}}>
                            <td className="b-none">
                              <p className="lh-18"> {_sttBHTN} - Bảo hiểm TNDS của chủ xe đối với thiệt hại hàng hoá được chở trên xe (tấn/vụ)/</p>
                              <p className="fs-12 fi-italic lh-18">Cargo Liability Insurance (ton/occurrence)</p>
                            </td>
                            <td className="b-none">
                              <table>
                                <tbody>
                                  <tr>
                                    <td className="wp-40 p-0 pb-8">
                                      <span>: { formatPrice(detail.hanghoa.price) } VNĐ </span>
                                    </td>
                                    <td className="wp-30 p-0 pb-8">
                                    {
                                      detail.hanghoa.numPayLoad ? formatPrice(detail.hanghoa.numPayLoad) : '0,00' 
                                    }
                                    </td>
                                    <td className="p-0 pb-8">
                                      <span>{ !!detail.hanghoa.fee  ?  formatPrice(detail.hanghoa.fee) : '0,00' } VNĐ </span>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                      )
                    }

                    <tr>
                      <td colSpan={2} className="text"> </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="sign ta-right"></div>
              <footer className="footer">
                <div className="ta-right">Trang/<span className="fs-12 fi-italic">Page</span> 2</div>
              </footer>
            </div>

            <div className="paper A4">
              <div className="name ta-center fs-28 fw-bold">ĐƠN BẢO HIỂM</div>
              <div className="info">
                <table>
                  <tbody>
                    <tr className="bg-gray">
                      <td colSpan={3}>
                        <p>Số Đơn Bảo Hiểm/: {!!dataPrint.code ? dataPrint.code : ""}</p>
                        <p className="fs-12 fi-italic">Policy NO.</p>
                      </td>
                    </tr>
                    
                    <tr className="lh-18" >
                      <td colSpan={3} className="b-none">
                        <p className="lh-18">C - Điều khoản sửa đổi bổ sung /</p>
                        <p className="fs-12 fi-italic lh-18">Additional Coverage</p>
                      </td>
                    </tr>
                    
                    {
                      !!dataPrint.detail && !!dataPrint.detail.listInfo && !!dataPrint.detail.listInfo._getRuleExtends
                      && !!dataPrint.detail.listInfo._getRuleExtends.options
                      && Object.keys(dataPrint.detail.listInfo._getRuleExtends.options).map(e => {
                        let item = dataPrint.detail.listInfo._getRuleExtends.options[e];
                        if (!item.text) return null;

                        return (
                          <tr key={e} className="lh-18">
                            <td className="b-none wp-40">
                              <p className="lh-18"> -  {item.text}/</p>
                              <p className="fs-12 fi-italic lh-18"></p>
                            </td>
                            <td className="b-none">
                              <table>
                                <tbody>
                                  <tr>
                                    <td className="wp-40 p-0 pb-8">
                                      <span>: { !!detail.listInfo && !!detail.listInfo._getPriceCar ? formatPrice(detail.listInfo._getPriceCar.value) : 0} VNĐ</span>
                                    </td>
                                    <td className="wp-30 p-0 pb-8"></td>
                                    <td className="p-0 pb-8">
                                      <span>{!!item.fee ? formatPrice(item.fee) : 0} VNĐ</span>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        )
                      })
                    }

                    <tr className="bg-gray" style={{border: '2px solid #aaaa', borderLeftWidth: 0, borderRightWidth: 0}}>
                      <td colSpan={2} className="lh-18">
                        <p>
                          <span className="fw-bold lh-18">ĐIỀU KIỆN, ĐIỀU KHOẢN, ĐOAN KẾT VÀ SỬA ĐỔI BỔ SUNG/</span>
                          <span className="fs-12 fi-italic lh-18">MEMORANDA, CLAUSES, WARRANTIES &amp; ENDORSEMENTS</span>
                        </p>
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={2} className="lh-18 no-bd">
                        <p className="lh-18">TUÂN THỦ THEO CÁC ĐIỀU KIỆN, ĐIỀU KHOẢN, ĐOAN KẾT VÀ SỬA ĐỔI BỔ SUNG ĐÍNH KÈM/</p>
                        <p className="fs-12 fi-italic lh-18"> Subject to the Memoranda, Clauses, Warranties &amp; Endorsements attached hereto:</p>
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={2} className="lh-18 no-bd">
                        <p className="lh-18">Đơn bảo hiểm này và/hoặc (các) sửa đổi bổ sung liên quan chỉ có
                         hiệu lực khi phí bảo hiểm được thanh toán đầy đủ và đúng hạn như đã quy định 
                         trên đơn, trừ khi có thoả thuận khác bằng văn bản giữa Bảo Minh và Chủ hợp đồng/</p>
                        <p className="fs-12 fi-italic lh-18"> This policy and/or its Endorsement(s) 
                          shall be only effective when premium has been paid in full and in time as stated on 
                            this policy, or otherwise agreed in writing between Bao Minh and Policyholder.</p>
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={2} className="lh-18">
                        <p className="lh-18">Người được bảo hiểm cam kết: Bằng việc được cấp và sử dụng Đơn bảo hiểm 
                          này, người được bảo hiểm đồng ý và xác nhận đã được Bảo Minh cung cấp quy tắc, 
                           điều khoản và giải thích đầy đủ các điều kiện, điều khoản bảo hiểm, phạm vi 
                           bảo hiểm, các trường hợp loại trừ bảo hiểm có liên quan/</p>
                        <p className="fs-12 fi-italic lh-18"> Warranted: By being issued and using of this 
                          Policy, the Insured agreed and confirmed that the Insured has been fully provided 
                          the insurance rules, terms and conditions as well as explained and advised the whole 
                          relevant coverage and exclusions.</p>
                      </td>
                    </tr>

                  </tbody>
                </table>
              </div>
              <div className="sign ta-right"></div>
              <footer className="footer">
                <div className="ta-right">Trang/<span className="fs-12 fi-italic">Page</span> 3</div>
              </footer>
            </div>

            <div className="paper A4">
              <div className="name ta-center fs-28 fw-bold">ĐƠN BẢO HIỂM</div>
              <div className="info">
                <table>
                  <tbody>
                    <tr className="bg-gray">
                      <td colSpan={2}>
                        <p>Số Đơn Bảo Hiểm/: {!!dataPrint.code ? dataPrint.code : ""}</p>
                        <p className="fs-12 fi-italic">Policy NO.</p>
                      </td>
                    </tr>
                    <tr>
                      <td className="b-none">
                        <table>
                          <tbody>
                            <tr>
                              <td className="p-0">
                                <p>Kỳ thanh toán/</p>
                              </td>
                              <td className="wp-40 p-0">
                                <p>Phí bảo hiểm/</p>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                      <td className="b-none wp-40">
                        <table>
                          <tbody>
                            <tr>
                              <td className="wp-50 p-0">
                                <p>Thuế/</p>
                              </td>
                              <td className="p-0">
                                <p>Số tiền phải thanh toán/</p>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td className="b-none">
                        <table>
                          <tbody>
                            <tr>
                              <td className="p-0">
                                <table>
                                  <tbody>
                                    <tr>
                                      <td className="wp-50 p-0">
                                        <p className="fs-12 fi-italic">Due date</p>
                                      </td>
                                      <td className="p-0">
                                        <p className="fs-12 fi-italic">Payment date</p>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                              <td className="wp-40 p-0">
                                <p className="fs-12 fi-italic">Premium</p>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                      <td className="b-none wp-40">
                        <table>
                          <tbody>
                            <tr>
                              <td className="wp-50 p-0">
                                <p className="fs-12 fi-italic">VAT</p>
                              </td>
                              <td className="p-0">
                                <p className="fs-12 fi-italic">Amount payable</p>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td className="b-none">
                        <table>
                          <tbody>
                            <tr>
                              <td className="p-0">
                                <table>
                                  <tbody>
                                    <tr>
                                      <td className="wp-50 p-0">
                                        <p>{ !!dataPrint.startDay ?  convertDMY(dataPrint.startDay, '-') : ""}</p>
                                      </td>
                                      <td className="p-0">
                                        <p>{ !!dataPrint.endDay ?  convertDMY(dataPrint.endDay, '-') : ""}</p>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                              <td className="wp-40 p-0">
                                <p> { !!detail.priceVAT && !!dataPrint.price ?  formatPrice(dataPrint.price - detail.priceVAT) : ""} VNĐ</p>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                      <td className="b-none wp-40">
                        <table>
                          <tbody>
                            <tr>
                              <td className="wp-50 p-0">
                                <p>{ !!detail.priceVAT ?  formatPrice(detail.priceVAT) : ""} VNĐ</p>
                              </td>
                              <td className="p-0">
                                <p> { !!dataPrint.price ?  formatPrice(dataPrint.price) : ""} VNĐ</p>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td className="b-none">
                        <table>
                          <tbody>
                            <tr>
                              <td className="p-0">
                                <p className="fw-bold">TỔNG CỘNG</p>
                                <p className="fw-bold">(TOTAL)</p>
                              </td>
                              <td className="wp-40 p-0">
                                <p className="fw-bold">{ !!detail.priceVAT && !!dataPrint.price ?  formatPrice(dataPrint.price - detail.priceVAT) : ""} VNĐ</p>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                      <td className="b-none wp-40">
                        <table>
                          <tbody>
                            <tr>
                              <td className="wp-50 p-0">
                                <p className="fw-bold">{ !!detail.priceVAT ?  formatPrice(detail.priceVAT) : ""} VNĐ</p>
                              </td>
                              <td className="p-0">
                                <p className="fw-bold">{ !!dataPrint.price ?  formatPrice(dataPrint.price) : ""} VNĐ</p>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                    {/* <tr>
                      <td colSpan={2} className="b-none pt-30 pb-30">
                        <p>Đơn bảo hiểm bán qua Ngân hàng TMCP Bản Việt</p>
                      </td>
                    </tr> */}

                    <tr>
                      <td colSpan={2} className="lh-18 no-bd">
                        <p className="lh-18 text-up">1. {!!dataPrint.noteVCX ? dataPrint.noteVCX : ""}</p>
                        <p className="lh-18 text-up"> &nbsp; &nbsp; {!!dataPrint.noteTNDS ? dataPrint.noteTNDS : ""}</p>
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={2} className="lh-18 no-bd">
                        <p className="lh-18 text-up">2. người thụ hưởng: {!!detail.inheritor ? detail.inheritor : ""}</p>
                        <p className="lh-18 text-up"> &nbsp; &nbsp; địa chỉ: {!!detail.address ? detail.address : ""}</p>
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={2} className="lh-18 no-bd">
                        <p className="lh-18 text-up">điều khoản người thụ hưởng:</p>
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={2} className="text no-bd">
                        {
                          !!provision.a && (
                            <Fragment>
                              <div style={{width: '2%'}} className="pull-left"> a) </div>
                              <div style={{width: '95%'}} className="pull-left lh-all" dangerouslySetInnerHTML={{__html: provision.a}} />
                            </Fragment>
                          )
                        }
                        
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={2} className="text no-bd">
                        {
                          !!provision.b && (
                            <Fragment>
                              <div style={{width: '2%'}} className="pull-left"> b) </div>
                              <div style={{width: '95%'}} className="pull-left lh-all" dangerouslySetInnerHTML={{__html: provision.b}} />
                            </Fragment>
                          )
                        }
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={2} className="text no-bd">
                        {
                          !!provision.c && (
                            <Fragment>
                              <div style={{width: '2%'}} className="pull-left"> c) </div>
                              <div style={{width: '95%'}} className="pull-left lh-all" dangerouslySetInnerHTML={{__html: provision.c}} />
                            </Fragment>
                          )
                        }
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={2} className="text no-bd">
                        {
                          !!provision.d && (
                            <Fragment>
                              <div style={{width: '2%'}} className="pull-left"> c) </div>
                              <div style={{width: '95%'}} className="pull-left lh-all" dangerouslySetInnerHTML={{__html: provision.c}} />
                            </Fragment>
                          )
                        }
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={2} className="text "> </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="sign ta-right"></div>
              <footer className="footer">
                <div className="ta-right">Trang/<span className="fs-12 fi-italic">Page</span> 4</div>
              </footer>
            </div>
            <div className="paper A4">
              <div className="name ta-center fs-28 fw-bold">ĐƠN BẢO HIỂM</div>
              <div className="info">
                <table>
                  <tbody>
                    <tr className="bg-gray">
                      <td colSpan={2}>
                        <p>Số Đơn Bảo Hiểm/: {!!dataPrint.code ? dataPrint.code : ""}</p>
                        <p className="fs-12 fi-italic">Policy NO.</p>
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={2} className="lh-18 no-bd">
                        <p className="lh-18 text-up">quy định chung thuộc quy tắc bảo hiểm tự nguyện xe cơ giới ban hành kèm theo 
                          quyết định số 2288/2018-bm/xcg ngày 06 tháng 12 năm 2018 của tổng công ty cổ phần bảo minh</p>
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={2} className="lh-18 no-bd">
                        <p className="lh-18 text-up">bảo hiểm thiệt hại vật chất xe thuộc quy tắc bảo hiểm tự nguyện xe cơ giới ban hành 
                          kèm theo quyết định số 2288/2018-bm/xcg ngày 06 tháng 12 năm 2018 của tổng giám đốc tổng công ty cổ phần bảo minh</p>
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={2} className="lh-18 no-bd">
                        <p className="lh-18 text-up">Bảo hiểm tai nạn lái, phụ xe và tai nạn người ngồi trên xe thuộc quy 
                          tắc bảo hiểm tự nguyện xe cơ giới ban hành kèm theo quyết địnhsố 2288/2018-bm/xcg ngày 06 tháng 12 năm 2018 của tổng giám đốc công ty cổ phần 
                          bảo minh</p>
                      </td>
                    </tr>
                    {
                      !! detail.listInfo && !!detail.listInfo._getRuleExtends.options
                      && Object.keys(detail.listInfo._getRuleExtends.options).map(e => {
                        let item = detail.listInfo._getRuleExtends.options[e];
                        if (!item || !item.content ) return null;
                        return (
                          <tr key={e}>
                            <td colSpan={2} className="lh-18 no-bd">
                              <p className="lh-21-all text-up-all" dangerouslySetInnerHTML={{__html: item.content}}></p>
                            </td>
                          </tr>
                          )
                      })
                      
                    }
                    
                    <tr>
                      <td colSpan={2} className="text no-bd">
                        <br/>
                        <br/>
                        <br/>
                      </td>
                    </tr>

                    <tr>
                      <td className="wp-50 b-none">
                        <p className="fw-bold">NGƯỜI ĐƯỢC BẢO HIỂM (HOẶC ĐẠI DIỆN)/</p>
                        <p className="fs-12 fi-italic">POLICY HOLDER (AUTHORIZED PARTY)</p>
                      </td>
                      <td className="b-none">
                        <p className="fw-bold ta-center">TỔNG CÔNG TY CỔ PHẦN BẢO MINH</p>
                        <p className="fs-12 fi-italic ta-center">BAO MINH INSURANCE CORPORATION</p>
                        <table>
                          <tbody>
                            <tr>
                              <td className="p-0" style={{verticalAlign: 'top'}}>
                                <p className="sign text-up text-center">Tổng công Bảo Minh gia định</p>
                                <p className="sign text-up text-center">Baominh giadinh</p>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={2} className="text no-bd">
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={2} className="text"> </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <footer className="footer">
                <div className="ta-right">Trang/<span className="fs-12 fi-italic">Page</span>5</div>
              </footer>
            </div>
            <div className="paper A4">
              <div className="name ta-center fs-28 fw-bold">ĐƠN BẢO HIỂM</div>
              <div className="info">
                <table>
                  <tbody>
                    <tr className="bg-gray">
                      <td colSpan={2}>
                        <p>Số Đơn Bảo Hiểm/: {!!dataPrint.code ? dataPrint.code : ""}</p>
                        <p className="fs-12 fi-italic">Policy NO.</p>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={2} className="b-none">
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={2} className="b-none">
                        <p className="ta-center pb-30">Đơn bảo hiểm không được phép hủy ngang tại bất kỳ thời điểm nào trong thời hạn bảo hiểm.</p>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={2}>
                        <p className="pb-8">
                          <span className="fw-bold">LƯU Ý QUAN TRỌNG/</span>
                          <span className="fs-12 fi-italic">IMPORTANCES</span>
                        </p>
                        <p  className="lh-18">
                          <span>Các điều kiện, điều khoản, quy tắc, đoan kết, sửa đổi bổ sung, các giấy yêu cầu bảo hiểm, và các giấy yêu cầu sửa đổi bổ sung đính kèm là bộ phận cấu thành và không thể tách rời với đơn bảo hiểm này/</span>
                          <span className="fs-12 fi-italic">The attached conditions, terms, warranties, endorsement form, insurance request form, endorsement request form part this Policy Schedule.</span>
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td className="wp-40">
                        <span>Cấp bởi/</span>
                        <span className="fs-12 fi-italic">Issued by </span>
                        <span>{
                          !!dataPrint.users ? `${!!dataPrint.users.firstname ? dataPrint.users.firstname : ""} ${!!dataPrint.users.lastname ? dataPrint.users.lastname : ""}` : ""
                        }</span>
                      </td>
                      <td>
                        <span>vào ngày/</span>
                        <span className="fs-12 fi-italic">on </span>
                        <span>{ !!dataPrint.startDay ?  convertDMY(dataPrint.startDay, '-') : ""}</span>
                        <span className="ml-30">(R)</span>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={2}>
                        <span>Đơn bảo hiểm in ngày/</span>
                        <span className="fs-12 fi-italic">Policy schedule printed on </span>
                        <span>{convertDMY(Date.now(), '-')}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <footer className="footer">
                <div className="ta-right">Trang/<span className="fs-12 fi-italic">Page</span>6</div>
              </footer>
            </div>
          </div>
        </div>
      </div>
    );
  }
}



export default PdfMotor;