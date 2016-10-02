(function () {
	"use strict";
	
	var path = require('path');
	var ProxicityServer = require('./proxicity-server');
	var program = require('commander');
	
	var CachedProvider = require('./cached-provider');
	var KijijiListingProvider = require('./kijiji-listing-provider');
	var KijijiDetailsProvider = require('./kijiji-details-provider');
	var GeocodingProvider = require('./geocoding-provider');
	var GroceriesProvider = require('./groceries-provider');
	var PriceExtractor = require('./price-extractor');
	
	var key = require('../../google_maps_api.key.json').key;
	
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
		return new CachedProvider(
			new GroceriesProvider(
				new PriceExtractor(
					new CachedProvider(
						new GeocodingProvider(
							new CachedProvider(
								new KijijiDetailsProvider(new KijijiListingProvider()),
								path.join(program.cache, 'kijiji-homes.json')
							)
						),
						path.join(program.cache, 'geocoded-homes.json')
					)
				),
				key
			),
			path.join(program.cache, 'homes-with-groceries.json')
		);
	}
}());