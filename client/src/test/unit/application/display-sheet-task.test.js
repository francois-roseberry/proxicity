(function() {
	'use strict';
	
	var DisplaySheetTaskTask = require('./display-sheet-task');
	
	var testDataset = require('./test-dataset');

	describe('The DisplaySheetTask', function () {
		var task;
		var currentStatus;
		
		beforeEach(function () {
			var dataset = testDataset.dataset(true);
			task = DisplaySheetTaskTask.start(dataset);
			
			task.status().subscribe(function (status) {
				currentStatus = status;
			});
		});
	
		it('is initially in the ready state', function () {
			expect(currentStatus.statusName).to.eql('ready');
		});
		
		it('becomes displayed when visualization rendering is done', function () {
			var visualization = {};
			task.visualizationRendered(visualization);
			
			expect(currentStatus.statusName).to.eql('displayed');
		});
	});
}()); 