/* Search API */
// node.js Module
const APPROOT = require('app-root-path');
const path = require('path');
// Util
const Util = require(`${APPROOT}/util/util`);
const logger = require(`${APPROOT}/util/logger`)(module);
// Service
const Search = require(`${APPROOT}/routes/service/search.service.js`);
const ResponseModel = require(`${APPROOT}/routes/models/response/index`);

const moment = require('moment');
const fileName = path.basename(__filename);

module.exports = {
	async dataset(req, res) {
		try {
			// Set Interface Name
			req.paramStatus = 'dataset';
			req.startTime = moment();

			// 1. GET or POST 모든 Request Paramter는 req.query에 담겨져 있다.
			if (req.method === 'POST') req.query = req.body;
			if (!req.query.searchWord) {
				req.query.searchWord = '*';
			}

			// 2. Request Parameter Validation Check.
			const validateResult = Util.validateReqParams(
				req,
				res,
				req.paramStatus,
				['searchWord'],
			);

			if (validateResult.status) {
				return res.status(400).send(validateResult.errMsg);
			}
			req.query.page = !req.query?.page
				? 1
				: Number(req.query?.page) == 0
				? 1
				: Number(req.query?.page);

			req.query.from = !req.query?.page
				? 0
				: (Number(req.query?.page) - 1) * 10;
			req.query.size = Number(req.query?.size) || 10;

			// 3. After Request Elasticsearch Query, Response Result about Query.
			const searchResult = await Search.dataset(req.query);

			// 4. Call ResponseModel(EsService.Search.Response)
			const result = await ResponseModel.dataset(req.query, searchResult);

			// 5. Send Result about Query(payload).
			return res.json(Util.sendResStatusByOk(req, result));
		} catch (err) {
			// 4-1. If an error occurs, Send Error Info.
			logger.error('---------------------------------------', fileName);
			logger.error(
				`${req.originalUrl} / (method:${req.method})`,
				fileName,
			);
			logger.error(err);
			logger.error('---------------------------------------', fileName);
			return res.json(Util.errHandler(req, res, err));
		}
	},
	async dataset_agg(req, res) {
		try {
			// Set Interface Name
			req.paramStatus = 'dataset_agg';
			req.startTime = moment();

			// 1. GET or POST 모든 Request Paramter는 req.query에 담겨져 있다.
			if (req.method === 'POST') req.query = req.body;
			if (!req.query.searchWord) {
				req.query.searchWord = '*';
			}
			// 2. Request Parameter Validation Check.
			const validateResult = Util.validateReqParams(
				req,
				res,
				req.paramStatus,
				['searchWord'],
			);

			if (validateResult.status) {
				return res.status(400).send(validateResult.errMsg);
			}

			// 3. After Request Elasticsearch Query, Response Result about Query.
			const searchResult = await Search.dataset_agg(req.query);

			// 4. Call ResponseModel(EsService.Search.Response)
			const result = await ResponseModel.dataset_agg(
				req.query,
				searchResult,
			);

			// 5. Send Result about Query(payload).
			return res.json(Util.sendResStatusByOk(req, result));
		} catch (err) {
			// 4-1. If an error occurs, Send Error Info.
			logger.error('---------------------------------------', fileName);
			logger.error(
				`${req.originalUrl} / (method:${req.method})`,
				fileName,
			);
			logger.error(err);
			logger.error('---------------------------------------', fileName);
			return res.json(Util.errHandler(req, res, err));
		}
	},
	async keyword_agg(req, res) {
		try {
			// Set Interface Name
			req.paramStatus = 'keyword_agg';
			req.startTime = moment();

			// 1. GET or POST 모든 Request Paramter는 req.query에 담겨져 있다.
			if (req.method === 'POST') req.query = req.body;

			const searchResult = await Search.keyword_agg(req.query);

			// 4. Call ResponseModel(EsService.Search.Response)
			const result = await ResponseModel.keyword_agg(
				req.query,
				searchResult,
			);

			// 5. Send Result about Query(payload).
			return res.json(Util.sendResStatusByOk(req, result));
		} catch (err) {
			// 4-1. If an error occurs, Send Error Info.
			logger.error('---------------------------------------', fileName);
			logger.error(
				`${req.originalUrl} / (method:${req.method})`,
				fileName,
			);
			logger.error(err);
			logger.error('---------------------------------------', fileName);
			return res.json(Util.errHandler(req, res, err));
		}
	},

	async insert(req, res) {
		try {
			// Set Interface Name
			req.paramStatus = 'insert';
			req.startTime = moment();

			// 1. GET or POST 모든 Request Paramter는 req.query에 담겨져 있다.
			if (req.method === 'POST') req.query = req.body;

			const searchResult = await Search.insert(req.query);

			// 4. Call ResponseModel(EsService.Search.Response)
			const result = await ResponseModel.insert(
				req.query,
				searchResult,
			);

			// 5. Send Result about Query(payload).
			return res.json(Util.sendResStatusByOk(req, result));
		} catch (err) {
			// 4-1. If an error occurs, Send Error Info.
			logger.error('---------------------------------------', fileName);
			logger.error(
				`${req.originalUrl} / (method:${req.method})`,
				fileName,
			);
			logger.error(err);
			logger.error('---------------------------------------', fileName);
			return res.json(Util.errHandler(req, res, err));
		}
	},
	async notice(req, res) {
		try {
			// Set Interface Name
			req.paramStatus = 'notice';
			req.startTime = moment();

			// 1. GET or POST 모든 Request Paramter는 req.query에 담겨져 있다.
			if (req.method === 'POST') req.query = req.body;
			if (!req.query.searchWord) {
				req.query.searchWord = '*';
			}
			// 2. Request Parameter Validation Check.
			const validateResult = Util.validateReqParams(
				req,
				res,
				req.paramStatus,
				['searchWord'],
			);

			if (validateResult.status) {
				return res.status(400).send(validateResult.errMsg);
			}
			req.query.page = !req.query?.page
				? 1
				: Number(req.query?.page) == 0
				? 1
				: Number(req.query?.page);

			req.query.from = !req.query?.page
				? 0
				: (Number(req.query?.page) - 1) * 10;
			req.query.size = Number(req.query?.size) || 10;

			// 3. After Request Elasticsearch Query, Response Result about Query.
			const searchResult = await Search.notice(req.query);

			// 4. Call ResponseModel(EsService.Search.Response)
			const result = await ResponseModel.notice(req.query, searchResult);

			// 5. Send Result about Query(payload).
			return res.json(Util.sendResStatusByOk(req, result));
		} catch (err) {
			// 4-1. If an error occurs, Send Error Info.
			logger.error('---------------------------------------', fileName);
			logger.error(
				`${req.originalUrl} / (method:${req.method})`,
				fileName,
			);
			logger.error(err);
			logger.error('---------------------------------------', fileName);
			return res.json(Util.errHandler(req, res, err));
		}
	},

	async usage(req, res) {
		try {
			// Set Interface Name
			req.paramStatus = 'usage';
			req.startTime = moment();

			// 1. GET or POST 모든 Request Paramter는 req.query에 담겨져 있다.
			if (req.method === 'POST') req.query = req.body;
			if (!req.query.searchWord) {
				req.query.searchWord = '*';
			}
			// 2. Request Parameter Validation Check.
			const validateResult = Util.validateReqParams(
				req,
				res,
				req.paramStatus,
				['searchWord'],
			);

			if (validateResult.status) {
				return res.status(400).send(validateResult.errMsg);
			}
			req.query.page = !req.query?.page
				? 1
				: Number(req.query?.page) == 0
				? 1
				: Number(req.query?.page);

			req.query.from = !req.query?.page
				? 0
				: (Number(req.query?.page) - 1) * 10;
			req.query.size = Number(req.query?.size) || 10;

			// 3. After Request Elasticsearch Query, Response Result about Query.
			const searchResult = await Search.usage(req.query);

			// 4. Call ResponseModel(EsService.Search.Response)
			const result = await ResponseModel.usage(req.query, searchResult);

			// 5. Send Result about Query(payload).
			return res.json(Util.sendResStatusByOk(req, result));
		} catch (err) {
			// 4-1. If an error occurs, Send Error Info.
			logger.error('---------------------------------------', fileName);
			logger.error(
				`${req.originalUrl} / (method:${req.method})`,
				fileName,
			);
			logger.error(err);
			logger.error('---------------------------------------', fileName);
			return res.json(Util.errHandler(req, res, err));
		}
	},
};
