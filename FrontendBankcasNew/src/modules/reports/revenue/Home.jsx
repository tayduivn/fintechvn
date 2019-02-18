import React, { Component } from 'react';
import {Line} from 'react-chartjs-2';

import { monthNumToName, arrayNumFrom, getTime } from 'utils/functions';
import { policies } from './FillChar';
import { api } from 'utils';

class Home extends Component {

  constructor(p){
    super(p);
    let monthNow  = parseInt(getTime(Date.now(), 'mm'), 10),
        yearNow   = getTime(Date.now(), 'yyyy');

    this.state = {
      policies,
      monthNow,
      yearNow,
      loading: false
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

  getRevenuePolicy = (body) => {
    let { policies } = this.state;
    this.setState({loading: true});
    api.report.getReportRevenue({ type: 'policies', body})
      .then(res => {
        let { data } = res;
        if(!!data){
          let { labels, datasets } = data;
          let { _all, _com, _new, _pen } = datasets;
          policies.labels = labels; console.log(_all)
          policies.datasets[0].data = _all;
          policies.datasets[1].data = _new;
          policies.datasets[2].data = _com;
          policies.datasets[3].data = _pen;

          this.setState({ policies })
        }
      })
      .catch(e => console.log(e))
      .finally( () => this.setState({loading: false}))
  }

  render() {

    let { yearNow, monthNow, policies, loading } = this.state;
    
    return (
      <div className="row white-box">
        <div className={`col-md-12 col-lg-12 col-sm-12${ loading ? ' loading' : ''}`}>
          <div className="panel">
            <div className="p-10 p-b-0">
              <div className="col-md-5 pull-right">
             
                <div className="col-md-5">
                  <select defaultValue={ monthNow } onChange={ this.policyChange } ref={ e=> this._monthElement = e} className="form-control">
                    {
                      [...Array(12)].map((e, i) => <option key={i} value={i+1}>{monthNumToName(i+1)}</option>)
                    }
                  </select>
                </div>

                <div className="col-md-5">
                  <select  defaultValue={ yearNow } onChange={ this.policyChange } ref={ e=> this._yearElement = e} className="form-control">
                    {
                      arrayNumFrom(getTime(Date.now(), 'yyyy') - 5, getTime(Date.now(), 'yyyy') + 5).map(e => {
                        return <option key={e} value={e}>{e}</option>
                      })
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
            <div className="col-md-12" style={{height: 400}}>
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