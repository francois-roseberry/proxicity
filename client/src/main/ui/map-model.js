(function () {
    'use strict';
   
	var precondition = require('./contract').precondition;
	
	exports.MAX_COLOR = '#ff0000';
	exports.MIN_COLOR = '#0000ff';
	exports.NO_DATA_COLOR = '#333333';

    exports.newModel = function (dataset) {
		precondition(dataset && _.isArray(dataset.attributes) && _.isArray(dataset.data),
				'Map Model requires a dataset with an array of attributes and an array of homes');
		
		return new MapModel(dataset);
    };
	
	function MapModel(dataset) {
		this._attributes = dataset.attributes;
		this._homes = dataset.data;
		this._geojson = new Rx.BehaviorSubject(geojsonFrom(dataset.data, dataset.attributes[0].id()));
	}
	
	MapModel.prototype.geojson = function () {
		return this._geojson.asObservable();
	};
	
	MapModel.prototype.attributes = function () {
		return this._attributes;
	};
	
	MapModel.prototype.categories = function () {
		return this._geojson.map(toCategories(this._attributes)).asObservable();
	};
	
	MapModel.prototype.changeActiveAttribute = function (attribute) {
		precondition(isValidAttributeId(this._attributes, attribute),
			'Can only change active attribute to a valid one');
		
		this._geojson.onNext(geojsonFrom(this._homes, attribute));
	};
	
	function isValidAttributeId(attributes, attributeToCheck) {
		return _.some(attributes, function (attribute) {
			return attribute.id() === attributeToCheck;
		});
	}
	
	function toCategories(attributes) {
		return function (geojson) {
			var attribute = _.find(attributes, function (attribute) {
				return attribute.id() === geojson.properties.attribute;
			});
			
			var accessors = geojson.properties.attribute.split('-');
			var noDataCount = geojson.features.filter(function (feature) {
				var property = feature.properties;
				_.each(accessors, function (accessor) {
					property = property[accessor];
				});
				return !property;
			}).length;
		    var categories = [{
				max : {
					color: exports.MAX_COLOR,
					value: attribute.format(geojson.properties.bounds.max)
				},
				min: {
					color: exports.MIN_COLOR,
					value: attribute.format(geojson.properties.bounds.min)
				}
			}];
		    
		    if (noDataCount > 0) {
		    	categories.push({
					color: exports.NO_DATA_COLOR,
					count: noDataCount
				});
		    }
			
			return categories;
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
		var accessors = attributeId.split('-');
		
		return homes.filter(function (home) {
			var property = home;
			_.each(accessors, function (accessor) {
				property = property[accessor];
			});
			return !!property;
		}).map(function (home) {
			var property = home;
			_.each(accessors, function (accessor) {
				property = property[accessor];
			});
			return property;
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