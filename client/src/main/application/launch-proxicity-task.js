'use strict';

var precondition = require('./contract').precondition;

var DisplaySheetTask = require('./display-sheet-task');

exports.start = (source) => {
	precondition(source, 'Application task requires a data source');

	return new LaunchProxicityTask(source);
};

class LaunchProxicityTask {
	constructor(source) {
		this._status = new Rx.BehaviorSubject(LOADING_STATUS);
		var status = this._status;

		source.getDataset()
			.subscribe(function (dataset) {
				var task = DisplaySheetTask.start(dataset);
				status.onNext(readyStatus(task));
			});
	}

	status() {
		return this._status.asObservable();
	}
}

var LOADING_STATUS = {
	statusName: 'loading',
	match: (visitor) => {
		visitor.loading();
	}
};

function readyStatus(task) {
	return {
		statusName: 'ready',
		match: (visitor) => {
			visitor.ready(task);
		}
	};
}
