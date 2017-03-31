"use strict";

const express = require('express');
const app = express();
const _ = require('underscore');
const precondition = require('./infrastructure/contract').precondition;

exports.create = function (config) {
	precondition(config, 'Proxicity server requires a configuration object');
	precondition(_.isNumber(config.port),
		'Proxicity server needs a port number in its configuration');
	precondition(config.provider && _.isFunction(config.provider.getDataset),
		'Proxicity server needs a dataset provider in its configuration');
	precondition(_.isString(config.webclient),
		'Proxicity server requires a webclient directory');
	
	app.use(express.static(config.webclient));
	
	app.get('/dataset', function (request, response) {
		config.provider.getDataset().subscribe(function (dataset) {
			response.json(dataset);
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