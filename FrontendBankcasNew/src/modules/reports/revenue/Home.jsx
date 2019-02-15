import React, { Component } from 'react';
import {Line} from 'react-chartjs-2';

import { monthNumToName, arrayNumFrom, getTime, getLastDate } from 'utils/functions';
import { policies } from './FillChar';

class Home extends Component {

  constructor(p){
    super(p);
    let monthNow  = parseInt(getTime(Date.now(), 'mm') ),
        yearNow   = getTime(Date.now(), 'yyyy');
    let lastDay   = getLastDate(monthNow, yearNow);

    this.state = {
      policies,
      monthNow,
      yearNow,
      lastDay,
    }
  }

  policyChange = () => {
    let { yearNow, monthNow } = this.state;

    let m = !!this._monthElement ? this._monthElement.value : monthNow;
    m     = parseInt(m, 10);
    m     = !!m && ( m >= 1 && m <= 12 ) ? m : monthNow;
    
    let y = !!this._yearElement ? this._yearElement.value : false;
    
    if( !(/^\d{4}$/.test(y)) ) y = yearNow;

    let lastDay = getLastDate(m, y);

    // let time = `${}/`


  }

  render() {

    let { yearNow, monthNow } = this.state;
    console.log(monthNow);

    return (
      <div className="row white-box">
        <div className="col-md-12 col-lg-12 col-sm-12">
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
                  <button className="btn btn-success">Fillter</button>
                </div>

               
              </div>
              <div className="clearfix"></div>
            </div>
            
            <hr style={{marginTop: '10px'}}/>
            <div className="col-md-12" style={{height: 300}}>
              <Line data={this.state.policies} height={300} options={{ maintainAspectRatio: false }} />
            </div>
            
          </div>
        </div>
      </div>
    );
  }
}
export default Home;