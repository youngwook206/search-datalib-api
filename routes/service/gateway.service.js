const APPROOT = require('app-root-path');
const deepcopy = require('deepcopy');
const request = require('request-promise');

const Payload = require(`${APPROOT}/routes/models/payload/payload`);
const Util = require(`${APPROOT}/util/util`);

// Process Execute Query
module.exports = {
	setOpenQuerylog: async (indexNm, keyword, searchResult) => {
		try {
			const logSet = Payload.setLog4OpenQueryLog(
				indexNm,
				keyword,
				searchResult,
			);
			const logOption = Util.makeURL4QueryLog(logSet);

			return request(logOption);
		} catch (err) {
			throw err;
		}
	},
	getServiceResult: async (reqQuery) => {
		try {
			// 1. Deep Copy Requset Object
			const reqParams = deepcopy(reqQuery);
			let result = undefined;

			// 2. Request to OpenQuery Gateway
			// TEST URL : http://localhost:19200/service/autocomplete?keyword=aerom&label=autocomplete
			const serviceURL = Util.makeURL4Service(reqParams);
			const isHealthCheck = (
				await Util.isGatewayHealthCheck(serviceURL)
			)();
			if (isHealthCheck) {
				result = await request(serviceURL);
				if (result.body !== undefined) result = JSON.parse(result.body);
			}

			return JSON.parse(result);
		} catch (err) {
			throw err;
		}
	},
};
