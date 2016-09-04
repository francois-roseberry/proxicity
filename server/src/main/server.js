(function () {
	"use strict";
	
	var path = require('path');
	var express = require('express');
	var app = express();
	var homes = require('./fake-homes.js').homes;
	var Rx = require('rx');
	var _ = require('underscore');
	var program = require('commander');
	
	var CachedProvider = require('./cached-provider.js');
	var KijijiProvider = require('./kijiji-provider.js');
	var GeocodingProvider = require('./geocoding-provider.js');
	
	program
		.version('0.1')
		.option('-w, --webclient <directory>', 'The directory served. ' +
				'Must already exist')
		.option('-c, --cache <directory>', 'The cache directory that the' +
				'server will use. Must already exist')
		.option('-t, --test', 'Starts the server with a test data set')
		.parse(process.argv);

	var provider = program.test ? createTestProvider() : createRealProvider();

	app.use(express.static(program.webclient));
	
	app.get('/homes', function (request, response) {
		provider.getHomes().subscribe(function (homes) {
			response.json(homes);
		}, function (error) {
			response.send(error);
		}, _.noop);
	});

	var port = process.env.PORT || 3000;

	app.listen(port, function () {
		console.log('Proxicity server started' + (program.test ? ' in test mode' : ''));
		console.log('Serving directory ' + program.webclient + ' on port ' + port);
	});
	
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
					path.join(program.cache, 'kijiji-homes.json')
				)
			),
			path.join(program.cache, 'geocoded-homes.json')
		);
	}
}());