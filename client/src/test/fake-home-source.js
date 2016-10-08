(function() {
	'use strict';
	
	var testHomes = require('./test-homes');

	exports.newSource = function() {
		return new FakeHomeSource();
	};

	function FakeHomeSource() {
		this._homes = new Rx.AsyncSubject();
	}
	
	FakeHomeSource.prototype.resolve = function () {
		this._homes.onNext(testHomes.homes());
		this._homes.onCompleted();
	};
	
	FakeHomeSource.prototype.getHomes = function () {
		return this._homes.asObservable();
	};
}());
