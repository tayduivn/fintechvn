import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactToExcel from 'react-html-table-to-excel';
import { translate } from 'react-i18next';
import { Line, Bar } from 'react-chartjs-2';

import { actions as productDetailActions } from 'modules/productDetail';

import { monthNumToName, arrayNumFrom, getTime, getLastDate, getMonthInQuarter, rmv, isEmpty } from 'utils/functions';
import { policies, policyBar } from './FillChar';
import { quarter } from './Data';
import { api } from 'utils';
import Item from './Item';

class Home extends Component {

  constructor(p){
    super(p);
    let yearNow   = getTime(Date.now(), 'yyyy');

    this.state = {
      policies,
      policyBar,
      yearNow,
      loading: false,
      months: [],
      keyWord   : null
    }
  }

  componentWillMount(){
    let { yearNow } = this.state;
    this.getRevenuePolicy({year: yearNow});
  }

  onChangeKeyword = () => {
    let keyWord = (!!this._keywordInput) ? this._keywordInput.value : "";
  
    if(keyWord.trim().length >= 0 && keyWord.trim().length < 200){
      keyWord = rmv(keyWord);
      this.setState({keyWord});
    }
  }

  policyChange = () => {
    let { months } = this.state;
    let body = null;
    
    let y = !!this._yearElement ? this._yearElement.value : false;
    
    if((/^\d{4}$/.test(y))){
      body = { year: y };

      let q = !!this._quarterElement ? this._quarterElement.value : 0;

      if( /^[1, 2, 3, 4]$/.test(q) ){
        body.quarter = q;

        let m = !!this._monthElement ? this._monthElement.value : 0;
        m     = parseInt(m, 10);
        m     = !!m && ( m >= 1 && m <= 12 ) ? m : 0;

        if(months.includes(m)) body.month = m
      }
    }

    if(!!body) this.getRevenuePolicy(body);


  }

  getRevenuePolicy = async (body) => {
    let { policies, policyBar } = this.state;
    let { productDetailActions, profile } = this.props;
    this.setState({loading: true});
    
    let resPol = await api.report.getReportRevenue({ type: 'policies', body});
    let resPolBar = await api.report.getReportRevenue({ type: 'policyBar', body});

    if(!!resPol.data){
      let { labels, datasets } = resPol.data;
      let { _all, _com, _new, _pen } = datasets;

      policies.labels = labels;
      policies.datasets[0].data = _all;
      policies.datasets[1].data = _new;
      policies.datasets[2].data = _com;
      policies.datasets[3].data = _pen;
    }

    if(!!resPolBar.data){
      let { labels, datasets } = resPolBar.data;
      let { _all, _com, _new, _pen } = datasets;

      policyBar.labels = labels;
      policyBar.datasets[0].data = _all;
      policyBar.datasets[1].data = _new;
      policyBar.datasets[2].data = _com;
      policyBar.datasets[3].data = _pen;
    }

    let time = this.getTimeWhere(body)
    productDetailActions.reset();
    await productDetailActions.fetchAll(
      {
        include: [
          {relation: "users", scope: { fields: { firstname: true, lastname: true }}},
          {relation: "product", scope: { fields: { name: true, type: true }}},
        ],
        order: "id DESC"
      }, 0, 0, {
          and: [
            {agency_id: profile.info.agency.id},
            {status: 3},
            {startDay: {between: time}}
          ]
        }
    );
    
    this.setState({policies, policyBar, loading: false})
    
  }

  getTimeWhere = (body) => {
    let { year, quarter, month }  = body;
    let timeStar = 0;
    let timeEnd  = 0;

    let isY = !!year && /^\d{4}$/.test(year);
		let isQ = !!quarter && /^[1, 2, 3, 4]$/.test(quarter);
    let isM = !!month && /^\d{1,2}$/.test(month);
    
    if( !!isY && !isQ && !isM ){
      let ddEnd 			 = getLastDate(12, year);
      let start = `01-01-${year} 00:00:00`;
      let end  = `12-${ddEnd}-${year} 23:59:59`;
      
      timeStar 	= new Date(start).getTime();
			timeEnd 	= new Date(end).getTime();
    } else if( !!isY && !!isQ && !isM ){
      let arrMonth  = getMonthInQuarter(quarter);
      let mMin      = Math.min(...arrMonth);
      let mMax      = Math.max(...arrMonth);
      
      let ddEnd 			 = getLastDate(mMax, year);
      let start = `${mMin}-01-${year} 00:00:00`;
      let end  = `${mMax}-${ddEnd}-${year} 23:59:59`;
      
      timeStar 	= new Date(start).getTime();
			timeEnd 	= new Date(end).getTime();
      
    } else if( !!isY && !!isQ && !!isM 
			&& (new RegExp(`^[${getMonthInQuarter(quarter).toString()}]$`)).test(month)
		){
      let ddEnd 			 = getLastDate(month, year);
      let start = `${month}-01-${year} 00:00:00`;
      let end  = `${month}-${ddEnd}-${year} 23:59:59`;

      timeStar 	= new Date(start).getTime();
			timeEnd 	= new Date(end).getTime();
    }

    return [timeStar, timeEnd]
  }

  quarterChange = () => {
    let idQ = !!this._quarterElement ? this._quarterElement.value : 0;
    idQ     = !isNaN(idQ) ? parseInt(idQ, 10) : 0;

    let months = [];

    if(!!idQ){
      for(let e of quarter){
        if(e.id === idQ) {
          months = e.months;
          break;
        }
      }
    }
    this.setState({months})
  }

  render() {

    let { yearNow, policies, loading, months, keyWord } = this.state;
    let { t, productDetail } = this.props;
    let { data, ordered }   = productDetail;

    let orderedN = ordered.filter(e => {
      let name = rmv(!!data[e].detail && !isEmpty(data[e].detail) && data[e].detail.nameCustomer ? data[e].detail.nameCustomer : "");
      return (!keyWord || name.indexOf(keyWord) !== -1);
    })

    return (
      <div className="row white-box">
        <div className={`col-md-12 col-lg-12 col-sm-12${ loading ? ' loading' : ''}`}>
          <div className="panel">
            <div className="p-10 p-b-0">
              <div className="col-md-6 pull-right">

                <div className="col-md-4">
                  <select  defaultValue={ yearNow } ref={ e=> this._yearElement = e} className="form-control">
                    {
                      arrayNumFrom(getTime(Date.now(), 'yyyy') - 5, getTime(Date.now(), 'yyyy') + 5).map(e => {
                        return <option key={e} value={e}>{e}</option>
                      })
                    }
                  </select>
                </div>

                <div className="col-md-3">
                  <select onChange={ this.quarterChange } ref={ e=> this._quarterElement = e} className="form-control">
                    <option value="0">-- Select quarter --</option>
                    {
                      quarter.map(e => {
                        return <option key={e.id} value={e.id}>{e.name}</option>
                      })
                    }
                  </select>
                </div>

                <div className="col-md-3">
                  <select ref={ e=> this._monthElement = e} className="form-control">
                  <option value="0">-- Select month --</option>
                    {
                      months.map(e => <option key={e} value={e}>{monthNumToName(e)}</option>)
                    }
                  </select>
                </div>

                <div className="col-md-2">
                  <button onClick={ this.policyChange } className="btn btn-success">Fillter</button>
                </div>

               
              </div>
              <div className="clearfix"></div>
            </div>
            
            <hr style={{marginTop: '10px'}}/>
            <div className="col-md-6" style={{height: 400}}>
              <Line data={policies} height={300} options={
                { 
                  maintainAspectRatio: false,
                  scales: {
                      yAxes: [{
                          ticks: {
                              beginAtZero:true,
                              min: 0
                          }
                        }]
                      },
                      xAxes: [
                        {
                          ticks: {
                            margin: 0,
                          }
                        }
                      ]
                }
              } />
            </div>

            <div className="col-md-6" style={{height: 400}}>
              <Bar data={this.state.policyBar} height={300} options={
                { 
                  maintainAspectRatio: false, 
                  scales: {
                      yAxes: [{
                          ticks: {
                              beginAtZero:true,
                              min: 0
                          }
                        }]
                      }
                }
              } />
            </div>
            
            <div className="clearfix"></div>
            <hr className="clearfix" style={{margin: '10px 15px 0 15px'}}/>
            <div className="col-md-12" >
              <div className="p-10 p-b-0">
                <div className="col-md-7 pull-left p-l-0">
                  <ReactToExcel
                    className   = "btn btn-info"
                    filename    = "List policies"
                    sheet       = "Sheet 1"
                    buttonText  = {t('policies:exportExcel')}
                    table       = "listPolicies" />
                    
                </div>
                <div className="col-md-5 pull-right p-r-0">
                  <form method="post" action="#" id="filter">
                    <div >
                      <div className="col-xs-12 p-r-0">
                        <input
                          onChange      = { this.onChangeKeyword }
                          placeholder   = "Enter keyword"
                          ref           = { e => this._keywordInput = e} 
                          className     = "form-control" />
                      </div>
                    </div>
                  </form>
                </div>
              <div className="clear"></div>
            </div>
              <table id="listPolicies" className="table table-hover manage-u-table">
                <thead>
                  <tr>
                    <th width="150px">{t('policies:tableCode')}</th>
                    <th>{t('policies:tableNameCus')}</th>
                    <th width="150px">{t('policies:tableBegin')}</th>
                    <th width="150px">{t('policies:tableCreateAt')}</th>
                    <th width="150px">{t('policies:tableEnd')}</th>
                    <th width="100px">{t('policies:tableProduct')}</th>
                    <th width="100px">{t('policies:tablePrice')}</th>
                    <th width="100px" >{t('policies:tableCreateAt')}</th>
                    <th width="100px" className="text-center">{t('policies:tableAction')}</th>
                  </tr>
                </thead>
                  <Item
                    data              = { data }
                    ordered           = { orderedN }/>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

let mapStateToProps = (state) => {
  let { productDetail, profile } = state;
  return { productDetail, profile };
};

let mapDispatchToProps = (dispatch) => {
  return {
    productDetailActions : bindActionCreators(productDetailActions, dispatch)
  };
};

export default translate(['policies'])(connect(mapStateToProps, mapDispatchToProps)(Home));
