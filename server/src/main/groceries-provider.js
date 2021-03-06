"use strict";

const request = require('request');
const Rx = require('rx');
const _ = require('underscore');
const precondition = require('./infrastructure/contract.js').precondition;

const URL_TEMPLATE = 'https://maps.googleapis.com/maps/api/place/nearbysearch' +
	'/json?location={0},{1}&rankby=distance&types=grocery_or_supermarket&key={2}';

class GroceriesProvider {
	constructor(provider, key) {
		precondition(provider && _.isFunction(provider.getHomes), 'A GroceriesProvider requires a provider');
		precondition(_.isString(key), 'A GroceriesProvider requires an API key');
		
		this._provider = provider;
		this._key = key;
	}
	
	getHomes() {
		var key = this._key;
		var subject = new Rx.AsyncSubject();
		this._provider.getHomes().subscribe((homes) => {
			var subjects = homes.map(toGrocerySubject(key));
			
			Rx.Observable.forkJoin(subjects).subscribe((homesWithGroceries) => {
				subject.onNext(homesWithGroceries);
				subject.onCompleted();
			});
		});
		
		return subject.asObservable();
	}
}

function toGrocerySubject(key) {
	return (home) => {
		var url	= URL_TEMPLATE
			.replace('{0}', home.coords.lat)
			.replace('{1}', home.coords.lng)
			.replace('{2}', key);
	
		return grocerySubject(url, home);
	};
}

function grocerySubject(url, home) {
	var subject = new Rx.AsyncSubject();
	request(url, (error, response, body) => {
		if (error) {
			subject.onError(error);
		}
		
		var json = JSON.parse(body);
		home.grocery = {
				name: json.results[0].name,
				address: json.results[0].vicinity
			};
		
		subject.onNext(home);
		subject.onCompleted();
	});
	return subject;
}

module.exports = GroceriesProvider;