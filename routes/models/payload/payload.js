const moment = require('moment');
require('moment-timezone');

moment.tz.setDefault('Asia/Seoul');

// convert "match" query
// convert "range" query

// Edit Elasticsearch Query
module.exports = {
	setLog4OpenQueryLog: (indexNm, keyword, searchResult) => {
		const openqueryLog = {
			index: indexNm,
			query: keyword,
			total: searchResult.hits.total.value,
			took: searchResult.took,
		};
		return openqueryLog;
	},

	dataset: (req) => {
		// 0. Settings Request Paramter
		const reqParams = {
			size: req.size,
			searchWord: req.searchWord ?? '',
			from: req.from ?? '',
			sort: req.sort ?? '',
			startFileSize: Number(req.startFileSize?.replace('mb', '')) ?? '',
			endFileSize: Number(req.endFileSize?.replace('mb', '')) ?? '',
			fileType: req.fileType ?? '',
			isQuality: req.isQuality ?? '',
			group: req.group ?? '',
			organization: req.organization ?? '',
			keyword: req.keyword ?? '',
			license: req.license ?? '',
			user: req.user ?? '',
			startDate: req.startDate ?? '',
			endDate: req.endDate ?? '',
		};

		return reqParams;
	},
	dataset_agg: (req) => {
		// 0. Settings Request Paramter
		const reqParams = {
			packageId: req.packageId ?? '',
			searchWord: req.searchWord ?? '',
			startFileSize: Number(req.startFileSize?.replace('mb', '')) ?? '',
			endFileSize: Number(req.endFileSize?.replace('mb', '')) ?? '',
			fileType: req.fileType ?? '',
			isQuality: req.isQuality ?? '',
			size: req.size ?? 10,
			startDate: req.startDate ?? '',
			endDate: req.endDate ?? '',

			group: req.group ?? '',
			organization: req.organization ?? '',
			keyword: req.keyword ?? '',
			license: req.license ?? '',
			user: req.user ?? '',
		};

		return reqParams;
	},
	keyword_agg: (req) => {
		// 0. Settings Request Paramter
		const reqParams = {
			group: req.group ?? '',
			size: req.size ?? 30,
		};

		return reqParams;
	},
	insert: (req) => {
		// 0. Settings Request Paramter
		const reqParams = {
			startDate: req.startDate ?? '',
			endDate: req.endDate ?? '',
			size: req.size ?? 30,
			group: req.group ?? '',
			packageId: req.packageId ?? '',
		};

		return reqParams;
	},
	// Edit Elasticsearch Query
	notice: (req) => {
		// 0. Settings Request Paramter
		const reqParams = {
			size: req.size,
			searchWord: req.searchWord ?? '',
			from: req.from ?? '',
			sort: req.sort ?? '',
			startDate: req.startDate ?? '',
			endDate: req.endDate ?? '',
			searchField: req.searchField ?? '',
		};

		return reqParams;
	},

	usage: (req) => {
		// 0. Settings Request Paramter
		const reqParams = {
			size: req.size,
			searchWord: req.searchWord ?? '',
			from: req.from ?? '',
			sort: req.sort ?? '',
			tools: req.tools ?? '',
			searchField: req.searchField ?? '',
		};

		return reqParams;
	},
	setReqParams4Gateway: (req) => {
		const result = {};
		const serviceName = req.serviceName.toLowerCase();
		result.serviceName = serviceName;
		switch (serviceName) {
			case 'autocomplete' || 'recommend':
				// 자동완성
				result.keyword = req.keyword;
				result.label = req.label;
				break;
			case 'popquery':
				// 인기 검색어
				result.label = req.label;
				break;
			default:
		}

		return result;
	},
};
