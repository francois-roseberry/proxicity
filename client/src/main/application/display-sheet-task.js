(function() {
	'use strict';

	var precondition = require('./contract').precondition;

	exports.start = function(dataset) {
		precondition(dataset, 'DisplaySheetTask requires a data set');
		
		return new DisplaySheetTask(dataset);
	};
	
	function DisplaySheetTask(dataset) {
		this._status = new Rx.BehaviorSubject(readyStatus(dataset));
	}
	
	DisplaySheetTask.prototype.status = function () {
		return this._status.asObservable();
	};
	
	DisplaySheetTask.prototype.visualizationRendered = function (model) {
		precondition(model, 'DisplaySheetTask.visualizationRendered() requires a model');
		
		this._status.onNext(displayedStatus(model));
	};
	
	function readyStatus(dataset) {
		return {
			statusName: 'ready',
			match: function (visitor) {
				visitor.ready(dataset);
			}
		};
	}
	
	function displayedStatus(model) {
		return {
			statusName: 'displayed',
			match: function (visitor) {
				visitor.displayed(model);
			}
		};
	}
}()); 