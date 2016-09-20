(function () {
	"use strict";
	
	var request = require('request');
	var cheerio = require('cheerio');
	var Rx = require('rx');
	
	var BASE_URL = "http://www.kijiji.ca";

	function KijijiDetailsProvider(provider) {
		this._provider = provider;
	}

	/**
	 * Get homes by scraping the appartment ads on Kijiji (since their API is now closed for new API accounts)
	 *
	 * Ebay has an API for getting ads. Maybe it works for Kijiji as well ?
	 */
	KijijiDetailsProvider.prototype.getHomes = function () {	
		return this._provider.getHomes().flatMap(function (homes) {
			// If this doesn't work, return the observable directly
			var observables = homes.map(function (home) {
				return getHomeDetails(home.url).map(function (details) {
					return {
						name: home.name,
						url: home.url,
						price: details.price,
						address: details.address
					};
				});
			});
			
			return Rx.Observable.forkJoin(observables);
		});
	};
	
	function getHomeDetails(url) {
		var subject = new Rx.AsyncSubject();
		request(BASE_URL + url, function (error, response, html) {
			if (error) {
				subject.onError(error);
				return;
			}
			
			var $ = cheerio.load(html);
			// Even though there's only one node, we have to do an implicit iteration
			$('.ad-attributes').each(function () {
				var table = $(this);
				
				var priceNode = table.find('[itemprop=price] strong');
				
				var trAdressNode = table.find('#MapLink').parent();
				$('a', trAdressNode).remove();
				
				subject.onNext({address: trAdressNode.text().trim(), price: priceNode.text()});
			});
			
			subject.onCompleted();
		});
		
		return subject;
	}

	module.exports = KijijiDetailsProvider;
}());