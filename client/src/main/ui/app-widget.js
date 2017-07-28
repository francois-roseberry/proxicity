(function () {
    'use strict';

	var precondition = require('./contract').precondition;
	var i18n = require('./i18n').i18n();

	var LoadingIndicator = require('./loading-indicator');
	var SheetWidget = require('./sheet-widget');

  exports.render = (container, task) => {
		precondition(container, 'Application Widget requires a container');
		precondition(task, 'ApplicationWidget requires an ApplicationTask');

    var widgetContainer = d3.select(container[0])
        .append('div')
			  .classed('app-widget-container', true);

		task.status()
			.subscribe((status) => {
				status.match({
					loading: () => {
						LoadingIndicator.render(widgetContainer, i18n.LOADING);
					},
					ready: (task) => {
						widgetContainer.selectAll('*').remove();

						SheetWidget.render($(widgetContainer[0]), task);
					}
				});
			});
    };
}());
