(function() {
	'use strict';
	
	var testDataset = require('./test-dataset');

	exports.newSource = function() {
		return new FakeDatasetSource();
	};

	function FakeDatasetSource() {
		this._dataset = new Rx.AsyncSubject();
	}
	
	FakeDatasetSource.prototype.resolve = function () {
		this._dataset.onNext(testDataset.dataset());
		this._dataset.onCompleted();
	};
	
	FakeDatasetSource.prototype.getDataset = function () {
		return this._dataset.asObservable();
	};
}());
