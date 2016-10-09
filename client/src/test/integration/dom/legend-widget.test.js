(function () {
    'use strict';
   
	var MapModel = require('./map-model');
	var LegendWidget = require('./legend-widget');
	
	var describeInDom = require('./dom-fixture').describeInDom;
	var testHomes = require('./test-homes');

    describeInDom('A legend widget', function (domContext) {
		var model;
		var categories;
		
		beforeEach(function (done) {
			model = MapModel.newModel(testHomes.homes());
			LegendWidget.render(domContext.rootElement, model);
			
			model.categories().subscribe(function (cats) {
				categories = cats;
			}, done, done);
		});
		
		it('is rendered in the given container', function () {
			domContext.assertOneOf('.legend-container');
		});
		
		it('render a header region', function () {
			domContext.assertOneOf('.legend-header');
		});
		
		it('renders a criteria region with a span and a criteria selector in it', function () {
			domContext.assertOneOf('.legend-criteria');
			domContext.assertOneOf('.legend-criteria span');
			domContext.assertOneOf('.legend-criteria .criteria-selector');
		});
		
		it('puts one option for each criteria in the criteria selector', function () {
			domContext.assertElementCount('.criteria-selector option', model.criteria().length);
		});
		
		it('renders a list of items', function () {
			domContext.assertOneOf('.legend-items');
		});
		
		it('renders an item in the list for each category', function () {
			domContext.assertElementCount('.legend-item', categories.length);
		});
		
		it('renders a no-data category with a thumbnail', function () {
			domContext.assertOneOf('.legend-no-data-category');
			domContext.assertOneOf('.legend-no-data-category .legend-thumbnail');
		});
		
		it('renders a bounded category with a thumbnail and bounds', function () {
			domContext.assertOneOf('.legend-bounded-category');
			domContext.assertOneOf('.legend-bounded-category .legend-thumbnail');
			domContext.assertOneOf('.legend-bounded-category .legend-bounds-upper');
			domContext.assertOneOf('.legend-bounded-category .legend-bounds-lower');
		});
	});
}());