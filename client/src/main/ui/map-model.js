(function () {
    'use strict';
   
	var precondition = require('./contract').precondition;
	
	exports.MAX_COLOR = '#ff0000';
	exports.MIN_COLOR = '#0000ff';
	exports.NO_DATA_COLOR = '#333333';

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
		var data = homes.filter(function (home) {
				return !!home.price;
			}).map(function (home) {
				return home.price;
			});
		var minimum = d3.min(data);
        var maximum = d3.max(data);
        var scale = d3.scale.linear()
            .domain([minimum, maximum])
            .range([exports.MIN_COLOR, exports.MAX_COLOR]);
			
		return {
			type: 'FeatureCollection',
			features: homes.map(toFeature(scale))
		};
	}
	
	function toFeature(scale) {
		return function (home) {
			return {
				type: 'Feature',
				geometry: {
					type: 'Point',
					coordinates: [home.coords.lng, home.coords.lat]
				},
				properties: {
					name: home.name,
					price: home.price,
					address: home.address,
					color: (home.price ? scale(home.price) : exports.NO_DATA_COLOR)
				}
			};
		};
	}
}());