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
		
		it('renders a list of items', function () {
			domContext.assertOneOf('.legend-items');
		});
		
		it('renders only an item in the list', function () {
			domContext.assertOneOf('.legend-item');
		});
	});
}());