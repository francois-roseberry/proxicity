"use strict";
	
const CachedProvider = require('./cached-provider');
const KijijiListingProvider = require('./kijiji-listing-provider');
const KijijiDetailsProvider = require('./kijiji-details-provider');
const GeocodingProvider = require('./geocoding-provider');
const GroceriesProvider = require('./groceries-provider');
const DistanceProvider = require('./distance-provider');
const PriceExtractor = require('./price-extractor');
const DistrictProvider = require('./district-provider');

class DatasetProvider {
	constructor(provider) {
		this._provider = provider;
	}
	
	cached(file) {
		this._provider = new CachedProvider(this._provider, file);
		return this;
	}
	
	geocoded() {
		this._provider = new GeocodingProvider(this._provider);
		return this;
	}
	
	withDistricts() {
		this._provider = new DistrictProvider(this._provider);
		return this;
	}
	
	withGroceries(key) {
		this._provider = new DistanceProvider(new GroceriesProvider(this._provider, key), 'grocery', key);
		return this;
	}
	
	priceCorrected() {
		this._provider = new PriceExtractor(this._provider);
		return this;
	}
	
	getDataset() {
		// TODO have the other providers append elements to the whole dataset instead of just homes
		return this._provider.getHomes().map((homes) => {
			return {
				attributes: attributes(),
				data: homes
			};
		});
	}
}

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

exports.fromKijiji = function () {
	return new DatasetProvider(new KijijiDetailsProvider(new KijijiListingProvider()));
};