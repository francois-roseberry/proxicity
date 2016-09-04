(function() {
	"use strict";
	
	var ApplicationTask = require('./launch-proxicity-task');
	var Source = require('./server-home-source');
	var ApplicationWidget = require('./app-widget');
	
	var failFast = require('./fail-fast');
	
	failFast.crashOnUnhandledException();
    	failFast.crashOnResourceLoadingError();

	$(document).ready(startApplication());

	function startApplication() {
		var container = $('.app-container');

		var task = ApplicationTask.start(Source.newSource('/homes'));
		ApplicationWidget.render(container, task);
	}
}());

