"use strict";

const _ = require('underscore');
const precondition = require('./infrastructure/contract.js').precondition;

function PriceExtractor(provider) {
	precondition(provider && _.isFunction(provider.getHomes), 'A PriceExtractor requires a provider');
	
	this._provider = provider;
}

PriceExtractor.prototype.getHomes = function () {
	return this._provider.getHomes().map(function (homes) {
		return homes.map(function (home) {
			if (home.price.endsWith('$')) {
				var priceString = home.price.substring(0, home.price.length - 1).replace(/\s/g, '');
				home.price = parseInt(priceString);
			} else {
				delete home.price;
			}
			return home;
		});
	});
};

module.exports = PriceExtractor;