(function () {
	"use strict";
	
	var request = require('request');
	var cheerio = require('cheerio');
	var Rx = require('rx');
	
	var BASE_URL = "http://www.kijiji.ca";

	function KijijiProvider() {}

	/**
	 * Get homes by scraping the appartment ads on Kijiji (since their API is now closed for new API accounts)
	 *
	 * Ebay has an API for getting ads. Maybe it works for Kijiji as well ?
	 */
	KijijiProvider.prototype.getHomes = function () {	
		var urls = {
			'3 1/2': '/b-appartement-condo-3-1-2/ville-de-quebec/c213l1700124',
			'4 1/2': '/b-appartement-condo-4-1-2/ville-de-quebec/c214l1700124'
		};
		
		var subject = new Rx.AsyncSubject();
		
		request(BASE_URL + urls['3 1/2'], function (error, response, html) {
			if (error) {
				subject.onError(error);
				return;
			}
			
			var $ = cheerio.load(html);
			var observables = [];
			$('.title a').each(function () {
				var node = $(this);
				var name = removeStartingJunkCharactersFrom(node.text());			
				var url = node.attr('href');
				
				var observable = getHomeDetails(url).map(function (details) {
					return {
						name: name,
						url: url,
						price: details.price,
						address: details.address
					};
				});
				observables.push(observable);
			});
			
			Rx.Observable.forkJoin(observables).subscribe(function (homes) {
				subject.onNext(homes);
				subject.onCompleted();
			});
		});
		
		return subject.asObservable();
	};
	
	function removeStartingJunkCharactersFrom(name) {
		return name.substring(1).trim();
	}
	
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

	module.exports = KijijiProvider;
}());