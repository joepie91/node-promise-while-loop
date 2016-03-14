# promise-while-loop

An asynchronous while-loop implementation with full support for Promises - both for the main logic, and for the predicate function.

## A word of caution

Think __very carefully__ before using a while loop for asynchronous code. In many cases, it will be cleaner to simply *use recursion* - if the code is asynchronous, this will never cause stack overflows, no matter how many levels you nest. In fact, recursion is what this module uses internally; it's the only real way to implement asynchronous loops.

A simple example of using recursion, __*without `promise-while-loop`*__:

```javascript
var Promise = require("bluebird");
var bhttp = require("bhttp");

function loop(pageNumber) {
	return Promise.try(function() {
		return bhttp.get("http://api.example.com/page/" + pageNumber);
	}).then(function(response) {
		if (response.headers["x-next-page"] != null) {
			return Promise.try(function() {
				return loop(response.headers["x-next-page"]);
			}).then(function(recursiveResults) {
				return [response.body].concat(recursiveResults);
			});
		} else {
			// Done looping
			return [response.body];
		}
	});
}

Promise.try(function() {
	var i = 0;
	
	return loop(1);
}).then(function(results) {
	// Now `results` is an array that contains the response for each HTTP request made.
})
```

If you're sure that you can write cleaner code with a while loop than through recursion, then this is the module for you :)

## License

[WTFPL](http://www.wtfpl.net/txt/copying/) or [CC0](https://creativecommons.org/publicdomain/zero/1.0/), whichever you prefer. A donation and/or attribution are appreciated, but not required.

## Donate

My income consists largely of donations for my projects. If this module is useful to you, consider [making a donation](http://cryto.net/~joepie91/donate.html)!

You can donate using Bitcoin, PayPal, Flattr, cash-in-mail, SEPA transfers, and pretty much anything else.

## Contributing

Pull requests welcome. Please make sure your modifications are in line with the overall code style, and ensure that you're editing the files in `src/`, not those in `lib/`.

Build tool of choice is `gulp`; simply run `gulp` while developing, and it will watch for changes.

Be aware that by making a pull request, you agree to release your modifications under the licenses stated above.

## Usage

A simple (contrived) example:

```javascript
var i = 0;

Promise.try(function() {
	return whileLoop(function(lastResult) {
		return Promise.try(function() {
			return lastResult < 20;
		}).delay(500); // Artificial delay, to prove that this really is asynchronous
	}, function(lastResult) {
		return Promise.try(function() {
			var currentIteration = i;
			i += 1;
			
			console.log("Last iteration: " + lastResult + " // Current iteration: " + currentIteration + " // Next iteration: " + i);
			
			return currentIteration;			
		});
	});
}).then(function(results) {
	console.log("i: " + i + " // Results: " + results)
});

```

## API

### whileLoop(predicate, func)

Initiates the loop. The loop will always run at least once - the `predicate` function will only be called *after* the first iteration.

* __predicate__: This should be a function, returning either `true` or `false` (or a Promise that resolves to either of those) - depending on whether the loop should continue running or not. It receives a single argument, containing the result (return/resolve value) of the 'main function' from the last iteration.
* __func__: This should be a function, optionally returning a Promise or synchronous value. It's the 'main' function that contains the 'body' of the loop - ie. the code that is executed on each iteration. It also receives a single argument, with the result of the last operation - except for the first iteration, where it contains `undefined`, as there is no previous result to provide.

The `whileLoop` call will return a Promise, __collect the results__ into an (ordered) array, and resolve with that array once the loop has finished. Any kind of rejection/thrown error, in either the `predicate` function or the main body, will immediately abort the loop, and reject the returned Promise with the error that caused it.
