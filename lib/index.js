'use strict';

var Promise = require("bluebird");

module.exports = function promiseWhile(predicate, func) {
	var results = [];

	function iteration(value) {
		return Promise.try(function () {
			return func(value);
		}).then(function (result) {
			results.push(result);

			return Promise.try(function () {
				return predicate(result);
			}).then(function (predicateResult) {
				if (predicateResult) {
					return iteration(result);
				} else {
					return results;
				}
			});
		});
	}

	return iteration();
};