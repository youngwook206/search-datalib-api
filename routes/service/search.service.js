const APPROOT = require('app-root-path');
const deepcopy = require('deepcopy');
const path = require('path');

const Util = require(`${APPROOT}/util/util`);
const Payload = require(`${APPROOT}/routes/models/payload/payload`);
const elasticQuery = require(`${APPROOT}/routes/models/payload/payload.model`);
const searchEngine = require(`${APPROOT}/middleware/elasticsearch`);
const elasticsearch = new searchEngine('SE');
const elasticsearch1 = new searchEngine('RE');
const Gateway = require(`${APPROOT}/routes/service/gateway.service.js`);

// Process Execute Query
module.exports = {
	dataset: async (req) => {
		const indexName = 'lib_dataset';

		try {
			const reqParams = deepcopy(req);

			// 1. Set Params return Type {Object}
			const setParams = await Payload.dataset(reqParams);

			// 2. Create Query
			const searchQuery = await elasticQuery.dataset(setParams);

			console.log(
				`IndexName [${indexName}] --- Query ::: %j`,
				searchQuery,
			);

			// 3. Call esService.API()
			const searchResult = await elasticsearch.singleSearch(
				indexName,
				searchQuery,
			);

			// 검색어 통계
			if (!Util.getEmpty(setParams.searchWord))
				await Gateway.setOpenQuerylog(
					indexName,
					setParams.searchWord,
					searchResult,
				);
			return searchResult;
		} catch (err) {
			throw err;
		}
	},
	dataset_agg: async (req) => {
		const indexName = 'lib_dataset';

		try {
			const reqParams = deepcopy(req);

			// 1. Set Params return Type {Object}
			const setParams = await Payload.dataset_agg(reqParams);

			// 2. Create Query
			const searchQuery = await elasticQuery.dataset_agg(setParams);

			console.log(
				`IndexName [${indexName}] --- Query ::: %j`,
				searchQuery,
			);

			// 3. Call esService.API()
			return await elasticsearch.singleSearch(indexName, searchQuery);
		} catch (err) {
			throw err;
		}
	},
	keyword_agg: async (req) => {
		const indexName = 'lib_dataset';

		try {
			const reqParams = deepcopy(req);

			// 1. Set Params return Type {Object}
			const setParams = await Payload.keyword_agg(reqParams);

			// 2. Create Query
			const searchQuery = await elasticQuery.keyword_agg(setParams);

			console.log(
				`IndexName [${indexName}] --- Query ::: %j`,
				searchQuery,
			);

			// 3. Call esService.API()
			return await elasticsearch.singleSearch(indexName, searchQuery);
		} catch (err) {
			throw err;
		}
	},

	insert: async (req) => {
		const indexName = 'lib_dataset';

		try {
			const reqParams = deepcopy(req);

			// 1. Set Params return Type {Object}
			const setParams = await Payload.insert(reqParams);

			// 2. Create Query
			const searchQuery = await elasticQuery.insert(setParams);

			console.log(
				`IndexName [${indexName}] --- Query ::: %j`,
				searchQuery,
			);

			// 3. Call esService.API()
			return await elasticsearch.singleSearch(indexName, searchQuery);
		} catch (err) {
			throw err;
		}
	},
	notice: async (req) => {
		const indexName = 'lib_notice';

		try {
			const reqParams = deepcopy(req);

			// 1. Set Params return Type {Object}
			const setParams = await Payload.notice(reqParams);

			// 2. Create Query
			const searchQuery = await elasticQuery.notice(setParams);

			console.log(
				`IndexName [${indexName}] --- Query ::: %j`,
				searchQuery,
			);

			// 3. Call esService.API()
			const searchResult = await elasticsearch.singleSearch(
				indexName,
				searchQuery,
			);
			// 검색어 통계
			if (!Util.getEmpty(setParams.searchWord))
				await Gateway.setOpenQuerylog(
					indexName,
					setParams.searchWord,
					searchResult,
				);
			return searchResult;
		} catch (err) {
			throw err;
		}
	},

	usage: async (req) => {
		const indexName = 'lib_usage';

		try {
			const reqParams = deepcopy(req);

			// 1. Set Params return Type {Object}
			const setParams = await Payload.usage(reqParams);

			// 2. Create Query
			const searchQuery = await elasticQuery.usage(setParams);

			console.log(
				`IndexName [${indexName}] --- Query ::: %j`,
				searchQuery,
			);

			// 3. Call esService.API()
			const searchResult = await elasticsearch.singleSearch(
				indexName,
				searchQuery,
			);

			// 검색어 통계
			if (!Util.getEmpty(setParams.searchWord))
				await Gateway.setOpenQuerylog(
					indexName,
					setParams.searchWord,
					searchResult,
				);
			return searchResult;
		} catch (err) {
			throw err;
		}
	},
};
