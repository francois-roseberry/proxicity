(function () {
	"use strict";
	
	var request = require('request');
	var Rx = require('rx');
	var _ = require('underscore');
	var precondition = require('./infrastructure/contract.js').precondition;
	
	var BASE_URL = 'http://maps.googleapis.com/maps/api/geocode/json?address=';

	function GeocodingProvider(provider) {
		precondition(provider && _.isFunction(provider.getHomes), 'A GeocodingProvider requires a provider');
		
		this._provider = provider;
	}

	GeocodingProvider.prototype.getHomes = function() {
		var subject = new Rx.AsyncSubject();
		this._provider.getHomes().subscribe(function (homes) {
			var subjects = homes.map(function(home) {
				var encodedAddress = encodeURIComponent(home.address);
				var url	= BASE_URL + encodedAddress + "&sensor=false";
				
				return geocodingSubject(url, home);
			});
			
			Rx.Observable.forkJoin(subjects).subscribe(function (geocodedHomes) {
				subject.onNext(geocodedHomes);
				subject.onCompleted();
			});
		});
		
		return subject.asObservable();
	};
	
	function geocodingSubject(url, home) {
		var subject = new Rx.AsyncSubject();
		request(url, function (error, response, body) {
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
}());