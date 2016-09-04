(function() {
	'use strict';
	
	var RestClient = require('./rest-client');
	
	var precondition = require('./contract').precondition;

	exports.newSource = function (url) {
		precondition(_.isString(url) && url.length > 0, 'ServerHomeSource requires an url');
		
		return new ServerHomeSource(url);
	};

	function ServerHomeSource(url) {
		this._url = url;
	}
	
	ServerHomeSource.prototype.getHomes = function () {
		return RestClient.get(this._url)
			.map(function (homes) {
				return homes.map(readHome);
			});
	};
	
	function readHome(homeJson) {
		return {
			name: homeJson.name,
			url: homeJson.url,
			price: homeJson.price,
			address: homeJson.address,
			coords: homeJson.coords
		};
	}
}());
