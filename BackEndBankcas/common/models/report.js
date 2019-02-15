'use strict';

var mess      = require('./../../errorMess/messagse.json');
var fun 			= require('./../../libs/fun.js');

module.exports = function(Report) {
	Report.revenue = async function(type, body) {
		let data 	= null;
		let error = { ...mess.DATA_NO_MATCH };
		let typeAccess = ['policies'];

		if(typeAccess.indexOf(type) !== -1 ){
			switch(type){
  			case 'policies':
  				{
  					let re = await this.getCharPolicy(body);
  					console.log(re)
  					data 	= re.data;
  					error = re.error;
  					break;
  				}
      }
		}

		if(!!error) return Promise.reject(error);
		return data;
  };

  Report.remoteMethod(
    'revenue', {
      http: {path: '/revenue', verb: 'post'},
      accepts: [
				{arg: 'type', type: 'string', required: true},
				{arg: 'body', type: 'object', required: true}
      ],
      returns: {arg: '', type: 'object', root: true}
    }
  );

  //================================ Function getCharPolicy ==============

  Report.getCharPolicy = async function(d){
  	let data 	= null;
		let error = { ...mess.DATA_NO_MATCH };

		let { month, year } = d;

		if( /^\d{1,2}$/.test(month) && /^\d{4}$/.test(year)){
			let lastM = fun.getLastDate(month, year);

			if(!!lastM){
				data = {
					labels: [],
    			datasets : {}
				}
				error = null;

				let where = { agency_id: Report.app.userCurrent.__data.agency.id };
				let _all = [];
				let _new = [];
				let _pen = [];
				let _com = [];

				for(let i = 1; i <= lastM; ++i){
					let fTime        = `${month}-${i}-${year}`;

					data.labels.push(fTime);

					let timeStar = `${fTime} 00:00:00`; // strtotime($d . ' 00:00:00' );
			    let timeEnd  = `${fTime} 23:59:59`; // strtotime($d . ' 23:59:59' );

			    timeStar 	= new Date(timeStar).getTime();
			    timeEnd 	= new Date(timeEnd).getTime();

			    where = {
			    	// ...where,
			    	and : [
			    		{create_at : {gte: timeStar}},
			    		{create_at : {lte: timeEnd}},
			    	]
			    }

			    let allC = await Report.app.models.productDetail.count({...where});
			    let newC = await Report.app.models.productDetail.count({...where, status: 0});
			    let penC = await Report.app.models.productDetail.count({...where, or: [{status: 1}, {status: 2}] });
			    let comC = await Report.app.models.productDetail.count({...where, status: 3});

			    _all.push(allC);
			    _new.push(newC);
			    _pen.push(penC);
			    _com.push(comC);
				}

				data.datasets = {_all, _new, _pen, _com};

			}
		}

  	
  	return {data, error};
  }

};
