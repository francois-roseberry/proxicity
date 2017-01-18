(function() {
	'use strict';
	
	var RestClient = require('./rest-client');
	var Attribute = require('./attribute');
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
				return {
					attributes: toAttributes(dataset.attributes),
					data: dataset.data
				};
			});
	};
	
	function toAttributes(attributesJson) {
		return _.map(attributesJson, function (attributeJson) {
			
			// TODO : handle the parsing errors
			return Attribute[attributeJson.type](attributeJson.id, attributeJson.name);
		});
	}
}());
