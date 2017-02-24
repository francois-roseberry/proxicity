(function () {
    'use strict';
    
	var DisplaySheetTask = require('./display-sheet-task');
	var SheetWidget = require('./sheet-widget');
	
	var describeInDom = require('./dom-fixture').describeInDom;
	var testDataset = require('./test-dataset');

    describeInDom('A sheet widget', function (domContext) {
		beforeEach(function () {
			var dataset = testDataset.dataset(true);
			var task = DisplaySheetTask.start(dataset);
			SheetWidget.render(domContext.rootElement, task);
		});
		
		it('is rendered in the given container', function () {
			domContext.assertOneOf('.sheet-container');
		});
		
		it('renders a container for the visualization', function () {
			domContext.assertOneOf('.visualization-container');
		});
	});
}());