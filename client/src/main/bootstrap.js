(function() {
	"use strict";

	var ApplicationTask = require('./launch-proxicity-task');
	var Source = require('./server-dataset-source');
	var ApplicationWidget = require('./app-widget');

	var failFast = require('./fail-fast');

	failFast.crashOnUnhandledException();
	failFast.crashOnResourceLoadingError();

	$(document).ready(startApplication());

	function startApplication() {
		var container = $('.app-container');

		var task = ApplicationTask.start(Source.newSource('/dataset'));
		ApplicationWidget.render(container, task);
	}
}());
