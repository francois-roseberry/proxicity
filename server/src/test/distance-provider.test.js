"use strict";

var expect  = require('chai').expect;
var Rx = require('rx');
var _ = require('underscore');
var DistanceProvider = require('../main/distance-provider');
var key = require('../../google_maps_api.key.json').key;

describe('A distance provider', function () {
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
	
	before(function (done) {
		fakeProvider = createFakeProvider();
		distanceProvider = new DistanceProvider(fakeProvider, 'place', key);
		
		distanceProvider.getHomes().subscribe(function (homes) {
			homesProduced = homes;
		}, done, done);
	});
	
	it('cannot be created without a provider', function () {
		expect(function () {
			distanceProvider = new DistanceProvider({});
		}).to.throw(/A DistanceProvider requires a provider/);
	});
	
	it('cannot be created without a place type', function () {
		expect(function () {
			distanceProvider = new DistanceProvider(fakeProvider);
		}).to.throw(/A DistanceProvider requires a place type/);
	});
	
	it('cannot be created without an API key', function () {
		expect(function () {
			distanceProvider = new DistanceProvider(fakeProvider, 'place');
		}).to.throw(/A DistanceProvider requires an API key/);
	});
	
	it('preserve all existing fields except the place', function () {
		homesProduced.forEach(function (home, index) {
			_.without(_.keys(FAKE_HOMES[index]), 'place').forEach(function (key) {
				expect(home[key]).to.deep.equal(FAKE_HOMES[index][key]);
			});
		});
	});
	
	it('preserve all existing fields inside the place', function () {
		homesProduced.forEach(function (home, index) {
			_.keys(FAKE_HOMES[index].place).forEach(function (key) {
				expect(home.place[key]).to.deep.equal(FAKE_HOMES[index].place[key]);
			});
		});
	});
	
	it('add distance and time fields to the place', function () {
		homesProduced.forEach(function (home) {
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