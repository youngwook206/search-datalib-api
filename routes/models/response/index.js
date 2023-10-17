const APPROOT = require('app-root-path');
const moment = require('moment');

module.exports = {
	dataset: async (paramSet, searchResult) => {
		let data = {
			count: searchResult.hits.total.value,
			size: paramSet.size,
			from: paramSet.from,
			page: paramSet.page,
			items: [],
		};

		let hits = searchResult.hits.hits;
		for (let val of hits) {
			delete val._source.FILE_CONTENT;
			delete val._source.FILE_ERROR_MSG;
			data.items.push(val._source);
		}

		return data;
	},
	dataset_agg: async (paramSet, searchResult) => {
		let data = {
			aggs: {},
		};
		data.aggs.group_agg = searchResult.aggregations.group_agg.buckets.sort(
			(a, b) => (a.key < b.key ? -1 : 1),
		);

		data.aggs.organization_agg =
			searchResult.aggregations.organization_agg.buckets.sort((a, b) =>
				a.key < b.key ? -1 : 1,
			);
		data.aggs.keyword_agg =
			searchResult.aggregations.keyword_agg.buckets.sort((a, b) =>
				a.key < b.key ? -1 : 1,
			);
		data.aggs.license_agg =
			searchResult.aggregations.license_agg.buckets.sort((a, b) =>
				a.key < b.key ? -1 : 1,
			);
		data.aggs.user_agg = searchResult.aggregations.user_agg.buckets.sort(
			(a, b) => (a.key < b.key ? -1 : 1),
		);
		data.aggs.created_agg = searchResult.aggregations.created_agg.buckets;

		return data;
	},
	keyword_agg: async (paramSet, searchResult) => {
		let data = {
			aggs: {},
		};
		data.aggs.keyword_agg = searchResult.aggregations.keyword_agg.buckets;
		return data;
	},
	insert: async (paramSet, searchResult) => {
		let data = {
			aggs: {},
		};

		data.aggs.insert_agg =
			searchResult.aggregations.insert_agg.buckets.filter(
				(obj) => obj.doc_count > 0,
			);
		return data;
	},
	notice: async (paramSet, searchResult) => {
		let data = {
			count: searchResult.hits.total.value,
			size: paramSet.size,
			from: paramSet.from,
			page: paramSet.page,
			items: [],
		};

		let hits = searchResult.hits.hits;
		for (let val of hits) {
			delete val._source.FILE_CONTENT;
			delete val._source.FILE_ERROR_MSG;
			data.items.push(val._source);
		}

		return data;
	},
	usage: async (paramSet, searchResult) => {
		let data = {
			count: searchResult.hits.total.value,
			size: paramSet.size,
			from: paramSet.from,
			page: paramSet.page,
			items: [],
		};

		let hits = searchResult.hits.hits;
		for (let val of hits) {
			data.items.push(val._source);
		}

		return data;
	},
};
