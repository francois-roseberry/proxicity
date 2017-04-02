"use strict";

const precondition = require('./infrastructure/contract').precondition;
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
	
	getDataset(level) {
		precondition(level === 'home' || level === 'district', 'Queried level must be home or district');
		console.log('Level queried: ' + level);
		
		return this._provider.getHomes().map((homes) => {
			return {
				attributes: attributesFor(level),
				data: homes
			};
		});
	}
}

function attributesFor(level) {
	if (level === 'home') {
		return attributesForHomeLevel();
	}
	
	return attributesForDistrictLevel();
}

function attributesForHomeLevel() {
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

function attributesForDistrictLevel() {
	return [{
		id: 'average-price',
		name: 'Average price',
		type: 'currency'
	}, {
		id: 'average-grocery-time',
		name: 'Average time to closest grocery',
		type: 'time'
	}, {
		id: 'average-grocery-distance',
		name: 'Average distance to closest grocery',
		type: 'distance'
	}];
}

exports.fromKijiji = function () {
	return new DatasetProvider(new KijijiDetailsProvider(new KijijiListingProvider()));
};