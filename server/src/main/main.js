(function () {
	"use strict";
	
	var fs = require('fs');
	var path = require('path');
	var ProxicityServer = require('./proxicity-server');
	var program = require('commander');
	
	var ProviderChain = require('./provider-chain');
	
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
		
	fs.access(program.cache, fs.R_OK | fs.W_OK, function (err) {
		if (err) {
			console.log('Cache directory is inexistent or inaccessible by the application');
			return;
		}
		
		fs.stat(program.cache, function (err, stats) {
			if (err) {
				console.log('Cannot access cache directory, details : ' + err);
				return;
			}
			
			if (!stats.isDirectory()) {
				console.log('Cache must be a directory');
				return;
			}
			
			startServer();
		});
	});
	
	function startServer() {
		ProxicityServer.create({
			port: program.port || 3000,
			provider: createProvider(),
			webclient: program.webclient
		});
	}
	
	function createProvider() {
		return ProviderChain.fromKijiji()
			.cached(path.join(program.cache, 'kijiji-homes.json'))
			.geocoded()
			.cached(path.join(program.cache, 'geocoded-homes.json'))
			.priceCorrected()
			.withGroceries(key)
			.cached(path.join(program.cache, 'homes-with-groceries.json'));
	}
}());