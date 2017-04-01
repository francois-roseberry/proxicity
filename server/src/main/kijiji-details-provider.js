"use strict";

const request = require('request');
const cheerio = require('cheerio');
const Rx = require('rx');

const BASE_URL = "http://www.kijiji.ca";

class KijijiDetailsProvider {
	constructor(provider) {
		this._provider = provider;
	}
	
	/**
	 * Get homes by scraping the appartment ads on Kijiji (since their API is now closed for new API accounts)
	 *
	 * Ebay has an API for getting ads. Maybe it works for Kijiji as well ?
	 */
	getHomes() {	
		return this._provider.getHomes().flatMap((homes) => {
			// If this doesn't work, return the observable directly
			var observables = homes.map((home) => {
				return getHomeDetails(home.url).map((details) => {
					return detailedHomeFrom(home, details);
				});
			});
			
			return Rx.Observable.forkJoin(observables);
		});
	}
}

function detailedHomeFrom(home, details) {
	return {
		name: home.name,
		url: home.url,
		price: details.price,
		address: details.address,
		posted: details.posted
	};
}

function getHomeDetails(url) {
	var subject = new Rx.AsyncSubject();
	request(BASE_URL + url, (error, response, html) => {
		if (error) {
			subject.onError(error);
			return;
		}
		
		var $ = cheerio.load(html);
		// Even though there's only one node, we have to do an implicit iteration
		$('.ad-attributes').each(function () {
			var table = $(this);
			
			var priceNode = table.find('[itemprop=price] strong');
			
			// TODO : extract the posted date
			var postedNode = table.find('tr:first-child td');
			
			var trAdressNode = table.find('#MapLink').parent();
			$('a', trAdressNode).remove();
			
			subject.onNext({
				address: trAdressNode.text().trim(),
				price: priceNode.text(),
				posted: postedNode.text()
			});
		});
		
		subject.onCompleted();
	});
	
	return subject;
}

module.exports = KijijiDetailsProvider;