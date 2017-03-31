"use strict";

const expect  = require('chai').expect;
const Rx = require('rx');
const _ = require('underscore');
const DistanceProvider = require('../main/distance-provider');
const key = require('../../google_maps_api.key.json').key;

describe('A distance provider', () => {
	var FAKE_HOMES = [{
		name: 'House A', 
		address: '101, rue Sainte-Anne, Québec, QC, G1R 3X6',
		place: {
			address: '42 Rue des Jardins, Ville de Québec'
		}
	}];
	
	var distanceProvider;
	var fakeProvider;
	var homesProduced;
	
	before((done) => {
		fakeProvider = createFakeProvider();
		distanceProvider = new DistanceProvider(fakeProvider, 'place', key);
		
		distanceProvider.getHomes().subscribe((homes) => {
			homesProduced = homes;
		}, done, done);
	});
	
	it('cannot be created without a provider', () => {
		expect(() => {
			distanceProvider = new DistanceProvider({});
		}).to.throw(/A DistanceProvider requires a provider/);
	});
	
	it('cannot be created without a place type', () => {
		expect(() => {
			distanceProvider = new DistanceProvider(fakeProvider);
		}).to.throw(/A DistanceProvider requires a place type/);
	});
	
	it('cannot be created without an API key', () => {
		expect(() => {
			distanceProvider = new DistanceProvider(fakeProvider, 'place');
		}).to.throw(/A DistanceProvider requires an API key/);
	});
	
	it('preserve all existing fields except the place', () => {
		homesProduced.forEach((home, index) => {
			_.without(_.keys(FAKE_HOMES[index]), 'place').forEach((key) => {
				expect(home[key]).to.deep.equal(FAKE_HOMES[index][key]);
			});
		});
	});
	
	it('preserve all existing fields inside the place', () => {
		homesProduced.forEach((home, index) => {
			_.keys(FAKE_HOMES[index].place).forEach((key) => {
				expect(home.place[key]).to.deep.equal(FAKE_HOMES[index].place[key]);
			});
		});
	});
	
	it('add distance and time fields to the place', () => {
		homesProduced.forEach((home) => {
			expect(home.place.distance).to.be.a('number');
			expect(home.place.time).to.be.a('number');
		});
	});
	
	function createFakeProvider() {
		return {
			getHomes: function () {
				var subject = new Rx.AsyncSubject();
				subject.onNext(FAKE_HOMES);
				subject.onCompleted();
				return subject;
			}
		};
	}
});