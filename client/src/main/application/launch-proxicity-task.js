(function() {
	'use strict';

	var precondition = require('./contract').precondition;

	exports.start = function(source) {
		precondition(source, 'Application task requires a data source');
		
		return new LaunchProxicityTask(source);
	};
	
	function LaunchProxicityTask(source) {
		this._status = new Rx.BehaviorSubject(LOADING_STATUS);
		var status = this._status;
			
		source.getDataset()
			.subscribe(function (dataset) {
				status.onNext(readyStatus(dataset));
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
	
	function readyStatus(dataset) {
		return {
			statusName: 'ready',
			match: function (visitor) {
				visitor.ready(dataset);
			}
		};
	}
}()); 