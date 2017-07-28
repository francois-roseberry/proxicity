'use strict';

var RestClient = require('./rest-client');
var Attribute = require('./attribute');
var precondition = require('./contract').precondition;

exports.newSource = (url) => {
	precondition(_.isString(url) && url.length > 0, 'ServerDatasetSource requires an url');

	return new ServerDatasetSource(url);
};

class ServerDatasetSource {
	constructor(url) {
		this._url = url;
	}

	getDataset() {
		return RestClient.get(this._url)
			.map((dataset) => {
				return {
					attributes: toAttributes(dataset.attributes),
					data: dataset.data
				};
			});
	}
}

function toAttributes(attributesJson) {
	return _.map(attributesJson, (attributeJson) => {

		// TODO : handle the parsing errors
		return Attribute[attributeJson.type](attributeJson.id, attributeJson.name);
	});
}
