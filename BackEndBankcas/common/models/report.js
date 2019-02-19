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
  					let re 	= await this.getCharPolicy(body);
  					data 		= re.data;
  					error 	= re.error;
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

		let { month, year, quarter } = d;

		let wheres 		= [];
		let labels 		= [];
		let _all 			= [];
		let _new 			= [];
		let _pen 			= [];
		let _com 			= [];

		let agency_id = Report.app.userCurrent.__data.agency.id;

		let isY = !!year && /^\d{4}$/.test(year);
		let isQ = !!quarter && /^[1, 2, 3, 4]$/.test(quarter);
		let isM = !!month && /^\d{1,2}$/.test(month);

		let res = null;
		if( !!isY && !isQ && !isM ) 				res = whereTime(year);
		else if( !!isY && !!isQ && !isM ) 	res = whereTime(year, quarter);
		else if( !!isY && !!isQ && !!isM 
			&& (new RegExp(`^[${fun.getMonthInQuarter(quarter).toString()}]$`)).test(month)
			) res = whereTime(year, quarter, month);

		if(!!res){
			error = null;
			data = {
				labels: res.labels,
				datasets : {}
			};

			for(let where of res.wheres){
				where = { ...where, agency_id};

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
  	
  	return {data, error};
  }

};

function whereTime(year, quarter, month){
	let wheres = [];
	let labels = [];

	if(!!year && !quarter && !month){
		for(let i = 1; i <= 12; ++i){
			let fTime        = `${i >= 10 ? i : ("0" + i)}-${year}`;
			let ddEnd 			 = fun.getLastDate(i, year);

			let timeStar = `${i}-01-${year} 00:00:00`;
			let timeEnd  = `${i}-${ddEnd}-${year} 23:59:59`;

			timeStar 	= new Date(timeStar).getTime();
			timeEnd 	= new Date(timeEnd).getTime();
			
			labels.push(fTime);

			wheres.push({ create_at: { between: [timeStar, timeEnd] } })
		}
	} else if(!!year && !!quarter && !month){
		for(let m of fun.getMonthInQuarter(quarter)){
	
			let fTime        = `${m >= 10 ? m : ("0" + m)}-${year}`;
			let ddEnd 			 = fun.getLastDate(m, year);

			let timeStar = `${m}-01-${year} 00:00:00`;
			let timeEnd  = `${m}-${ddEnd}-${year} 23:59:59`;

			timeStar 	= new Date(timeStar).getTime();
			timeEnd 	= new Date(timeEnd).getTime();
			
			labels.push(fTime);
			wheres.push({ create_at: { between: [timeStar, timeEnd] } });
		}
	} else if(!!year && !!quarter && !!month){
		let lastM = fun.getLastDate(month, year);

		for(let i = 1; i <= lastM; ++i){
			let fTime        = `${month}-${i}-${year}`;

			let timeStar = `${fTime} 00:00:00`;
			let timeEnd  = `${fTime} 23:59:59`;

			timeStar 	= new Date(timeStar).getTime();
			timeEnd 	= new Date(timeEnd).getTime();

			labels.push(`${i >= 10 ? i : ("0" + i)}-${month >= 10 ? month : ("0" + month)}-${year}`);
			wheres.push({ create_at: { between: [timeStar, timeEnd] } });
		}
	}

	return {wheres, labels};
}
