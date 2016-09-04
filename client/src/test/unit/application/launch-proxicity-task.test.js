(function() {
	'use strict';
	
	var FakeSource = require('./fake-home-source');
	var LaunchProxicityTask = require('./launch-proxicity-task');

	describe('The LaunchProxicityTask', function () {
		var task;
		var source;
		var currentStatus;
		
		beforeEach(function () {
			source = FakeSource.newSource();
			task = LaunchProxicityTask.start(source);
			
			task.status().subscribe(function (status) {
				currentStatus = status;
			});
		});
	
		it('is initially in the loading state', function () {
			expect(currentStatus.statusName).to.eql('loading');
		});
		
		it('becomes ready when source has loaded', function () {
			source.resolve();
			
			expect(currentStatus.statusName).to.eql('ready');
		});
	});
}()); 