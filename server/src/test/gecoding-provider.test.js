"use strict";

var expect  = require('chai').expect;
var Rx = require('rx');
var _ = require('underscore');
var GeocodingProvider = require('../main/geocoding-provider');

describe('A geocoding provider', function () {
	var FAKE_HOMES = [{
		name: 'House A', 
		address: '2323 Avenue Chapdelaine, Ville de Québec, QC G1V 5B9, Canada'
	}];
	
	var geocodingProvider;
	var homesProduced;
	
	before(function (done) {
		geocodingProvider = new GeocodingProvider(createFakeProvider());
		
		geocodingProvider.getHomes().subscribe(function (homes) {
			homesProduced = homes;
		}, done, done);
	});
	
	it('cannot be created without a provider', function () {
		expect(function () {
			geocodingProvider = new GeocodingProvider({});
		}).to.throw(/A GeocodingProvider requires a provider/);
	});
	
	it('preserve all existing fields', function () {
		homesProduced.forEach(function (home, index) {
			_.keys(FAKE_HOMES[index]).forEach(function (key) {
				expect(home[key]).to.deep.equal(FAKE_HOMES[index][key]);
			});
		});
	});
	
	it('add a coordinates field with a latitude and a longitude', function () {
		homesProduced.forEach(function (home) {
			expect(home).to.contain.key('coords');
			expect(home.coords.lat).to.be.a('number');
			expect(home.coords.lng).to.be.a('number');
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