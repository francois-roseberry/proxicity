'use strict';

var precondition = require('./contract').precondition;

exports.start = (dataset) => {
	precondition(dataset, 'DisplaySheetTask requires a data set');

	return new DisplaySheetTask(dataset);
};

class DisplaySheetTask {
	constructor(dataset) {
		this._status = new Rx.BehaviorSubject(readyStatus(dataset));
	}

	status() {
		return this._status.asObservable();
	}

	visualizationRendered(model) {
		precondition(model, 'DisplaySheetTask.visualizationRendered() requires a model');

		this._status.onNext(displayedStatus(model));
	}
}

function readyStatus(dataset) {
	return {
		statusName: 'ready',
		match: (visitor) => {
			visitor.ready(dataset);
		}
	};
}

function displayedStatus(model) {
	return {
		statusName: 'displayed',
		match: (visitor) => {
			visitor.displayed(model);
		}
	};
}
