(function() {
	'use strict';
	
	var RestClient = require('./rest-client');
	
	var precondition = require('./contract').precondition;

	exports.newSource = function (url) {
		precondition(_.isString(url) && url.length > 0, 'ServerDatasetSource requires an url');
		
		return new ServerDatasetSource(url);
	};

	function ServerDatasetSource(url) {
		this._url = url;
	}
	
	ServerDatasetSource.prototype.getDataset = function () {
		return RestClient.get(this._url)
			.map(function (dataset) {
				return dataset;
			});
	};
}());
