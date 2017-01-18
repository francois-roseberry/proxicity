(function () {
    'use strict';
   
	var precondition = require('./contract').precondition;
	var i18n = require('./i18n').i18n();
	var TimeFormatter = require('./time-formatter');
	
	exports.MAX_COLOR = '#ff0000';
	exports.MIN_COLOR = '#0000ff';
	exports.NO_DATA_COLOR = '#333333';

    exports.newModel = function (dataset) {
		precondition(dataset && _.isArray(dataset.data), 'Map Model requires an array of homes');
		
		return new MapModel(dataset.data);
    };
	
	function MapModel(homes) {
		this._homes = homes;
		this._geojson = new Rx.BehaviorSubject(geojsonFrom(homes, 'price'));
	}
	
	MapModel.prototype.geojson = function () {
		return this._geojson.asObservable();
	};
	
	MapModel.prototype.attributes = function () {
		return [{
			id: 'price',
			name: i18n.CRITERIA_PRICE,
			format: function (value) {
				return value + ' $';
			},
			noDataCountFor: function (geojson) {
				return geojson.features.filter(function (feature) {
						return !feature.properties.price;
					}).length;
			}
		}, {
			id: 'grocery-time',
			name: i18n.CRITERIA_GROCERY_TIME,
			format: function (value) {
				return TimeFormatter.format(value);
			},
			noDataCountFor: function () {
				return 0;
			}
		}];
	};
	
	MapModel.prototype.categories = function () {
		return this._geojson.map(toCategories(this.attributes())).asObservable();
	};
	
	MapModel.prototype.changeActiveAttribute = function (attribute) {
		precondition(isValidAttributeId(this.attributes(), attribute),
			'Can only change active attribute to a valid one');
		
		this._geojson.onNext(geojsonFrom(this._homes, attribute));
	};
	
	function isValidAttributeId(attributes, attributeToCheck) {
		return _.some(attributes, function (attribute) {
			return attribute.id === attributeToCheck;
		});
	}
	
	function toCategories(attributes) {
		return function (geojson) {
			var attribute = _.find(attributes, function (attribute) {
				return attribute.id === geojson.properties.attribute;
			});
			
			return [{
					max : {
						color: exports.MAX_COLOR,
						value: attribute.format(geojson.properties.bounds.max)
					},
					min: {
						color: exports.MIN_COLOR,
						value: attribute.format(geojson.properties.bounds.min)
					}
				}, {
					color: exports.NO_DATA_COLOR,
					count: attribute.noDataCountFor(geojson)
				}];
		};
	}
	
	function boundsOf(homes, attributeId) {
		var data = dataFor(homes, attributeId);
		
		return {
			max: d3.max(data),
			min: d3.min(data)
		};
	}
	
	function dataFor(homes, attributeId) {
		if (attributeId === 'price') {
			return homes.filter(function (home) {
				return !!home.price;
			}).map(function (home) {
				return home.price;
			});
		}
		
		return homes.map(function (home) {
			return home.grocery.time;
		});
	}
	
	function geojsonFrom(homes, attributeId) {
		var bounds = boundsOf(homes, attributeId);
        var scale = d3.scale.linear()
            .domain([bounds.min, bounds.max])
            .range([exports.MIN_COLOR, exports.MAX_COLOR]);
			
		return {
			type: 'FeatureCollection',
			features: homes.map(toFeature(scale, attributeId)),
			properties: {
				attribute: attributeId,
				bounds: bounds
			}
		};
	}
	
	function toFeature(scale, attributeId) {
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
					color: colorFor(attributeId, home, scale)
				}
			};
		};
	}
	
	function colorFor(attributeId, home, scale) {
		if (attributeId === 'price') {
			return home.price ? scale(home.price) : exports.NO_DATA_COLOR;			
		}
		
		return scale(home.grocery.time);
	}
}());