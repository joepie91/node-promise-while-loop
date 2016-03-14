'use strict';

const Promise = require("bluebird");
const whileLoop = require("./");

let i = 0;

Promise.try(() => {
	return whileLoop((lastResult) => {
		return Promise.try(() => {
			return lastResult < 20;
		}).delay(500);
	}, (lastResult) => {
		return Promise.try(() => {
			let currentIteration = i;
			i += 1;
			
			console.log(`Last iteration: ${lastResult} // Current iteration: ${currentIteration} // Next iteration: ${i}`);
			
			return currentIteration;			
		});
	});
}).then((results) => {
	console.log(`i: ${i} // Results: ${results}`)
})
