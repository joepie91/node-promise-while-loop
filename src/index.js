'use strict';

const Promise = require("bluebird");

module.exports = function promiseWhile(predicate, func) {
	let results = [];

	function iteration(value) {
		return Promise.try(() => {
			return func(value);
		}).then((result) => {
			results.push(result);

			return Promise.try(() => {
				return predicate(result);
			}).then((predicateResult) => {
				if (predicateResult) {
					return iteration(result);
				} else {
					return results;
				}
			});
		});
	}

	return iteration();
}