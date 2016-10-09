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
		this._homes = homes;
		this._geojson = new Rx.BehaviorSubject(geojsonFrom(homes, 'price'));
	}
	
	MapModel.prototype.geojson = function () {
		return this._geojson.asObservable();
	};
	
	MapModel.prototype.criteria = function () {
		return [{
			id: 'price',
			name: i18n.CRITERIA_PRICE
		}, {
			id: 'grocery-time',
			name: i18n.CRITERIA_GROCERY_TIME
		}];
	};
	
	MapModel.prototype.categories = function () {
		return this._geojson.map(toCategories).asObservable();
	};
	
	MapModel.prototype.changeActiveCriteria = function (criterion) {
		precondition(isValidCriterion(this.criteria(), criterion), 'Can only change active criteria to a valid one');
		
		this._geojson.onNext(geojsonFrom(this._homes, criterion));
	};
	
	function isValidCriterion(criteria, criterionToCheck) {
		return _.some(criteria, function (criterion) {
			return criterion.id === criterionToCheck;
		});
	}
	
	function toCategories(geojson) {
		return [{
				max : {
					color: exports.MAX_COLOR,
					value: geojson.properties.bounds.max
				},
				min: {
					color: exports.MIN_COLOR,
					value: geojson.properties.bounds.min
				}
			}, {
				color: exports.NO_DATA_COLOR,
				count: geojson.features.filter(function (feature) {
					return !feature.properties.price;
				}).length
			}];
	}
	
	function boundsOf(homes, criterion) {
		var data = dataFor(homes, criterion);
		
		return {
			max: d3.max(data),
			min: d3.min(data)
		};
	}
	
	function dataFor(homes, criterion) {
		if (criterion === 'price') {
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
	
	function geojsonFrom(homes, criterion) {
		var bounds = boundsOf(homes, criterion);
        var scale = d3.scale.linear()
            .domain([bounds.min, bounds.max])
            .range([exports.MIN_COLOR, exports.MAX_COLOR]);
			
		return {
			type: 'FeatureCollection',
			features: homes.map(toFeature(scale, criterion)),
			properties: {
				bounds: bounds
			}
		};
	}
	
	function toFeature(scale, criterion) {
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
					color: colorFor(criterion, home, scale)
				}
			};
		};
	}
	
	function colorFor(criterion, home, scale) {
		if (criterion === 'price') {
			return home.price ? scale(home.price) : exports.NO_DATA_COLOR;			
		}
		
		return scale(home.grocery.time);
	}
}());