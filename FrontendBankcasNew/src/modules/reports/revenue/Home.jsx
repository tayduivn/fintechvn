import React, { Component } from 'react';
import { Line, Bar } from 'react-chartjs-2';

import { monthNumToName, arrayNumFrom, getTime } from 'utils/functions';
import { policies, policyBar } from './FillChar';
import { quarter } from './Data';
import { api } from 'utils';

class Home extends Component {

  constructor(p){
    super(p);
    let monthNow  = parseInt(getTime(Date.now(), 'mm'), 10),
        yearNow   = getTime(Date.now(), 'yyyy');

    this.state = {
      policies,
      policyBar,
      monthNow,
      yearNow,
      loading: false,
      months: []
    }
  }

  componentWillMount(){
    let { monthNow, yearNow } = this.state;

    this.getRevenuePolicy({month: monthNow, year: yearNow});
  }

  policyChange = () => {
    let { yearNow, monthNow } = this.state;

    let m = !!this._monthElement ? this._monthElement.value : monthNow;
    m     = parseInt(m, 10);
    m     = !!m && ( m >= 1 && m <= 12 ) ? m : monthNow;
    
    let y = !!this._yearElement ? this._yearElement.value : false;
    
    if( !(/^\d{4}$/.test(y)) ) y = yearNow;

    this.getRevenuePolicy({month: m, year: y});


  }

  getRevenuePolicy = async (body) => {
    let { policies } = this.state;
    this.setState({loading: true});
    
    let resPol = await api.report.getReportRevenue({ type: 'policies', body});
    
    if(!!resPol.data){
      let { labels, datasets } = resPol.data;
      let { _all, _com, _new, _pen } = datasets;

      policies.labels = labels;
      policies.datasets[0].data = _all;
      policies.datasets[1].data = _new;
      policies.datasets[2].data = _com;
      policies.datasets[3].data = _pen;
    }

    this.setState({policies, loading: false})
    
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

    let { yearNow, monthNow, policies, loading, months } = this.state;
    
    return (
      <div className="row white-box">
        <div className={`col-md-12 col-lg-12 col-sm-12${ loading ? ' loading' : ''}`}>
          <div className="panel">
            <div className="p-10 p-b-0">
              <div className="col-md-6 pull-right">

                <div className="col-md-4">
                  <select  defaultValue={ yearNow } onChange={ this.policyChange } ref={ e=> this._yearElement = e} className="form-control">
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
                  <select defaultValue={ monthNow } onChange={ this.policyChange } ref={ e=> this._monthElement = e} className="form-control">
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
            
          </div>
        </div>
      </div>
    );
  }
}
export default Home;