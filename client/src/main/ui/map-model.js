'use strict';

var precondition = require('./contract').precondition;

exports.MAX_COLOR = '#ff0000';
exports.MIN_COLOR = '#0000ff';
exports.NO_DATA_COLOR = '#333333';
exports.BASE_URL = "http://www.kijiji.ca";

exports.newModel = (dataset) => {
	precondition(dataset && _.isArray(dataset.attributes) && _.isArray(dataset.data),
			'Map Model requires a dataset with an array of attributes and an array of homes');

	return new MapModel(dataset);
};

class MapModel {
	constructor(dataset) {
		this._attributes = dataset.attributes;
		this._homes = dataset.data;
		this._geojson = new Rx.BehaviorSubject(geojsonFrom(dataset.data, dataset.attributes[0].id()));
	}

	geojson() {
		return this._geojson.asObservable();
	};

	attributes() {
		return this._attributes;
	};

	categories() {
		return this._geojson.map(toCategories(this._attributes)).asObservable();
	};

	changeActiveAttribute(attribute) {
		precondition(isValidAttributeId(this._attributes, attribute),
			'Can only change active attribute to a valid one');

		this._geojson.onNext(geojsonFrom(this._homes, attribute));
	};
}

function isValidAttributeId(attributes, attributeToCheck) {
	return _.some(attributes, (attribute) => {
		return attribute.id() === attributeToCheck;
	});
}

function toCategories(attributes) {
	return (geojson) => {
		var attribute = _.find(attributes, (attribute) => {
			return attribute.id() === geojson.properties.attribute;
		});

		var accessors = geojson.properties.attribute.split('-');
		var noDataCount = geojson.features.filter((feature) => {
			var property = feature.properties;
			_.each(accessors, (accessor) => {
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

	return homes.filter((home) => {
		var property = home;
		_.each(accessors, (accessor) => {
			property = property[accessor];
		});
		return !!property;
	}).map((home) => {
		var property = home;
		_.each(accessors, (accessor) => {
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
	return (home) => {
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
				color: colorFor(attributeId, home, scale),
				url: exports.BASE_URL + home.url
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
