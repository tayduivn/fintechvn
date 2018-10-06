import React, { Component } from 'react';

class Home extends Component {

  render() {
    return (
      <div className="row">
        <div className="col-sm-12">
          <div className="rowHomeTop">
            <div className="row row-in">
              <div className="col-lg-3 col-sm-6 row-in-br row-in-br-white">
                <ul className="col-in">
                  <li>
                    <span className="circle circle-md bg-danger"><i className="ti-clipboard" /></span>
                  </li>
                  <li className="col-last">
                    <h3 className="counter text-right m-t-15 text-danger">0</h3>
                  </li>
                  <li className="col-middle">
                    <h4 className="text-white">Request</h4>
                    <div className="progress ">
                      <div className="progress-bar progress-bar-danger" role="progressbar" aria-valuenow={40} aria-valuemin={0} aria-valuemax={100} style={{width: '40%'}}>
                        <span className="sr-only">40% Complete (success)</span>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="col-lg-3 col-sm-6 row-in-br row-in-br-white  b-r-none">
                <ul className="col-in">
                  <li>
                    <span className="circle circle-md bg-info"><i className="ti-wallet" /></span>
                  </li>
                  <li className="col-last">
                    <h3 className="counter text-right m-t-15 text-info">76</h3>
                  </li>
                  <li className="col-middle">
                    <h4 className="text-white">Total Earnings</h4>
                    <div className="progress">
                      <div className="progress-bar progress-bar-info" role="progressbar" aria-valuenow={40} aria-valuemin={0} aria-valuemax={100} style={{width: '40%'}}>
                        <span className="sr-only">40% Complete (success)</span>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="col-lg-3 col-sm-6 row-in-br row-in-br-white">
                <ul className="col-in">
                  <li>
                    <span className="circle circle-md bg-success"><i className=" ti-shopping-cart" /></span>
                  </li>
                  <li className="col-last">
                    <h3 className="counter text-right m-t-15 text-success">93</h3>
                  </li>
                  <li className="col-middle">
                    <h4 className="text-white">Total Projects</h4>
                    <div className="progress">
                      <div className="progress-bar progress-bar-success" role="progressbar" aria-valuenow={40} aria-valuemin={0} aria-valuemax={100} style={{width: '40%'}}>
                        <span className="sr-only">40% Complete (success)</span>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="col-lg-3 col-sm-6  b-0">
                <ul className="col-in">
                  <li>
                    <span className="circle circle-md bg-warning"><i className="fa fa-dollar" /></span>
                  </li>
                  <li className="col-last">
                    <h3 className="counter text-right m-t-15 text-warning">83</h3>
                  </li>
                  <li className="col-middle">
                    <h4 className="text-white">Net Earnings</h4>
                    <div className="progress">
                      <div className="progress-bar progress-bar-warning" role="progressbar" aria-valuenow={40} aria-valuemin={0} aria-valuemax={100} style={{width: '40%'}}>
                        <span className="sr-only">40% Complete (success)</span>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


export default Home;