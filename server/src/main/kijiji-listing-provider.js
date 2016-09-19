(function () {
	"use strict";
	
	var request = require('request');
	var cheerio = require('cheerio');
	var Rx = require('rx');
	
	var BASE_URL = "http://www.kijiji.ca";

	function KijijiListingProvider() {}

	/**
	 * Get homes by scraping the appartment ads on Kijiji (since their API is now closed for new API accounts)
	 *
	 * Ebay has an API for getting ads. Maybe it works for Kijiji as well ?
	 */
	KijijiListingProvider.prototype.getHomes = function () {	
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
			var homes = [];
			$('.title a').each(function () {
				var node = $(this);
				var name = removeStartingJunkCharactersFrom(node.text());			
				var url = node.attr('href');
				
				homes.push({
					name: name,
					url: url
				});
			});
			
			subject.onNext(homes);
			subject.onCompleted();
		});
		
		return subject.asObservable();
	};
	
	function removeStartingJunkCharactersFrom(name) {
		return name.substring(1).trim();
	}

	module.exports = KijijiListingProvider;
}());