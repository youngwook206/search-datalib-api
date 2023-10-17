// util.js
const APPROOT = require('app-root-path');
const path = require('path');
const filename = path.basename(__filename);
const config = require(`${APPROOT}/config/config`);
const request = require('request');
const crypto = require('crypto');
const moment = require('moment');
const logger = require('./logger')(module);
const {resolve} = require('app-root-path');

//Empty check
module.exports.getEmpty = function (value) {
	if (Array.isArray(value) && value.length === 0) {
		return true;
	}
	if (typeof value === 'object' && Object.keys(value).length === 0) {
		return true;
	}
	if (
		!(
			typeof value === 'undefined' ||
			value === '' ||
			value === undefined ||
			value === ' '
		) &&
		value
	) {
		return false;
	}
	return true;
};
/* [SET] response send OK */
module.exports.sendResStatusByOk = function (req, body) {
	let endTime = moment();
	if (req === undefined);
	else {
		// Control
		let obj = {};
		const ret = {
			code: 200,
			message: 'OK',
			api_name: req.paramStatus,
		};
		obj.status = ret;
		obj.data = {
			timestamp: `${moment
				.duration(endTime.diff(req.startTime))
				.asMilliseconds()}ms`,
			result: body,
		};
		return obj;
	}
};

/* [SET] response send ERROR */
module.exports.resErr = function (req, err, msg) {
	if (req === undefined);
	else {
		// Control
	}
	return {status: err, reason: msg};
};

module.exports.errHandler = function (req, res, err, api_name) {
	//res.status(500).send(this.resErr(req, 500, err.message));
	let obj = {};
	console.log(err);
	const ret = {
		code: err.status,
		message: err.message,
	};
	obj.status = ret;
	return obj;
};

/** [SET] param send ERROR */
module.exports.makeResParamByStatErr = function (req, statusCode, err) {
	const messageObj = [];
	if (err === undefined);
	else {
		err.forEach((item) => {
			messageObj.push(item.msg);
		});
	}
	return {status: statusCode, message: messageObj};
};

module.exports.getIndexList = function (indexList) {
	let indexString = '';

	indexList.forEach((systemNm) => {
		indexString += systemNm + ',';
	});
	if (indexString.charAt(indexString.length - 1) === ',')
		indexString = indexString.slice(0, -1);

	return indexString;
};

/* [Request Parameter] Valid Check
 *  @param req : Request Object
 *  @param res : Response Object
 *  @param fileName : Source File Name
 *  @param param : Required Request Paramter Array
 *  */
module.exports.validateReqParams = function (req, res, fileName, param) {
	this.reqParam(`[${req.paramStatus}]Info`, req, fileName);
	//if (req.method === 'POST') req.query = req.body;

	const errStatus = {status: false, errMsg: ''};
	param.forEach((item, idx) => {
		req.checkQuery(item, `${item} is required`).notEmpty();
	});

	//const err = req.validationErrors();
	req.getValidationResult().then((result) => {
		if (!result.isEmpty()) {
			let erros = result.array().map(function (element) {
				return element.msg;
			});
			logger.error(`validationErrors : ${erros}`, fileName);
			errStatus.status = true;
			errStatus.errMsg = erros;
			result.status = 400;
			return res.status(400).send(this.resErr(req, 400, erros));
		}
	});
	return errStatus;
};

/** [LOG] Request Parameter */
module.exports.reqParam = function (urlname, req, fileName) {
	logger.info('---------------------------------------', fileName);
	logger.info(`${urlname} / (method:${req.method})`, fileName);
	logger.info('---------------------------------------', fileName);
};

/**
 * gateway 검색어 로깅
 * @param {*} req
 * @param {*} res
 */
module.exports.makeURL4QueryLog = function (openqueryLog) {
	try {
		let paramList = openqueryLog;
		const url = `http://${config.OPENQUERY_GATEWAY}/gateway/_querylog`;
		const options = {
			method: 'POST',
			uri: url,
			body: paramList,
			json: true,
		};
		return options;
	} catch (err) {
		throw err;
	}
};

/**
 * gateway의 제공하는 Service['autocomplete','recommend','popuqery']별 필수 파라미터 체크.
 *
 * @param req
 * @param res
 * @returns {null}
 */
module.exports.validReq4Service = function (req, res) {
	let isChkSum = null;
	const autoParam = ['keyword', 'label'];
	const popParam = ['label'];
	const recomParam = ['keyword', 'label'];
	const stopParam = ['keyword'];

	switch (req.query.serviceName) {
		case 'autocomplete':
			// 자동완성
			isChkSum = this.validateReqParams(
				req,
				res,
				req.paramStatus,
				autoParam,
			);
			break;
		case 'popquery':
			// 인기 검색어
			isChkSum = this.validateReqParams(
				req,
				res,
				req.paramStatus,
				popParam,
			);
			break;
		case 'recommend':
			// 추천 검색어
			isChkSum = this.validateReqParams(
				req,
				res,
				req.paramStatus,
				recomParam,
			);
			break;
		case 'stopword':
			// 금칙어
			isChkSum = this.validateReqParams(
				req,
				res,
				req.paramStatus,
				stopParam,
			);
			break;
	}
	return isChkSum;
};

/**
 * gateway의 Service별 URL 생성
 *
 * @param reqParams
 * @returns {string}
 */
module.exports.makeURL4Service = function (reqParams) {
	let resultURL = `http://${
		config.OPENQUERY_GATEWAY
	}/service/${reqParams.serviceName.toLowerCase()}`;

	switch (reqParams.serviceName) {
		case 'autocomplete':
			// 자동완성
			resultURL += `?keyword=${reqParams.keyword}&label=${reqParams.label}`;
			break;
		case 'popquery':
			// 인기 검색어
			resultURL += `?label=${reqParams.label}`;
			break;
		case 'recommend':
			// 추천 검색어
			resultURL += `?keyword=${reqParams.keyword}&label=${reqParams.label}`;
			break;
		case 'speller':
			// 오타교정
			resultURL += `?query=${encodeURI(reqParams.keyword)}&label=${
				reqParams.label
			}`;
			break;
		default:
	}
	console.log('Service URL ::: %j', resultURL);
	return resultURL;
};

// 검색쿼리 sort
module.exports.getSort = function (param) {
	let sortObj = {};
	let stemp = param.split(':');
	const sort = stemp[0];
	const sortType = stemp[1];
	switch (sort) {
		case 'score': // 정확도순
			sortObj['_score'] = {order: sortType};
			break;
		case 'title': // 제목순
			sortObj['TITLE'] = {order: sortType};
			break;
		case 'date': // 작성일순
			sortObj['CREATED'] = {order: sortType};
			break;
		case 'view': // 회의날짜순
			sortObj['VIEW_COUNT'] = {order: sortType};
			break;
		case 'download': // 회의날짜순
			sortObj['DOWNLOAD_COUNT'] = {order: sortType};
			break;
		default:
			// 정확도순
			sortObj['_score'] = {order: 'desc'};
			break;
	}

	return sortObj;
};

// category List #1
module.exports.getCategoryList = function (category) {
	let categoryObj = {};
	let category_length = category.length;
	switch (category_length) {
		case 4:
			categoryObj = `3.${category}.*`;
			break;
		case 8:
			categoryObj = `4.${category}.*`;
			break;
		case 12:
			categoryObj = `5.${category}.*`;
			break;
		case 16:
			categoryObj = `6.${category}.*`;
			break;
	}
	return categoryObj;
};

// 0518 추가 - Category
module.exports.getparamSplitValue = function (splitval) {
	let value_length = splitval.length;
	let categoryStr;

	if (value_length === 4 || value_length === 8) {
		categoryStr = `${splitval}`.substring(0, 4);
	} else if (value_length === 12) {
		// categoryStr = `${category}`.substring(0,8);
		categoryStr = `${splitval}`.substring(0, 8);
	} else if (value_length === 16) {
		categoryStr = `${splitval}`.substring(0, 12);
	}
	return categoryStr;
};

// 자동완성 sort
module.exports.getAutoSortList = function (sort, serviceNmme) {
	let autoObj = {};
	switch (sort) {
		case '_score':
			autoObj._score = 'desc';
			break;
		case 'weight':
			autoObj.weight = 'desc';
			break;
		case 'keyword.keyword':
			autoObj['keyword.keyword'] = 'asc';
			break;
		case 'timestamp':
			autoObj.timestamp = 'asc';
			break;
	}
	return autoObj;
};

module.exports.isGatewayHealthCheck = (serviceURL) => {
	return new Promise((resolve, reject) => {
		request(serviceURL, (err, response, body) => {
			if (err) reject(err);
			else
				resolve(() => {
					return true;
				});
		});
	});
};
module.exports.sendSpeller = (req, body) => {
	if (req === undefined) {
	} else {
		// Control
	}
	const ret = {};

	if (Array.isArray(body)) {
		const result = [];
		body.map((dataObj) => {
			const data = {};
			Object.keys(dataObj).map((key) => {
				if (Object.prototype.hasOwnProperty.call(dataObj, key)) {
					data[key] = dataObj[key];
				}
			});
			result.push(data);
		});
		ret.result = result;
	} else {
		Object.keys(body).map((key) => {
			if (Object.prototype.hasOwnProperty.call(body, key)) {
				ret[key] = body[key];
			}
		});
	}

	return ret;
};
