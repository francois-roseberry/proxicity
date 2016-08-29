(function () {
	"use strict";
	
	var express = require('express');
	var app = express();
	var homes = require('./fake-homes.js').homes;
	var Rx = require('rx');
	var _ = require('underscore');
	
	var CachedProvider = require('./cached-provider.js');
	var KijijiProvider = require('./kijiji-provider.js');
	var GeocodingProvider = require('./geocoding-provider.js');

	// Arg 0 will be node
	// Arg 1 will be the name of this file
	// Arg 2 will be the directory to serve
	// Arg 3 will be the optional test flag
	var clientDirectory = process.argv[2] || '/';
	var testFlag = process.argv[3] && process.argv[3] === '--test';
	var provider = testFlag ? createTestProvider() : createRealProvider();

	app.use(express.static(clientDirectory));

	app.get('/homes', function (request, response) {
		provider.getHomes().subscribe(function (homes) {
			response.send(homes);
		}, function (error) {
			response.send(error);
		}, _.noop);
	});

	var port = process.env.PORT || 3000;

	app.listen(port);
	console.log('Server started' + (testFlag ? ' in test mode' : ''));
	console.log('Serving directory ' + clientDirectory + ' on port ' + port);
	
	function createTestProvider() {
		var subject = new Rx.AsyncSubject();
		subject.onNext(homes());
		subject.onCompleted();
		return {
			getHomes: function() {return subject.asObservable();}
		};
	}
	
	function createRealProvider() {
		return new CachedProvider(
			new GeocodingProvider(
				new CachedProvider(
					new KijijiProvider(),
					'cache/kijiji-homes.json'
					)
				),
			'cache/geocoded-homes.json');
	}
}());