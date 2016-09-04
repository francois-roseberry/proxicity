(function() {
    "use strict";

	var ApplicationTask = require('./launch-proxicity-task');
	var Source = require('./fake-home-source');
    var Widget = require('./app-widget');

    var describeInDom = require('./dom-fixture').describeInDom;

    describeInDom('An application widget', function(domContext) {
		var source;
		
        beforeEach(function() {
			source = Source.newSource();
			var task = ApplicationTask.start(source);
            Widget.render(domContext.rootElement, task);
        });

        it('is rendered in the given container', function() {
            domContext.assertOneOf('.app-widget-container');
        });
		
		it('is initially empty, with a loading-indicator', function () {
			domContext.assertOneOf('[data-ui=loading-indicator]');
			domContext.assertNothingOf('.proxicity-map-container');
			domContext.assertNothingOf('.legend-container');
		});
		
		it('when app is ready, remove the loading indicator and renders a map with a legend', function () {
			source.resolve();
			
			domContext.assertNothingOf('[data-ui=loading-indicator]');
			domContext.assertOneOf('.proxicity-map-container');
			domContext.assertOneOf('.legend-container');
		});
    });
}()); 