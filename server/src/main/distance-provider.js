"use strict";

const request = require('request');
const Rx = require('rx');
const _ = require('underscore');
const precondition = require('./infrastructure/contract.js').precondition;

const URL_TEMPLATE = 'https://maps.googleapis.com/maps/api/distancematrix/json' +
	'?origins={0}&destinations={1}&mode=walking&key={2}';

class DistanceProvider {
	constructor(provider, placeType, key) {
		precondition(provider && _.isFunction(provider.getHomes), 'A DistanceProvider requires a provider');
		precondition(_.isString(placeType), 'A DistanceProvider requires a place type');
		precondition(_.isString(key), 'A DistanceProvider requires an API key');
		
		this._provider = provider;
		this._placeType = placeType;
		this._key = key;	
	}

	getHomes() {
		var key = this._key;
		var placeType = this._placeType;
		var subject = new Rx.AsyncSubject();
		this._provider.getHomes().subscribe((homes) => {
			var subjects = homes.map(toDistanceSubject(key, placeType));
			
			Rx.Observable.forkJoin(subjects).subscribe((homesWithGroceries) => {
				subject.onNext(homesWithGroceries);
				subject.onCompleted();
			});
		});
		
		return subject.asObservable();
	}
}

function toDistanceSubject(key, placeType) {
	return (home) => {
		var origin = encodeURIComponent(home.address);
		var destination = encodeURIComponent(home[placeType].address);
		var url	= URL_TEMPLATE
			.replace('{0}', origin)
			.replace('{1}', destination)
			.replace('{2}', key);
		
		return distanceSubject(url, home, placeType);
	};
}

function distanceSubject(url, home, placeType) {
	var subject = new Rx.AsyncSubject();
	request(url, (error, response, body) => {
		if (error) {
			subject.onError(error);
		}
		
		var json = JSON.parse(body);
		home[placeType].distance = json.rows[0].elements[0].distance.value;
		home[placeType].time = json.rows[0].elements[0].duration.value;
		
		subject.onNext(home);
		subject.onCompleted();
	});
	return subject;
}

module.exports = DistanceProvider;