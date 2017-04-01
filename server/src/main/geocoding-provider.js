"use strict";
	
const request = require('request');
const Rx = require('rx');
const _ = require('underscore');
const precondition = require('./infrastructure/contract.js').precondition;

const BASE_URL = 'http://maps.googleapis.com/maps/api/geocode/json?address=';

class GeocodingProvider {
	constructor(provider) {
		precondition(provider && _.isFunction(provider.getHomes), 'A GeocodingProvider requires a provider');
		
		this._provider = provider;
	}
	
	getHomes() {
		var subject = new Rx.AsyncSubject();
		this._provider.getHomes().subscribe((homes) => {
			var subjects = homes.map(toGeocodingSubject);
			
			Rx.Observable.forkJoin(subjects).subscribe((geocodedHomes) => {
				subject.onNext(geocodedHomes);
				subject.onCompleted();
			});
		});
		
		return subject.asObservable();
	}
}

function toGeocodingSubject(home) {
	var encodedAddress = encodeURIComponent(home.address);
	var url	= BASE_URL + encodedAddress + "&sensor=false";
	
	return geocodingSubject(url, home);
}

function geocodingSubject(url, home) {
	var subject = new Rx.AsyncSubject();
	request(url, (error, response, body) => {
		if (error) {
			subject.onError(error);
		}
		
		var json = JSON.parse(body);
		home.coords = {
			lat: json.results[0].geometry.location.lat,
			lng: json.results[0].geometry.location.lng
		};
		
		subject.onNext(home);
		subject.onCompleted();
	});
	return subject;
}

module.exports = GeocodingProvider;