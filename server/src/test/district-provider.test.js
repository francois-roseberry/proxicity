"use strict";

var expect  = require('chai').expect;
var Rx = require('rx');
var _ = require('underscore');
var DistrictProvider = require('../main/district-provider');

describe('A district provider', function () {
	var DISTRICT_FILE = 'districts.json';
	
	var FAKE_HOMES = [{
		name: 'House A', 
		coords: {
			lng: 1,
			lat: 1
		}
	}, {
		name: 'House B, in Loretteville',
		coords: {
			lng: -71.371633,
			lat: 46.862459
		}
	}];
	
	var DISTRICT_LORETTEVILLE_ID = 0;
	
	var districtProvider;
	var fakeProvider;
	var homesProduced;
	
	before(function (done) {
		fakeProvider = createFakeProvider();
		districtProvider = new DistrictProvider(fakeProvider, DISTRICT_FILE);
		
		districtProvider.getHomes().subscribe(function (homes) {
			homesProduced = homes;
		}, done, done);
	});
	
	it('cannot be created without a provider', function () {
		expect(function () {
			districtProvider = new DistrictProvider({});
		}).to.throw(/A DistrictProvider requires a provider/);
	});
	
	it('preserve all existing fields', function () {
		homesProduced.forEach(function (home, index) {
			_.keys(FAKE_HOMES[index]).forEach(function (key) {
				expect(home[key]).to.deep.equal(FAKE_HOMES[index][key]);
			});
		});
	});
	
	it('writes a file with ids for districts', function () {
		// TODO
		// maybe I should reuse the cached reader for that
	});
	
	it('when house is inside a district, adds a district field with its id', function () {
		expect(homesProduced[1].district).to.eql(DISTRICT_LORETTEVILLE_ID);
	});
	
	it('when point is outside any district, adds a district field with a value of -1', function () {
		expect(homesProduced[0].district).to.eql(-1);
	});
	
	it('if district file cannot be read, throws an error', function (done) {
		var provider = new DistrictProvider(fakeProvider, 'wrong-file-path');
		provider.getHomes().subscribe(function () {
			throw new Error('should throw an error');
		}, function () {
			done();
		}, done);
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