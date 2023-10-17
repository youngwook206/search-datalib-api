// Basic Template Elasticsearch Query
const APPROOT = require('app-root-path');

const Util = require(`${APPROOT}/util/util`);
const moment = require('moment');

module.exports = {
	dataset: async (reqParams) => {
		const query = {
			query: {
				bool: {
					must: [
						{
							terms: {
								STATE: ['ACTIVE', 'PENDING'],
							},
						},
					],
				},
			},
			size: reqParams.size,
			from: reqParams.from,
			sort: [],
			track_total_hits: true,
		};
		if (reqParams.searchWord !== '*') {
			const searchWord = reqParams.searchWord.split(',');
			for (const i in searchWord) {
				query.query.bool.must.push({
					multi_match: {
						query: searchWord[i],
						fields: [
							'FILE_NAME_LIST.kobrick',
							'TAGS.kobrick',
							'USER_NAME.ngram',
							'TITLE.kobrick',
							'FILE_CONTENT.kobrick',
						],
					},
				});
			}
		}

		// file 사이즈 추가 [start]
		const fileRange = {
			range: {
				TOTAL_FILE_SIZE: {},
			},
		};
		if (reqParams.startFileSize) {
			fileRange.range.TOTAL_FILE_SIZE.gte = reqParams.startFileSize;
		}
		if (reqParams.endFileSize) {
			fileRange.range.TOTAL_FILE_SIZE.lte = reqParams.endFileSize;
		}
		if (reqParams.startFileSize || reqParams.endFileSize) {
			query.query.bool.must.push(fileRange);
		}
		// file 사이즈 추가 [end]

		// create 추가 [start]
		const createRange = {
			range: {
				CREATED: {},
			},
		};
		if (reqParams.startDate) {
			createRange.range.CREATED.gte = reqParams.startDate;
		}
		if (reqParams.endDate) {
			createRange.range.CREATED.lte = reqParams.endDate;
		}
		if (reqParams.startDate || reqParams.endDate) {
			query.query.bool.must.push(createRange);
		}
		// create 추가 [end]
		if (reqParams.fileType) {
			query.query.bool.must.push({
				terms: {
					FILE_FORMAT_LIST: reqParams.fileType.split(','),
				},
			});
		}
		if (reqParams.isQuality) {
			query.query.bool.must.push({
				term: {
					IS_QUALITY: reqParams.isQuality == 'Y',
				},
			});
		}
		if (reqParams.group) {
			query.query.bool.must.push({
				terms: {
					GROUP_NAME: reqParams.group.split(','),
				},
			});
		}
		if (reqParams.organization) {
			query.query.bool.must.push({
				terms: {
					ORGANIZATION: reqParams.organization.split(','),
				},
			});
		}
		if (reqParams.keyword) {
			query.query.bool.must.push({
				terms: {
					TAGS: reqParams.keyword.split(','),
				},
			});
		}
		if (reqParams.license) {
			query.query.bool.must.push({
				terms: {
					LICENSE: reqParams.license.split(','),
				},
			});
		}
		if (reqParams.user) {
			query.query.bool.must.push({
				terms: {
					USER_NAME: reqParams.user.split(','),
				},
			});
		}

		if (!Util.getEmpty(reqParams.size)) {
			const sortQuery = Util.getSort(reqParams.sort);
			query.sort.push(sortQuery);
		}
		// return 검색 쿼리
		return query;
	},
	dataset_agg: async (reqParams) => {
		const {searchWord} = reqParams;
		const size = reqParams.size || 10;
		// 쿼리생성

		const query = {
			query: {
				bool: {
					must: [
						{
							terms: {
								STATE: ['ACTIVE', 'PENDING'],
							},
						},
					],
				},
			},
			size: 0,
			track_total_hits: true,
			aggs: {
				group_agg: {
					terms: {
						field: 'GROUP_NAME',
						size,
					},
				},
				organization_agg: {
					terms: {
						field: 'ORGANIZATION',
						size,
					},
				},
				keyword_agg: {
					terms: {
						field: 'TAGS',
						size,
					},
				},
				license_agg: {
					terms: {
						field: 'LICENSE',
						size,
					},
				},
				user_agg: {
					terms: {
						field: 'USER_NAME',
						size,
					},
				},
				created_agg: {
					date_histogram: {
						field: 'CREATED',
						calendar_interval: 'year',
						format: 'yyyy',
					},
				},
			},
		};

		if (searchWord !== '*') {
			const searchWord = reqParams.searchWord.split(',');
			for (const i in searchWord) {
				query.query.bool.must.push({
					multi_match: {
						query: searchWord[i],
						fields: [
							'FILE_NAME_LIST.kobrick',
							'TAGS.kobrick',
							'USER_NAME.ngram',
							'TITLE.kobrick',
							'FILE_CONTENT.kobrick',
						],
					},
				});
			}
		}
		if (reqParams.packageId) {
			query.query.bool.must.push({
				terms: {
					ID: reqParams.packageId.split(','),
				},
			});
		}

		// file 사이즈 추가 [start]
		const fileRange = {
			range: {
				TOTAL_FILE_SIZE: {},
			},
		};
		if (reqParams.startFileSize) {
			fileRange.range.TOTAL_FILE_SIZE.gte = reqParams.startFileSize;
		}
		if (reqParams.endFileSize) {
			fileRange.range.TOTAL_FILE_SIZE.lte = reqParams.endFileSize;
		}
		if (reqParams.startFileSize || reqParams.endFileSize) {
			query.query.bool.must.push(fileRange);
		}
		// file 사이즈 추가 [end]

		// create 추가 [start]
		const createRange = {
			range: {
				CREATED: {},
			},
		};
		if (reqParams.startDate) {
			createRange.range.CREATED.gte = reqParams.startDate;
		}
		if (reqParams.endDate) {
			createRange.range.CREATED.lte = reqParams.endDate;
		}
		if (reqParams.startDate || reqParams.endDate) {
			query.query.bool.must.push(createRange);
		}
		// create 추가 [end]

		if (reqParams.fileType) {
			query.query.bool.must.push({
				terms: {
					FILE_FORMAT_LIST: reqParams.fileType.split(','),
				},
			});
		}
		if (reqParams.isQuality) {
			query.query.bool.must.push({
				term: {
					IS_QUALITY: reqParams.isQuality == 'Y',
				},
			});
		}
		if (reqParams.group) {
			query.query.bool.must.push({
				terms: {
					GROUP_NAME: reqParams.group.split(','),
				},
			});
		}
		if (reqParams.organization) {
			query.query.bool.must.push({
				terms: {
					ORGANIZATION: reqParams.organization.split(','),
				},
			});
		}
		if (reqParams.keyword) {
			query.query.bool.must.push({
				terms: {
					TAGS: reqParams.keyword.split(','),
				},
			});
		}
		if (reqParams.license) {
			query.query.bool.must.push({
				terms: {
					LICENSE: reqParams.license.split(','),
				},
			});
		}
		if (reqParams.user) {
			query.query.bool.must.push({
				terms: {
					USER_NAME: reqParams.user.split(','),
				},
			});
		}
		// if (!Util.getEmpty(reqParams.size)) {
		// 	let sortQuery = Util.getSort(reqParams.sort);
		// 	query.sort.push(sortQuery);
		// }
		// return 검색 쿼리
		return query;
	},
	insert: async (reqParams) => {
		const query = {
			size: 0,
			track_total_hits: true,
			query: {
				// match_all: {},
				bool: {
					must: [
						{
							simple_query_string: {
								query: 'ACTIVE PENDING',
								fields: ['STATE'],
								default_operator: 'OR',
							},
						},
					],
				},
			},
			aggs: {
				insert_agg: {
					date_histogram: {
						field: 'CREATED',
						format: 'yyyy-MM-dd',
						calendar_interval: 'day',
					},
				},
			},
		};

		// create 추가 [start]
		const insertRange = {
			range: {
				CREATED: {},
			},
		};

		if (reqParams.startDate) {
			insertRange.range.CREATED.gte = reqParams.startDate;
		}
		if (reqParams.endDate) {
			insertRange.range.CREATED.lte = reqParams.endDate;
		}
		if (reqParams.startDate || reqParams.endDate) {
			query.query.bool.must.push(insertRange);
		}

		if (reqParams.packageId) {
			query.query.bool.must.push({
				terms: {
					ID: reqParams.packageId.split(','),
				},
			});
		}
		// delete query.query.bool;
		//  delete query.query.match_all;
		if (reqParams.group) {
			query.query.bool.must.push({
				terms: {
					GROUP_NAME: reqParams.group.split(','),
				},
			});
		}
		if (
			reqParams.startDate ||
			reqParams.endDate ||
			reqParams.group ||
			reqParams.packageId
		) {
			// delete query.query.match_all;
		} else {
			// delete query.query.bool;
		}
		console.log(query);
		// create 추가 [end]
		// if (!Util.getEmpty(reqParams.size)) {
		// 	let sortQuery = Util.getSort(reqParams.sort);
		// 	query.sort.push(sortQuery);
		// }
		// return 검색 쿼리
		return query;
	},
	keyword_agg: async (reqParams) => {
		const query = {
			query: {
				// match_all: {},
				bool: {
					must: [
						{
							terms: {
								STATE: ['ACTIVE', 'PENDING'],
							},
						},
					],
				},
			},
			size: 0,
			track_total_hits: true,
			aggs: {
				keyword_agg: {
					terms: {
						field: 'TAGS',
						size: reqParams.size ?? 30,
					},
				},
			},
		};

		if (reqParams.group) {
			query.query.bool.must.push({
				terms: {
					GROUP_NAME: reqParams.group.split(','),
				},
			});
			// delete query.query.match_all;
		}
		// if (!Util.getEmpty(reqParams.size)) {
		// 	let sortQuery = Util.getSort(reqParams.sort);
		// 	query.sort.push(sortQuery);
		// }
		// return 검색 쿼리
		return query;
	},
	notice: async (reqParams) => {
		const {searchWord} = reqParams;
		// 쿼리생성
		const esQuery = {
			multi_match: {
				query: searchWord,
				fields: [],
			},
		};
		if (reqParams.searchField.includes('title'))
			esQuery.multi_match.fields.push('TITLE.kobrick');
		if (reqParams.searchField.includes('discription'))
			esQuery.multi_match.fields.push('DESCRIPTION.kobrick');
		if (reqParams.searchField.includes('user'))
			esQuery.multi_match.fields.push(
				...['NAME_LIST.kobrick', 'USER_NAME.ngram'],
			);
		if (esQuery.multi_match.fields.length === 0)
			esQuery.multi_match.fields = [
				'DESCRIPTION.kobrick',
				'NAME_LIST.kobrick',
				'USER_NAME.ngram',
				'TITLE.kobrick',
				'FILE_CONTENT.kobrick',
			];

		const query = {
			query: {
				bool: {
					must: [
						esQuery,
						{
							terms: {
								STATE: ['ACTIVE', 'PENDING'],
							},
						},
					],
				},
			},
			size: reqParams.size,
			from: reqParams.from,
			sort: [],
			track_total_hits: true,
		};

		if (reqParams.searchWord == '*') {
			query.query.bool.must.shift();
		}
		if (reqParams.startDate) {
			query.query.bool.must.push({
				range: {
					POSTING_START_DATE: {
						gte: moment(reqParams.startDate).format('YYYY-MM-DD'),
					},
				},
			});
		}
		if (reqParams.endDate) {
			query.query.bool.must.push({
				range: {
					POSTING_END_DATE: {
						lte: moment(reqParams.endDate).format('YYYY-MM-DD'),
					},
				},
			});
		}
		if (!Util.getEmpty(reqParams.size)) {
			const sortQuery = Util.getSort(reqParams.sort);
			query.sort.push(sortQuery);
		}
		// return 검색 쿼리
		return query;
	},
	usage: async (reqParams) => {
		const andKeyword = '';

		const {searchWord} = reqParams;
		// 쿼리생성
		const esQuery = {
			multi_match: {
				query: searchWord,
				fields: [],
			},
		};
		if (reqParams.searchField.includes('title'))
			esQuery.multi_match.fields.push('TITLE.kobrick');
		if (reqParams.searchField.includes('discription'))
			esQuery.multi_match.fields.push('DESCRIPTION.kobrick');
		if (reqParams.searchField.includes('user'))
			esQuery.multi_match.fields.push('USER_NAME.ngram');

		if (esQuery.multi_match.fields.length === 0)
			esQuery.multi_match.fields = [
				'DESCRIPTION.kobrick',
				'USER_NAME.ngram',
				'TITLE.kobrick',
			];

		const query = {
			query: {
				bool: {
					must: [
						esQuery,
						{
							terms: {
								STATE: ['ACTIVE', 'PENDING'],
							},
						},
					],
				},
			},
			size: reqParams.size,
			from: reqParams.from,
			sort: [],
			track_total_hits: true,
		};
		if (reqParams.searchWord == '*') {
			query.query.bool.must.shift();
		}
		if (reqParams.tools) {
			query.query.bool.must.push({
				match: {
					'ANALYSIS_TOOLS.kobrick': reqParams.tools,
				},
			});
		}

		if (!Util.getEmpty(reqParams.size)) {
			const sortQuery = Util.getSort(reqParams.sort);
			query.sort.push(sortQuery);
		}
		// return 검색 쿼리
		return query;
	},
	// 확인결과 현재 사용하지 않는 코드입니다.
	getKeywordQuery: async (reqParams, category) => {
		const searchword = reqParams.confer_num;
		let andKeyword = '';

		const config = index_config.meeting_content;

		const fields = config.field.keyword.searchField || [];

		let esQuery = {};

		// keywrod 체크- | ! - 검사
		if (!Util.getEmpty(searchword)) {
			const keywordSplit = searchword.split(' ');
			// | ! - 검사
			const validate = /[|!-]/;
			keywordSplit.forEach((value) => {
				if (value.charAt(0).match(validate)) {
					if (value.charAt(0) === '|')
						orKeyword += `${value.replace(validate, '')} `;
					else if (value.charAt(0) === '-' || value.charAt(0) === '!')
						notKeyword = value.replace(validate, '');
				} else {
					andKeyword += `${value} `;
				}
			});
		}

		// 쿼리생성
		if (!Util.getEmpty(andKeyword)) {
			// and
			esQuery = {
				simple_query_string: {
					fields,
					query: andKeyword.trim(),
				},
			};
		} else {
			esQuery = {
				simple_query_string: {
					fields,
					query: '',
				},
			};
		}

		const query = {
			query: esQuery,
			aggs: {},
			size: 0,
		};

		// 키워드 클라우드 aggs
		query.aggs = {
			confer_num_set: {
				terms: {field: 'confer_num', size: 100},
				aggs: {
					grp_keyword: {
						nested: {path: 'keyword'},
						aggs: {
							grp_lex: {
								terms: {
									field: 'keyword.lex.keyword',
									size: reqParams.lex_count,
								},
								aggs: {
									sum_count: {
										sum: {field: 'keyword.count'},
									},
								},
							},
						},
					},
				},
			},
		};
		// return 검색 쿼리
		return query;
	},
	// 확인결과 현재 사용하지 않는 코드입니다.
	getSpeakerAddQuery: async (reqParams, category) => {
		const {searchword} = reqParams;
		let andKeyword = '';

		const config = index_config.meeting_content;

		const fields = config.field.speaker.searchField || [];
		const termsField = config.field.speaker.termsField || [];
		const filterQuery = [];

		let esQuery = {};
		// keywrod 체크- | ! - 검사
		if (!Util.getEmpty(searchword)) {
			const keywordSplit = searchword.split(' ');
			// | ! - 검사
			const validate = /[|!-]/;
			keywordSplit.forEach((value) => {
				if (value.charAt(0).match(validate)) {
					if (value.charAt(0) === '|')
						orKeyword += `${value.replace(validate, '')} `;
					else if (value.charAt(0) === '-' || value.charAt(0) === '!')
						notKeyword = value.replace(validate, '');
				} else {
					andKeyword += `${value} `;
				}
			});
		}
		console.log(reqParams);
		// 쿼리생성
		if (!Util.getEmpty(andKeyword) && reqParams.phrase_search !== 'Y') {
			// and
			esQuery = {
				bool: {
					must: [
						{
							terms: {
								'speaker_id.keyword':
									reqParams.speaker_id.split(','),
							},
						},
						{
							simple_query_string: {
								fields,
								query: andKeyword.trim(),
							},
						},
					],
				},
			};
			// esQuery = {
			//   simple_query_string: {
			//     fields: fields,
			//     query: andKeyword.trim(),
			//   }
			// };
		} else if (
			!Util.getEmpty(andKeyword) &&
			reqParams.phrase_search === 'Y'
		) {
			esQuery = {
				bool: {
					must: [
						{
							terms: {
								'speaker_id.keyword':
									reqParams.speaker_id.split(','),
							},
						},
					],
				},
			};
		} else {
			esQuery = {
				bool: {
					must: [
						{
							terms: {
								'speaker_id.keyword':
									reqParams.speaker_id.split(','),
							},
						},
					],
				},
			};
		}
		for (req in reqParams) {
			const reqValue = reqParams[req];
			const termsQuery = {
				terms: {},
			};
			if (req === 'speaker_id') req = 'speaker_id.keyword'; // 추후 매핑 변경

			if (!Util.getEmpty(reqValue)) {
				if (termsField.includes(req)) {
					paramSplit = reqValue.split(',').map((item) => item.trim());
					termsQuery.terms[req] = paramSplit;
				}
			}

			if (!Util.getEmpty(termsQuery.terms)) {
				filterQuery.push(termsQuery);
			}
		}

		const query = {
			query: esQuery,
			aggs: {},
			size: 0,
		};

		// 키워드 클라우드 aggs
		query.aggs = {
			grp_speaker: {
				terms: {
					field: 'speaker_id.keyword',
					size: reqParams.size,
				},
				aggs: {
					per_year: {
						date_histogram: {
							field: 'meeting_date',
							interval: 'year',
							format: 'yyyy',
						},
						aggs: {
							confer_num: {
								cardinality: {
									field: 'confer_num',
								},
							},
						},
					},
				},
			},
		};
		// return 검색 쿼리
		return query;
	},
	// 확인결과 현재 사용하지 않는 코드입니다.
	getGatewayServiceQuery: async (reqParams) => {
		const {searchword} = reqParams;
		let andKeyword = '';
		const config = ser_index_config.autocomplete;

		const fields = config.field.searchField || [];
		const highlightField = config.field.highlightField || [];

		const size = Number(reqParams.size);

		let esQuery = {};

		// keywrod 체크- | ! - 검사
		if (!Util.getEmpty(searchword)) {
			const keywordSplit = searchword.split(' ');
			keywordSplit.forEach((value) => {
				andKeyword += `${value} `;
			});
		}

		// 쿼리생성
		if (!Util.getEmpty(andKeyword)) {
			// and
			esQuery = {
				simple_query_string: {
					fields,
					query: andKeyword.trim(),
					default_operator: 'AND',
				},
			};
		}

		const query = {
			query: esQuery,
			aggs: {},
			size,
		};

		if (!Util.getEmpty(highlightField)) {
			query.highlight = {
				fields: {},
			};
			for (field of highlightField) {
				query.highlight.fields[field] = {};
			}
		}

		// return 검색 쿼리
		return query;
	},
};
