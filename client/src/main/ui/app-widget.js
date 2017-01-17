(function () {
    'use strict';
   
	var precondition = require('./contract').precondition;
	var i18n = require('./i18n').i18n();
	
	var MapModel = require('./map-model');
	var MapWidget = require('./map-widget');
	var LoadingIndicator = require('./loading-indicator');
	var LegendWidget = require('./legend-widget');

    exports.render = function (container, task) {
		precondition(container, 'Application Widget requires a container');
		precondition(task, 'ApplicationWidget requires an ApplicationTask');
            
        var widgetContainer = d3.select(container[0])
            .append('div')
			.classed('app-widget-container', true);
			
		task.status()
			.subscribe(function (status) {
				status.match({
					loading: function () {
						LoadingIndicator.render(widgetContainer, i18n.LOADING);
					},
					ready: function (dataset) {
						var model = MapModel.newModel(dataset);
						widgetContainer.selectAll('*').remove();
						
						LegendWidget.render($(widgetContainer[0]), model);
						
						MapWidget.render($(widgetContainer[0]), model);
					}
				});
			});
    };
}());