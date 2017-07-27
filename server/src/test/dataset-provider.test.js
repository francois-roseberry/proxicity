"use strict";

const DatasetProvider = require('../main/dataset-provider');
const expect = require('chai').expect;
const _ = require('underscore');
const key = require('../../google_maps_api.key.json').key;
const path = require('path');

describe('A dataset provider', function () {
	this.timeout(10000);

	const CACHE_PATH = '../cache/';
	var provider;

	beforeEach(() => {
		provider = DatasetProvider.fromKijiji()
			.cached(path.join(CACHE_PATH, 'kijiji-homes.json'))
			.geocoded()
			.cached(path.join(CACHE_PATH, 'geocoded-homes.json'))
			.priceCorrected()
			.withGroceries(key)
			.cached(path.join(CACHE_PATH, 'homes-with-groceries.json'));
	});

	describe('when home level is queried', () => {
		var dataset;

		beforeEach((done) => {
			provider.getDataset('home').subscribe((result) => {
				dataset = result;
				done();
			});
		});

		it('contains an attribute array with 3 attributes', () => {
			expect(dataset.attributes.length).to.eql(3);

			expect(dataset.attributes[0].id).to.eql('price');
			expect(_.isString(dataset.attributes[0].name)).to.eql(true);
			expect(dataset.attributes[0].type).to.eql('currency');

			expect(dataset.attributes[1].id).to.eql('grocery-time');
			expect(_.isString(dataset.attributes[1].name)).to.eql(true);
			expect(dataset.attributes[1].type).to.eql('time');

			expect(dataset.attributes[2].id).to.eql('grocery-distance');
			expect(_.isString(dataset.attributes[2].name)).to.eql(true);
			expect(dataset.attributes[2].type).to.eql('distance');
		});
	});

	describe('when district level is queried', () => {
		var dataset;

		beforeEach((done) => {
			provider.getDataset('district').subscribe((result) => {
				dataset = result;
				done();
			});
		});

		it('contains an attribute array with 3 attributes', () => {
			expect(dataset.attributes.length).to.eql(3);

			expect(dataset.attributes[0].id).to.eql('average-price');
			expect(_.isString(dataset.attributes[0].name)).to.eql(true);
			expect(dataset.attributes[0].type).to.eql('currency');

			expect(dataset.attributes[1].id).to.eql('average-grocery-time');
			expect(_.isString(dataset.attributes[1].name)).to.eql(true);
			expect(dataset.attributes[1].type).to.eql('time');

			expect(dataset.attributes[2].id).to.eql('average-grocery-distance');
			expect(_.isString(dataset.attributes[2].name)).to.eql(true);
			expect(dataset.attributes[2].type).to.eql('distance');
		});
	});
});
