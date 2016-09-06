(function () {
	"use strict";
	
	var express = require('express');
	var app = express();
	var _ = require('underscore');
	var precondition = require('./infrastructure/contract').precondition;
	
	exports.create = function (config) {
		precondition(config, 'Proxicity server requires a configuration object');
		precondition(_.isNumber(config.port),
			'Proxicity server needs a port number in its configuration');
		precondition(config.provider && _.isFunction(config.provider.getHomes),
			'Proxicity server needs a homes provider in its configuration');
		precondition(_.isString(config.webclient),
			'Proxicity server requires a webclient directory');
		
		app.use(express.static(config.webclient));
	
		app.get('/homes', function (request, response) {
			config.provider.getHomes().subscribe(function (homes) {
				response.json(homes);
			}, function (error) {
				response.status(500).json({message: error.message});
			}, _.noop);
		});
		
		app.listen(config.port, function () {
			console.log('Proxicity server started');
			console.log('Serving directory ' + config.webclient + ' on port ' + config.port);
		});
		
		return app;
	};
}());