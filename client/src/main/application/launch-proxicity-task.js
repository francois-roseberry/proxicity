(function() {
	'use strict';

	var precondition = require('./contract').precondition;
	
	var DisplaySheetTask = require('./display-sheet-task');

	exports.start = function(source) {
		precondition(source, 'Application task requires a data source');
		
		return new LaunchProxicityTask(source);
	};
	
	function LaunchProxicityTask(source) {
		this._status = new Rx.BehaviorSubject(LOADING_STATUS);
		var status = this._status;
			
		source.getDataset()
			.subscribe(function (dataset) {
				// TODO : instead create a DisplaySheetTask with the dataset
				var task = DisplaySheetTask.start(dataset);
				status.onNext(readyStatus(task));
			});
	}
	
	LaunchProxicityTask.prototype.status = function () {
		return this._status.asObservable();
	};
	
	var LOADING_STATUS = {
		statusName: 'loading',
		match: function (visitor) {
			visitor.loading();
		}
	};
	
	function readyStatus(task) {
		return {
			statusName: 'ready',
			match: function (visitor) {
				visitor.ready(task);
			}
		};
	}
}()); 