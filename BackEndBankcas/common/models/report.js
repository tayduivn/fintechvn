'use strict';

var mess      = require('./../../errorMess/messagse.json');
var fun 			= require('./../../libs/fun.js');

module.exports = function(Report) {
	Report.revenue = async function(type, body) {
		let data 	= null;
		let error = { ...mess.DATA_NO_MATCH };
		let typeAccess = ['policies', 'policyBar'];

		if(typeAccess.indexOf(type) !== -1 ){
			switch(type){
  			case 'policies':
  				{
  					let re 	= await this.getCharPolicy(body);
  					data 		= re.data;
  					error 	= re.error;
  					break;
					}
				case 'policyBar':
				{
					let re 	= await this.getCharPolicyBar(body);
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

			for(let time of res.wheres){
				let where = { create_at: time, agency_id};

				let allC = await Report.app.models.productDetail.count({...where});
				let newC = await Report.app.models.productDetail.count({...where, status: 0});
				let penC = await Report.app.models.productDetail.count({...where, or: [{status: 1}, {status: 2}] });
				let comC = await Report.app.models.productDetail.count({...where, endDay: time, status: 3});

				_all.push(allC);
				_new.push(newC);
				_pen.push(penC);
				_com.push(comC);
			}

			data.datasets = {_all, _new, _pen, _com};
		}
  	
  	return {data, error};
	}
	
	// ================================ Function getCharPolicyBar =============================
	
	Report.getCharPolicyBar = async function(d){
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
		if( !!isY && !isQ && !isM ) 				res = whereTimeBar(year);
		else if( !!isY && !!isQ && !isM ) 	res = whereTimeBar(year, quarter);
		else if( !!isY && !!isQ && !!isM 
			&& (new RegExp(`^[${fun.getMonthInQuarter(quarter).toString()}]$`)).test(month)
			) res = whereTimeBar(year, quarter, month);
		
		if(!!res){
			error = null;
			data = {
				labels: res.labels,
				datasets : {}
			};

			for(let time of res.wheres){
				let where = { agency_id};

				let allC = await Report.app.models.productDetail.count({...where, create_at: time});
				let newC = await Report.app.models.productDetail.count({...where, create_at: time, status: 0});
				let penC = await Report.app.models.productDetail.count({...where, create_at: time, or: [{status: 1}, {status: 2}] });
				let comC = await Report.app.models.productDetail.count({...where, endDay: time, status: 3});

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

			wheres.push({ between: [timeStar, timeEnd] })
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
			wheres.push({ between: [timeStar, timeEnd] })
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
			wheres.push({ between: [timeStar, timeEnd] });
		}
	}

	return {wheres, labels};
}

function whereTimeBar(year, quarter, month){
	let wheres = [];
	let labels = [];

	let yNow = fun.getTime('yyyy');
	let mNow = fun.getTime('mm');
	let dNow = fun.getTime('dd');

	if( year > yNow) return {wheres, labels};

	let yMin = year;
	let yMax = year;

	if(year == yNow || ( (yNow - year) == 1 )) yMax = (yNow - 1);
	else yMax++;
	
	yMin = yMax - 2;

	if(!!year && !quarter && !month){
		
		for(let i = yMin; i <= yMax; ++i){
			labels.push(i);
			let ddEnd 			 = fun.getLastDate(12, i);

			let timeStar = `01-01-${i} 00:00:00`;
			let timeEnd  = `12-${ddEnd}-${i} 23:59:59`;

			timeStar 	= new Date(timeStar).getTime();
			timeEnd 	= new Date(timeEnd).getTime();

			wheres.push({ between: [timeStar, timeEnd] })
		}
	} else if(!!year && !!quarter && !month){
		let arrMonth = fun.getMonthInQuarter(quarter);
		let mMin = Math.min(...arrMonth);
		let mMax = Math.max(...arrMonth);

		for(let i = yMin; i <= yMax; ++i){
			let label = `${ mMin < 10 ? ('0' + mMin) : mMin }-${i} ${ mMax < 10 ? ('0' + mMax) : mMax }-${i}`
			labels.push(label);

			let ddEnd 			 = fun.getLastDate(mMax, i);

			let timeStar = `${mMin}-01-${i} 00:00:00`;
			let timeEnd  = `${mMax}-${ddEnd}-${i} 23:59:59`;

			timeStar 	= new Date(timeStar).getTime();
			timeEnd 	= new Date(timeEnd).getTime();

			wheres.push({ between: [timeStar, timeEnd] });

		}
	}else if(!!year && !!quarter && !!month){
		month = parseInt(month, 10);

		for(let i = yMin; i <= yMax; ++i){
			let ddEnd 			 = fun.getLastDate(month, i);

			let label = `${ month < 10 ? ('0' + month) : month }-${i}`;

			labels.push(label);

			let timeStar = `${month}-01-${i} 00:00:00`;
			let timeEnd  = `${month}-${ddEnd}-${i} 23:59:59`;

			timeStar 	= new Date(timeStar).getTime();
			timeEnd 	= new Date(timeEnd).getTime();

			wheres.push({ between: [timeStar, timeEnd] });

		}
	}


	return {wheres, labels};
}
