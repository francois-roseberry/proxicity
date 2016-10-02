(function () {
	"use strict";
	
	var request = require('request');
	var Rx = require('rx');
	var _ = require('underscore');
	var precondition = require('./infrastructure/contract.js').precondition;
	
	var URL_TEMPLATE = 'https://maps.googleapis.com/maps/api/place/nearbysearch' +
		'/json?location={0},{1}&rankby=distance&types=grocery_or_supermarket&key={2}';

	function GroceriesProvider(provider, key) {
		precondition(provider && _.isFunction(provider.getHomes), 'A GroceriesProvider requires a provider');
		precondition(_.isString(key), 'A GroceriesProvider requires an API key');
		
		this._provider = provider;
		this._key = key;
	}

	GroceriesProvider.prototype.getHomes = function() {
		var key = this._key;
		var subject = new Rx.AsyncSubject();
		this._provider.getHomes().subscribe(function (homes) {
			var subjects = homes.map(function(home) {
				var url	= URL_TEMPLATE
					.replace('{0}', home.coords.lat)
					.replace('{1}', home.coords.lng)
					.replace('{2}', key);
				
				return groceriesSubject(url, home);
			});
			
			Rx.Observable.forkJoin(subjects).subscribe(function (homesWithGroceries) {
				subject.onNext(homesWithGroceries);
				subject.onCompleted();
			});
		});
		
		return subject.asObservable();
	};
	
	function groceriesSubject(url, home) {
		var subject = new Rx.AsyncSubject();
		request(url, function (error, response, body) {
			if (error) {
				subject.onError(error);
			}
			
			var json = JSON.parse(body);
			home.groceries = json.results.map(function (result) {
				return {
					name: result.name,
					address: result.vicinity
				};
			});
			
			subject.onNext(home);
			subject.onCompleted();
		});
		return subject;
	}

	module.exports = GroceriesProvider;
}());