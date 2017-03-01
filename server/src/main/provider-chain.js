(function () {
	"use strict";
	
	var CachedProvider = require('./cached-provider');
	var KijijiListingProvider = require('./kijiji-listing-provider');
	var KijijiDetailsProvider = require('./kijiji-details-provider');
	var GeocodingProvider = require('./geocoding-provider');
	var GroceriesProvider = require('./groceries-provider');
	var DistanceProvider = require('./distance-provider');
	var PriceExtractor = require('./price-extractor');
	var DistrictProvider = require('./district-provider');
	
	exports.fromKijiji = function () {
		return new ProviderChain(new KijijiDetailsProvider(new KijijiListingProvider()));
	};
	
	function ProviderChain(provider) {
		this._provider = provider;
	}
	
	ProviderChain.prototype.cached = function (file) {
		this._provider = new CachedProvider(this._provider, file);
		return this;
	};
	
	ProviderChain.prototype.geocoded = function () {
		this._provider = new GeocodingProvider(this._provider);
		return this;
	};
	
	ProviderChain.prototype.withDistricts = function () {
		this._provider = new DistrictProvider(this._provider);
		return this;
	};
	
	ProviderChain.prototype.withGroceries = function (key) {
		this._provider = new DistanceProvider(new GroceriesProvider(this._provider, key), 'grocery', key);
		return this;
	};
	
	ProviderChain.prototype.priceCorrected = function () {
		this._provider = new PriceExtractor(this._provider);
		return this;
	};
	
	ProviderChain.prototype.getDataset = function () {
		// TODO have the other providers append elements to the whole dataset instead of just homes
		return this._provider.getHomes().map(function (homes) {
			return {
				attributes: attributes(),
				data: homes
			};
		});
	};
	
	function attributes() {
		return [{
			id: 'price',
			name: 'Price',
			type: 'currency'
		}, {
			id: 'grocery-time',
			name: 'Time to closest grocery',
			type: 'time'
		}, {
			id: 'grocery-distance',
			name: 'Distance to closest grocery',
			type: 'distance'
		}];
	}
}());