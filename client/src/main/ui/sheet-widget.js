(function () {
    'use strict';
   
	var precondition = require('./contract').precondition;
	
	var MapModel = require('./map-model');
	var MapWidget = require('./map-widget');
	var LegendWidget = require('./legend-widget');

    exports.render = function (container, task) {
		precondition(container, 'Sheet Widget requires a container');
		precondition(task, 'Sheet Widget requires a DisplaySheetTask');
				
		var sheetContainer = d3.select(container[0])
			.append('div')
			.classed('sheet-container', true);
		
		LegendWidget.render($(sheetContainer[0]), task);
		
		var visualizationContainer = sheetContainer
			.append('div')
			.classed('visualization-container', true);
		
		task.status().subscribe(function (status) {
			status.match({
				ready: displayVisualization($(visualizationContainer[0]), task),
				displayed: _.noop
			});
		});
    };
    
    function displayVisualization(container, task) {
    	return function (dataset) {
    		var model = MapModel.newModel(dataset);
    		MapWidget.render(container, model);
    		task.visualizationRendered(model);
    	};
    }
}());