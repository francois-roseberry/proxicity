(function () {
    'use strict';
   
	var precondition = require('./contract').precondition;

    exports.newModel = function (homes) {
		precondition(_.isArray(homes), 'Map Model requires an array of homes');
		
		return new MapModel(homes);
    };
	
	function MapModel(homes) {
		this._geojson = geojsonFrom(homes);
	}
	
	MapModel.prototype.geojson = function () {
		return this._geojson;
	};
	
	function geojsonFrom(homes) {
		return {
			type: 'FeatureCollection',
			features: homes.map(toFeature)
		};
	}
	
	function toFeature(home) {
		return {
			type: 'Feature',
			geometry: {
				type: 'Point',
				coordinates: [home.coords.lng, home.coords.lat]
			},
			properties: {
				name: home.name,
				price: home.price,
				address: home.address
			}
		};
	}
}());