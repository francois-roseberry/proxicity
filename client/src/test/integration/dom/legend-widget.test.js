(function () {
    'use strict';
   
	var MapModel = require('./map-model');
	var Source = require('./fake-home-source');
	var LegendWidget = require('./legend-widget');
	
	var describeInDom = require('./dom-fixture').describeInDom;

    describeInDom('A legend widget', function (domContext) {
		var model;
		
		beforeEach(function (done) {
			var source = Source.newSource();
			source.getHomes()
				.subscribe(function (homes) {
					model = MapModel.newModel(homes);
					LegendWidget.render(domContext.rootElement, model);
				}, done, done);
				
			source.resolve();
		});
		
		it('is rendered in the given container', function () {
			domContext.assertOneOf('.legend-container');
		});
		
		it('render a header region', function () {
			domContext.assertOneOf('.legend-header');
		});
		
		it('renders a list of items', function () {
			domContext.assertOneOf('.legend-items');
		});
		
		it('renders two items in the list', function () {
			domContext.assertElementCount('.legend-item', 2);
		});
		
		it('renders a no-data category with a thumbnail', function () {
			domContext.assertOneOf('.legend-no-data-category');
			domContext.assertOneOf('.legend-no-data-category .legend-thumbnail');
		});
		
		it('renders a bounded category with a thumbnail and max and min', function () {
			domContext.assertOneOf('.legend-bounded-category');
			domContext.assertOneOf('.legend-bounded-category .legend-thumbnail');
			domContext.assertOneOf('.legend-bounded-category .legend-bounds-upper');
			domContext.assertOneOf('.legend-bounded-category .legend-bounds-lower');
		});
	});
}());