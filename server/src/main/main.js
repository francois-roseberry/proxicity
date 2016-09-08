(function () {
	"use strict";
	
	var path = require('path');
	var ProxicityServer = require('./proxicity-server');
	var program = require('commander');
	
	var CachedProvider = require('./cached-provider');
	var KijijiProvider = require('./kijiji-provider');
	var GeocodingProvider = require('./geocoding-provider');
	var PriceExtractor = require('./price-extractor');
	
	program
		.version('0.1')
		.option('-w, --webclient <directory>', 'The directory served. ' +
				'Must already exist')
		.option('-c, --cache <directory>', 'The cache directory that the' +
				'server will use. Must already exist')
		.option('-p --port [port]', 'Port number to use. If not specified, ' +
				'defaults to 3000')
		.parse(process.argv);
	
	ProxicityServer.create({
		port: program.port || 3000,
		provider: createProvider(),
		webclient: program.webclient
	});
	
	function createProvider() {
		return new PriceExtractor(
			new CachedProvider(
				new GeocodingProvider(
					new CachedProvider(
						new KijijiProvider(),
						path.join(program.cache, 'kijiji-homes.json')
					)
				),
				path.join(program.cache, 'geocoded-homes.json')
			)
		);
	}
}());