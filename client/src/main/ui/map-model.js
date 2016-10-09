(function () {
    'use strict';
   
	var precondition = require('./contract').precondition;
	var i18n = require('./i18n').i18n();
	
	exports.MAX_COLOR = '#ff0000';
	exports.MIN_COLOR = '#0000ff';
	exports.NO_DATA_COLOR = '#333333';

    exports.newModel = function (homes) {
		precondition(_.isArray(homes), 'Map Model requires an array of homes');
		
		return new MapModel(homes);
    };
	
	function MapModel(homes) {
		this._bounds = boundsOf(homes);
		this._geojson = geojsonFrom(homes, this._bounds);
	}
	
	MapModel.prototype.geojson = function () {
		return this._geojson;
	};
	
	MapModel.prototype.criteria = function () {
		return [{
			id: 'price',
			name: i18n.CRITERIA_PRICE
		}];
	};
	
	MapModel.prototype.categories = function () {
		return [{
				max : {
					color: exports.MAX_COLOR,
					value: this._bounds.max
				},
				min: {
					color: exports.MIN_COLOR,
					value: this._bounds.min
				}
			}, {
				color: exports.NO_DATA_COLOR,
				count: this._geojson.features.filter(function (feature) {
					return !feature.properties.price;
				}).length
			}];
	};
	
	function boundsOf(homes) {
		var data = homes.filter(function (home) {
				return !!home.price;
			}).map(function (home) {
				return home.price;
			});
		
		return {
			max: d3.max(data),
			min: d3.min(data)
		};
	}
	
	function geojsonFrom(homes, bounds) {
        var scale = d3.scale.linear()
            .domain([bounds.min, bounds.max])
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
					posted: home.posted,
					grocery: home.grocery,
					color: (home.price ? scale(home.price) : exports.NO_DATA_COLOR)
				}
			};
		};
	}
}());